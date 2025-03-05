<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="text-center max-w-3xl px-4">
      <h1 class="text-4xl md:text-5xl font-bold mb-6">Elisa & Makini Wedding Photos</h1>
      <p class="text-xl text-gray-600 mb-8">
        Browse and download beautiful memories from our special day.
      </p>
      <NuxtLink to="/gallery" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
        View Photo Gallery
      </NuxtLink>
    </div>
    
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl px-4">
      <div v-for="(feature, index) in features" :key="index" class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-blue-600 mb-4">
          <UIcon :name="feature.icon" class="h-8 w-8" />
        </div>
        <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
        <p class="text-gray-600">{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    icon: 'i-heroicons-photo',
    title: 'High-Quality Photos',
    description: 'Browse through professionally captured wedding photos in high resolution.'
  },
  {
    icon: 'i-heroicons-heart',
    title: 'Save Favorites',
    description: 'Mark your favorite photos to easily find them later.'
  },
  {
    icon: 'i-heroicons-arrow-down-tray',
    title: 'Easy Downloads',
    description: 'Download individual photos or entire collections with just a few clicks.'
  }
];
</script>
