<template>
  <div class="masonry-container" ref="masonryContainer">
    <!-- Loading state -->
    <div v-if="loading" class="masonry-loading">
      <div class="loading-spinner"></div>
      <p>Loading photos...</p>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="images.length === 0" class="masonry-empty">
      <p>No photos found</p>
    </div>
    
    <!-- Masonry layout -->
    <div v-else class="masonry-grid">
      <div 
        v-for="(column, columnIndex) in columns" 
        :key="`column-${columnIndex}`"
        class="masonry-column"
      >
        <div 
          v-for="(image, imageIndex) in column" 
          :key="`image-${image.id || imageIndex}`"
          class="masonry-item"
          :class="{ 'is-loading': !loadedImages[getImageKey(image)] }"
        >
          <div class="masonry-image-container" @click="handleImageClick(image)">
            <img
              :src="image.src"
              :alt="image.alt || 'Wedding photograph'"
              class="masonry-image"
              @load="handleImageLoad($event, image)"
            />
            
            <!-- Loading overlay -->
            <div v-if="!loadedImages[getImageKey(image)]" class="image-loading-overlay">
              <div class="loading-spinner-small"></div>
            </div>
            
            <!-- Hover overlay with info -->
            <div class="image-hover-overlay">
              <div class="image-info">
                <p v-if="image.category" class="image-category">{{ image.category }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading progress indicator -->
    <div v-if="loadingProgress < 100 && images.length > 0" class="loading-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <p class="progress-text">Loading images: {{ loadedCount }}/{{ images.length }}</p>
    </div>
    
    <!-- Image viewer modal -->
    <div v-if="selectedImage" class="image-viewer-overlay" @click="closeViewer">
      <div class="image-viewer-container" @click.stop>
        <button class="close-button" @click="closeViewer">&times;</button>
        <img :src="selectedImage.src" :alt="selectedImage.alt" class="viewer-image" />
        <div class="viewer-info">
          <p v-if="selectedImage.category" class="viewer-category">{{ selectedImage.category }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

// Define props
const props = defineProps({
  // Array of image objects
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  // Number of columns at different breakpoints
  columnCount: {
    type: Object,
    default: () => ({
      default: 4,  // Default column count
      1280: 4,     // Large desktop
      1024: 3,     // Desktop
      768: 2,      // Tablet
      640: 1       // Mobile
    })
  },
  // Gap between images in pixels
  gap: {
    type: Number,
    default: 6  // Increased from 6px to 8px for better spacing with fewer columns
  },
  // Initial loading state
  loading: {
    type: Boolean,
    default: false
  }
});

// Emit events
const emit = defineEmits(['imageClick', 'allImagesLoaded']);

// Refs
const masonryContainer = ref(null);
const activeColumns = ref(props.columnCount.default);
const loadedImages = ref({});
const loadedCount = ref(0);
const imageHeights = ref({});
const selectedImage = ref(null);

// Computed values
const loadingProgress = computed(() => {
  if (props.images.length === 0) return 100;
  return Math.floor((loadedCount.value / props.images.length) * 100);
});

// Create a unique key for each image
const getImageKey = (image) => {
  return image.id || image.src;
};

// Handle image click
const handleImageClick = (image) => {
  selectedImage.value = image;
  emit('imageClick', image);
  document.body.style.overflow = 'hidden';
};

// Close image viewer
const closeViewer = () => {
  selectedImage.value = null;
  document.body.style.overflow = '';
};

// Update column distribution based on actual image dimensions
const columns = computed(() => {
  const columnCount = activeColumns.value;
  
  // Initialize column arrays and height trackers
  let cols = Array.from({ length: columnCount }, () => []);
  let colHeights = Array(columnCount).fill(0);
  
  props.images.forEach(image => {
    // Find the shortest column
    const shortestCol = colHeights.indexOf(Math.min(...colHeights));
    
    // Add image to the shortest column
    cols[shortestCol].push(image);
    
    // Get the height contribution from real dimensions or estimate
    const imageKey = getImageKey(image);
    const heightFactor = imageHeights.value[imageKey] || getEstimatedHeight(image);
    
    // Update column height tracker
    colHeights[shortestCol] += heightFactor + props.gap;
  });
  
  return cols;
});

// Estimate height factor based on aspect ratio or default values
const getEstimatedHeight = (image) => {
  let aspectRatio = 1; // Default (square)
  
  if (image.width && image.height) {
    aspectRatio = image.width / image.height;
  } else if (image.aspectRatio) {
    if (typeof image.aspectRatio === 'string' && image.aspectRatio.includes('/')) {
      const [width, height] = image.aspectRatio.split('/').map(Number);
      aspectRatio = width / height;
    } else {
      aspectRatio = image.aspectRatio;
    }
  }
  
  // Calculate height based on normalized width (e.g., 100 units)
  return 100 / aspectRatio;
};

// Handle image load event with accurate dimensions
const handleImageLoad = (event, image) => {
  const img = event.target;
  const key = getImageKey(image);
  
  // Store the actual aspect ratio
  if (img.naturalWidth && img.naturalHeight) {
    imageHeights.value[key] = 100 / (img.naturalWidth / img.naturalHeight);
  }
  
  loadedImages.value[key] = true;
  loadedCount.value++;
  
  // If all images are loaded, emit event
  if (loadedCount.value === props.images.length) {
    emit('allImagesLoaded');
  }
};

// Handle escape key to close viewer
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && selectedImage.value) {
    closeViewer();
  }
};

// Update columns on window resize
const updateColumnCount = () => {
  if (!window) return;
  
  const width = window.innerWidth;
  const breakpoints = Object.keys(props.columnCount)
    .filter(bp => bp !== 'default')
    .map(Number)
    .sort((a, b) => b - a); // Sort descending
  
  // Find the appropriate breakpoint
  for (const breakpoint of breakpoints) {
    if (width >= breakpoint) {
      activeColumns.value = props.columnCount[breakpoint];
      return;
    }
  }
  
  // If no breakpoint matches, use default
  activeColumns.value = props.columnCount.default;
};

// Initialize and set up event handlers
onMounted(() => {
  document.documentElement.style.setProperty('--masonry-gap', `${props.gap}px`);
  updateColumnCount();
  window.addEventListener('resize', updateColumnCount);
  window.addEventListener('keydown', handleKeyDown);
});

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener('resize', updateColumnCount);
  window.removeEventListener('keydown', handleKeyDown);
  if (selectedImage.value) {
    document.body.style.overflow = '';
  }
});

// Watch for changes in the images array
watch(() => props.images, () => {
  loadedCount.value = 0;
  loadedImages.value = {};
  imageHeights.value = {};
}, { deep: true });
</script>

<style scoped>
.masonry-container {
  position: relative;
  width: 100%;
}

.masonry-loading,
.masonry-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #666;
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4a5568;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-spinner-small {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.masonry-grid {
  display: flex;
  gap: var(--masonry-gap, 4px);
  width: 100%;
}

.masonry-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--masonry-gap, 4px);
}

.masonry-item {
  position: relative;
  break-inside: avoid;
  page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  transition: opacity 0.3s ease;
}

.masonry-item.is-loading {
  min-height: 150px;
  background-color: #f1f5f9;
}

.masonry-image-container {
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.07);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #f8f9fa;
  line-height: 0;
  cursor: pointer;
}

.masonry-image-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.12);
}

.masonry-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.masonry-image-container:hover .masonry-image {
  transform: scale(1.02);
}

.image-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.image-hover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  z-index: 1;
}

.masonry-image-container:hover .image-hover-overlay {
  opacity: 1;
}

.image-info {
  padding: 0.8rem;
  color: white;
  width: 100%;
}

.image-category {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.loading-progress {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 250px;
  z-index: 10;
}

.progress-bar {
  height: 6px;
  background-color: #edf2f7;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background-color: #4a5568;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #4a5568;
  margin: 0;
}

/* Image viewer modal styles */
.image-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 2rem;
}

.image-viewer-container {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.viewer-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: cover;
}

.close-button {
  position: absolute;
  top: -2rem;
  right: -2rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.viewer-info {
  margin-top: 1rem;
  color: white;
  text-align: center;
}

.viewer-category {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}
</style> 