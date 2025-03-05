<template>
  <div class="wedding-photo-card">
    <div class="photo-container">
      <img
        :src="`https://${appId}.ufs.sh/f/${fileKey}`"
        :alt="name || 'Wedding Photo'"
        class="w-full h-48 object-cover rounded-t-lg"
      />
    </div>
    <div class="p-3">
      <div v-if="name" class="text-sm font-medium truncate">{{ name }}</div>
      <div v-if="size" class="text-xs text-gray-500 mt-1">{{ formatFileSize(size) }}</div>
      <div v-if="customId" class="mt-2">
        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          ID: {{ customId }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const appId = config.public.uploadthingAppId;

// Props
defineProps({
  fileKey: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 0,
  },
  customId: {
    type: String,
    default: '',
  }
});

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>

<style scoped>
.wedding-photo-card {
  @apply bg-white rounded-lg shadow-md transition-all duration-200 overflow-hidden;
}

.wedding-photo-card:hover {
  @apply shadow-lg transform scale-[1.02];
}

.photo-container {
  @apply relative overflow-hidden;
}

.photo-container::after {
  content: '';
  @apply absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 transition-opacity duration-200;
}

.wedding-photo-card:hover .photo-container::after {
  @apply opacity-100;
}
</style> 