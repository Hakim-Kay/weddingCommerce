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
    '@uploadthing/nuxt',
    '@nuxt/image',
  ],

  css: [
    '~/assets/css/main.css'
  ],

  // Nuxt Image configuration for UploadThing
  image: {
    domains: [
      `${process.env.NUXT_UPLOADTHING_APP_ID || 'seogfaqf35'}.ufs.sh`
    ]
  },

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
      apiBaseUrl: process.env.API_BASE_URL || '/api',
      uploadthingUrl: process.env.NUXT_UPLOADTHING_URL || 'https://uploadthing.com',
      uploadthingAppId: process.env.NUXT_UPLOADTHING_APP_ID || 'seogfaqf35'
    },
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    uploadthingSecret: process.env.UPLOADTHING_TOKEN
  },

  // UploadThing configuration
  uploadthing: {
    // Path to your router definition file (optional)
    // routerPath: '~/server/uploadthing.ts',
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
