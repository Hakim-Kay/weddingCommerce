<template>
  <div class="landing-page">
    <header class="hero">
      <h1 class="hero-title">Elisa & Makini</h1>
      <p class="hero-subtitle">Wedding Photography</p>
    </header>

    <!-- Category navigation -->
    <client-only>
      <div class="category-nav">
        <button 
          @click="setActiveCategory('all')" 
          class="category-btn"
          :class="{ active: activeCategory === 'all' }"
        >
          All Photos
        </button>
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="setActiveCategory(category.id)"
          class="category-btn"
          :class="{ active: activeCategory === category.id }"
        >
          {{ category.name }}
        </button>
      </div>
    </client-only>

    <!-- Debug panel (only visible when there are errors) -->
    <div v-if="debugInfo.errors.length > 0" class="debug-panel">
      <h3>Debug Information</h3>
      <pre>{{ debugInfo }}</pre>
    </div>

    <!-- Masonry Grid Component -->
    <MasonryGrid
      :images="processedImages"
      :loading="loading"
      :column-count="{ 
        default: 2,
        480: 2,
        640: 3,
        768: 3,
        1024: 4, 
        1280: 5
      }"
      :gap="8"
      @allImagesLoaded="handleAllImagesLoaded"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getTwicPicsSrc } from '~/utils/twicpics';

// Get the Supabase client from the plugin
const { $supabase } = useNuxtApp();

// Debug information
const debugInfo = ref({
  apiStatus: 'Not checked',
  folderCount: 0,
  imageCount: 0,
  errors: []
});

// Categories based on the folders in Supabase
const categories = [
  { id: 'Bachelors', name: 'Bachelors' },
  { id: 'Nikah', name: 'Nikah' },
  { id: 'Reception', name: 'Reception' },
  { id: 'Studio', name: 'Studio' },
  { id: 'Miscellaneous', name: 'Miscellaneous' }
];

const activeCategory = ref('all');
const images = ref([]);
const loading = ref(true);

// Process images to format expected by MasonryGrid component
const processedImages = computed(() => {
  if (activeCategory.value === 'all') {
    return images.value;
  }
  return images.value.filter(image => image.category === activeCategory.value);
});

// Set active category
function setActiveCategory(category) {
  activeCategory.value = category;
}

// All images loaded callback
function handleAllImagesLoaded() {
  console.log('All images loaded successfully');
}

// Pre-load image dimensions
function preloadImageDimensions(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0, aspectRatio: 1.5 });
    };
    img.src = url;
  });
}

// Fetch images from Supabase Storage
async function fetchImages() {
  loading.value = true;
  debugInfo.value = {
    apiStatus: 'Checking...',
    folderCount: 0,
    imageCount: 0,
    errors: []
  };
  
  try {
    // Check if Supabase is accessible
    try {
      const { error } = await $supabase.from('any_table_that_exists').select('count').limit(1);
      debugInfo.value.apiStatus = error ? 'Error: ' + error.message : 'Connected';
    } catch (e) {
      debugInfo.value.apiStatus = 'Error connecting to Supabase: ' + e.message;
      debugInfo.value.errors.push(e.message);
    }
    
    // Get list of all folders
    const folderPromises = categories.map(category => {
      return $supabase.storage
        .from('Wedding Images')
        .list(category.id);
    });

    const folderResults = await Promise.all(folderPromises);
    debugInfo.value.folderCount = folderResults.filter(r => !r.error).length;
    
    // Process results from each folder
    let allImages = [];
    let dimensionPromises = [];
    
    folderResults.forEach((result, index) => {
      if (result.error) {
        console.error(`Error fetching ${categories[index].id} images:`, result.error);
        debugInfo.value.errors.push(`Error in ${categories[index].id}: ${result.error.message}`);
        return;
      }
      
      const imageFiles = result.data.filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i));
      debugInfo.value.imageCount += imageFiles.length;
      
      imageFiles.forEach(file => {
        // Create a unique ID for the image
        const id = `${categories[index].id}-${file.name}`;
        const publicUrl = $supabase.storage
          .from('Wedding Images')
          .getPublicUrl(`${categories[index].id}/${file.name}`).data.publicUrl;
        
        // Create image object
        const imageObj = {
          id,
          src: publicUrl,
          path: getTwicPicsSrc(`${categories[index].id}/${file.name}`),
          category: categories[index].id,
          fullPath: `${categories[index].id}/${file.name}`,
          alt: `${categories[index].name} wedding photograph`
        };
        
        // Add to images array
        allImages.push(imageObj);
        
        // Queue dimension preload
        dimensionPromises.push(
          preloadImageDimensions(publicUrl).then(dimensions => {
            imageObj.width = dimensions.width;
            imageObj.height = dimensions.height;
            imageObj.aspectRatio = dimensions.aspectRatio;
          })
        );
      });
    });
    
    // Try to preload some dimensions (but don't wait for all to complete)
    try {
      // Only wait for the first few images to avoid long loading times
      await Promise.all(dimensionPromises.slice(0, 10));
      // Let the rest load in the background
      Promise.all(dimensionPromises.slice(10)).catch(() => {});
    } catch (e) {
      console.warn('Some images failed to preload dimensions', e);
    }
    
    // Randomize the order of images for the gallery
    allImages.sort(() => Math.random() - 0.5);
    
    console.log(`Loaded ${allImages.length} images from Supabase`);
    debugInfo.value.totalLoadedImages = allImages.length;
    
    images.value = allImages;
  } catch (error) {
    console.error('Error fetching images:', error);
    debugInfo.value.errors.push('Global error: ' + error.message);
  } finally {
    loading.value = false;
  }
}

// Load images when component is mounted
onMounted(() => {
  fetchImages();
});

// Clean up resources when component is unmounted
onUnmounted(() => {
  // Clean up any event listeners or resources
});
</script>

<style scoped>
.landing-page {
  max-width: calc(100vw - 0.5rem);
  margin: 0 auto;
  padding: 4px;
}

.hero {
  text-align: center;
  padding: 2rem 1rem;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #666;
}

.category-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn.active {
  background: #4a5568;
  color: white;
  border-color: #4a5568;
}

.category-btn:hover:not(.active) {
  background: #f7fafc;
}

.debug-panel {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  border: 1px solid #ef4444;
}

.debug-panel h3 {
  color: #b91c1c;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.debug-panel pre {
  white-space: pre-wrap;
  font-size: 0.875rem;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 0.25rem;
  max-height: 300px;
  overflow: auto;
}
</style>
