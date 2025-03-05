<template>
  <div class="spinner" :class="[`spinner-${size}`]">
    <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
});
</script>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner-sm svg {
  width: 1rem;
  height: 1rem;
}

.spinner-md svg {
  width: 1.5rem;
  height: 1.5rem;
}

.spinner-lg svg {
  width: 2rem;
  height: 2rem;
}

.spinner-xl svg {
  width: 3rem;
  height: 3rem;
}
</style> 