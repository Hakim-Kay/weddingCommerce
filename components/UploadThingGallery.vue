<template>
  <div class="upload-thing-gallery">
    <div class="mb-4">
      <h2 class="text-2xl font-bold">Image Gallery</h2>
      <p class="text-gray-600">Images from UploadThing</p>
    </div>
    
    <!-- Search Form -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">Search Images</h3>
      <div class="flex flex-wrap gap-4">
        <UInput
          v-model="searchCustomId"
          placeholder="Search by Custom ID"
          class="flex-1"
        />
        <UButton @click="searchByCustomId" :loading="isSearching">
          Search
        </UButton>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>
    
    <!-- Error State -->
    <UAlert v-if="error" class="mb-4" color="red">
      <p>{{ error }}</p>
    </UAlert>
    
    <!-- Empty State -->
    <div v-if="!isLoading && images.length === 0" class="text-center my-8 p-8 bg-gray-50 rounded-lg">
      <UIcon name="i-heroicons-photo" class="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <h3 class="text-lg font-semibold">No Images Found</h3>
      <p class="text-gray-600">Try uploading some images via the UploadThing dashboard.</p>
    </div>
    
    <!-- Image Grid -->
    <div v-if="!isLoading && images.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="image in images" :key="image.key" class="bg-white rounded-lg shadow overflow-hidden">
        <img :src="getImageUrl(image.key)" :alt="image.name" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h3 class="font-semibold truncate">{{ image.name }}</h3>
          <p class="text-sm text-gray-500">{{ formatFileSize(image.size) }}</p>
          <div v-if="image.customId" class="mt-2">
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              ID: {{ image.customId }}
            </span>
          </div>
        </div>
        <div class="px-4 pb-4 flex gap-2">
          <UButton size="sm" @click="viewImage(image)">
            View
          </UButton>
          <UButton size="sm" color="gray" @click="editCustomId(image)">
            Edit ID
          </UButton>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div v-if="nextCursor" class="mt-6 text-center">
      <UButton @click="loadMore" :loading="isLoadingMore">
        Load More
      </UButton>
    </div>
    
    <!-- Edit Custom ID Modal -->
    <UModal v-model="isEditModalOpen">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-4">Edit Custom ID</h3>
        <UInput
          v-model="editingCustomId"
          placeholder="Enter a custom ID"
          class="mb-4"
        />
        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="isEditModalOpen = false">
            Cancel
          </UButton>
          <UButton @click="saveCustomId" :loading="isSaving">
            Save
          </UButton>
        </div>
      </div>
    </UModal>
    
    <!-- View Image Modal -->
    <UModal v-model="isViewModalOpen">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-4" v-if="selectedImage">{{ selectedImage.name }}</h3>
        <div v-if="selectedImage" class="mb-4">
          <img :src="getImageUrl(selectedImage.key)" :alt="selectedImage.name" class="max-w-full max-h-[70vh] mx-auto" />
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
import type { UploadThingFile } from '~/types/uploadthing';
import { useUploadThingAdapter } from '~/composables/uploadThingAdapter';

// State
const images = ref<UploadThingFile[]>([]);
const isLoading = ref(true);
const isLoadingMore = ref(false);
const isSearching = ref(false);
const isSaving = ref(false);
const error = ref<string | null>(null);
const nextCursor = ref<string | undefined>(undefined);

// Search state
const searchCustomId = ref('');

// Edit modal state
const isEditModalOpen = ref(false);
const editingCustomId = ref('');
const editingImage = ref<UploadThingFile | null>(null);

// View modal state
const isViewModalOpen = ref(false);
const selectedImage = ref<UploadThingFile | null>(null);

// Get the UploadThing composable
const { fetchImages, updateImage, searchImages, getImageUrl } = useUploadThingAdapter();

// Fetch images on component mount
onMounted(async () => {
  await fetchInitialImages();
});

// Fetch initial images
async function fetchInitialImages() {
  try {
    isLoading.value = true;
    error.value = null;
    
    const response = await fetchImages();
    images.value = response.files;
    nextCursor.value = response.nextCursor;
  } catch (err: any) {
    // Handle structured error data if available
    if (err.data) {
      error.value = err.data.message || 'Failed to fetch images';
      console.error('Error details:', err.data);
    } else {
      error.value = err.message || 'Failed to fetch images';
    }
    console.error('Error fetching images:', err);
  } finally {
    isLoading.value = false;
  }
}

// Load more images
async function loadMore() {
  if (!nextCursor.value) return;
  
  try {
    isLoadingMore.value = true;
    
    const response = await fetchImages(50, nextCursor.value);
    images.value = [...images.value, ...response.files];
    nextCursor.value = response.nextCursor;
  } catch (err: any) {
    // Handle structured error data if available
    if (err.data) {
      error.value = err.data.message || 'Failed to load more images';
      console.error('Error details:', err.data);
    } else {
      error.value = err.message || 'Failed to load more images';
    }
    console.error('Error loading more images:', err);
  } finally {
    isLoadingMore.value = false;
  }
}

// Search by custom ID
async function searchByCustomId() {
  if (!searchCustomId.value.trim()) {
    await fetchInitialImages();
    return;
  }
  
  try {
    isSearching.value = true;
    error.value = null;
    
    const response = await searchImages({ customId: searchCustomId.value });
    images.value = response.files;
    nextCursor.value = undefined; // No pagination for search results
  } catch (err: any) {
    // Handle structured error data if available
    if (err.data) {
      error.value = err.data.message || 'Failed to search images';
      console.error('Error details:', err.data);
    } else {
      error.value = err.message || 'Failed to search images';
    }
    console.error('Error searching images:', err);
  } finally {
    isSearching.value = false;
  }
}

// Edit custom ID
function editCustomId(image: UploadThingFile) {
  editingImage.value = image;
  editingCustomId.value = image.customId || '';
  isEditModalOpen.value = true;
}

// Save custom ID
async function saveCustomId() {
  if (!editingImage.value) return;
  
  try {
    isSaving.value = true;
    
    const updatedImage = await updateImage(editingImage.value.key, {
      customId: editingCustomId.value || undefined
    });
    
    // Update the image in the list
    const index = images.value.findIndex(img => img.key === updatedImage.key);
    if (index !== -1) {
      images.value[index] = updatedImage;
    }
    
    isEditModalOpen.value = false;
  } catch (err: any) {
    // Handle structured error data if available
    if (err.data) {
      error.value = err.data.message || 'Failed to update custom ID';
      console.error('Error details:', err.data);
    } else {
      error.value = err.message || 'Failed to update custom ID';
    }
    console.error('Error updating custom ID:', err);
  } finally {
    isSaving.value = false;
  }
}

// View image
function viewImage(image: UploadThingFile) {
  selectedImage.value = image;
  isViewModalOpen.value = true;
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script> 