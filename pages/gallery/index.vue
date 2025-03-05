<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Wedding Photo Gallery</h1>
    <p class="text-gray-600 mb-8">Browse and manage your wedding photos.</p>
    
    <div v-if="isLoading" class="flex justify-center my-8">
      <USpinner size="lg" />
    </div>
    
    <UploadThingGallery v-else />
  </div>
</template>

<script setup lang="ts">
// Page meta is automatically handled by Nuxt
useHead({
  title: 'Photo Gallery'
});

const isLoading = ref(true);

// Simulate loading state
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script> 