<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold text-gray-900">
          Elisa & Makini
        </NuxtLink>
        <nav class="flex items-center space-x-6">
          <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">Home</NuxtLink>
          <NuxtLink to="/gallery" class="text-gray-600 hover:text-gray-900">Gallery</NuxtLink>
        </nav>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-100 py-6">
      <div class="container mx-auto px-4 text-center text-gray-600">
        <p>&copy; {{ new Date().getFullYear() }} Elisa & Makini. All rights reserved.</p>
        <p class="mt-2 text-sm">
          Photos hosted on <a href="https://uploadthing.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">UploadThing</a>
        </p>
      </div>
    </footer>
  </div>
</template> 