<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Wedding Photo Gallery</h1>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <USpinner size="lg" />
    </div>
    
    <!-- Error state -->
    <UAlert v-if="error" type="danger" class="mb-6">
      {{ error }}
    </UAlert>
    
    <!-- Gallery grid -->
    <div v-if="!isLoading && images.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="image in images" :key="image.key" @click="viewImage(image)" class="cursor-pointer">
        <ImageCard 
          :fileKey="image.key" 
          :name="image.name" 
          :size="image.size"
          :customId="image.customId || ''" 
        />
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="!isLoading && images.length === 0" class="text-center py-12">
      <p class="text-gray-500">No wedding photos found</p>
    </div>
    
    <!-- Load more button -->
    <div v-if="hasMore" class="flex justify-center mt-8">
      <UButton @click="loadMore" :loading="isLoadingMore">
        Load More Photos
      </UButton>
    </div>
    
    <!-- View Image Modal -->
    <UModal v-model="isViewModalOpen">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-4" v-if="selectedImage">{{ selectedImage.name }}</h3>
        <div v-if="selectedImage" class="mb-4">
          <img :src="`https://${appId}.ufs.sh/f/${selectedImage.key}`" :alt="selectedImage.name" class="max-w-full max-h-[70vh] mx-auto" />
        </div>
        <div v-if="selectedImage && selectedImage.customId" class="mb-4">
          <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            ID: {{ selectedImage.customId }}
          </span>
        </div>
        <div class="flex justify-end">
          <UButton color="gray" @click="isViewModalOpen = false">
            Close
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// Define types for the UploadThing image
interface UploadThingImage {
  key: string;
  name: string;
  size: number;
  url: string;
  customId?: string | null;
  status: 'Uploaded' | 'Uploading' | 'Failed' | 'Deletion Pending';
  id: string;
  uploadedAt: number;
}

// Define types for the API response
interface ImagesResponse {
  images: UploadThingImage[];
  hasMore: boolean;
}

const config = useRuntimeConfig();
const appId = config.public.uploadthingAppId;

// State
const images = ref<UploadThingImage[]>([]);
const isLoading = ref(true);
const isLoadingMore = ref(false);
const error = ref<string | null>(null);
const hasMore = ref(false);

// View modal state
const isViewModalOpen = ref(false);
const selectedImage = ref<UploadThingImage | null>(null);

// Fetch images on component mount
onMounted(async () => {
  await fetchImages();
});

// Fetch images
async function fetchImages() {
  try {
    isLoading.value = true;
    error.value = null;
    
    const response = await $fetch<ImagesResponse>('/api/images');
    images.value = response.images;
    hasMore.value = response.hasMore;
  } catch (err: any) {
    console.error('Error fetching images:', err);
    error.value = err.message || 'Failed to fetch wedding photos';
  } finally {
    isLoading.value = false;
  }
}

// Load more images
async function loadMore() {
  if (!hasMore.value) return;
  
  try {
    isLoadingMore.value = true;
    
    const response = await $fetch<ImagesResponse>('/api/images', {
      params: {
        limit: 50,
      }
    });
    
    images.value = [...images.value, ...response.images];
    hasMore.value = response.hasMore;
  } catch (err: any) {
    console.error('Error loading more images:', err);
    error.value = err.message || 'Failed to load more wedding photos';
  } finally {
    isLoadingMore.value = false;
  }
}

// View image
function viewImage(image: UploadThingImage) {
  selectedImage.value = image;
  isViewModalOpen.value = true;
}
</script> 