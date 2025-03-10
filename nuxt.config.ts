// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: true
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
  ],

  css: [
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      title: 'Elisa & Makini',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Wedding photography e-commerce platform for browsing, purchasing, and downloading wedding photographs.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  nitro: {
    preset: 'cloudflare'
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || '/api'
    },
    private: {
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      clerkSecretKey: process.env.CLERK_SECRET_KEY
    }
  },

  compatibilityDate: '2025-03-01',

  // UI Configuration
  ui: {
    global: true
  },

  // Tailwind Configuration
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    config: {
      content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue'
      ],
      theme: {
        extend: {}
      }
    }
  },
})
