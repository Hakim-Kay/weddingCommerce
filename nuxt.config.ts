// nuxt.config.ts
export default defineNuxtConfig({
    devtools: { enabled: true },

    typescript: {
        strict: true,
        typeCheck: true,
    },

    modules: [
        '@pinia/nuxt',
        '@nuxt/ui',
        '@nuxtjs/tailwindcss',
        '@nuxt/image',
        '@twicpics/components/nuxt3',
    ],

    css: ['~/assets/css/main.css'],

    // TwicPics configuration
    twicpics: {
        domain: 'https://elisa-makini.twic.pics',
        anticipation: 0.5,
        step: 100,
        maxDPR: 2,
    },

    app: {
        head: {
            title: 'Elisa & Makini',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    name: 'description',
                    content:
                        'Wedding photography e-commerce platform for browsing, purchasing, and downloading wedding photographs.',
                },
            ],
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        },
    },

    nitro: {
        preset: 'cloudflare',
    },

    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL || '/api',
            twicpicsToken: process.env.TWICPICS_TOKEN_HEADER,
            
            // Current environment - expose to client
            supabaseEnv: process.env.SUPABASE_ENV || 'local',
            
            // Local environment - expose to client
            localSupabaseUrl: process.env.LOCAL_SUPABASE_URL || 'http://localhost:54321',
            localSupabaseAnonKey: process.env.LOCAL_SUPABASE_ANON_KEY,
            
            // Staging environment - expose to client
            stagingSupabaseUrl: process.env.STAGING_SUPABASE_URL,
            stagingSupabaseAnonKey: process.env.STAGING_SUPABASE_ANON_KEY,
            
            // Production environment - expose to client
            productionSupabaseUrl: process.env.PRODUCTION_SUPABASE_URL,
            productionSupabaseAnonKey: process.env.PRODUCTION_SUPABASE_ANON_KEY,
        },

        // Current environment
        supabaseEnv: process.env.SUPABASE_ENV || 'local',

        // Local environment
        localSupabaseUrl: process.env.LOCAL_SUPABASE_URL || 'http://localhost:54321',
        localSupabaseAnonKey: process.env.LOCAL_SUPABASE_ANON_KEY,
        localSupabaseServiceKey: process.env.LOCAL_SUPABASE_SERVICE_KEY,
        localDatabaseUrl:
            process.env.LOCAL_DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:54322/postgres',

        // Staging environment
        stagingSupabaseUrl: process.env.STAGING_SUPABASE_URL,
        stagingSupabaseAnonKey: process.env.STAGING_SUPABASE_ANON_KEY,
        stagingSupabaseServiceKey: process.env.STAGING_SUPABASE_SERVICE_KEY,
        stagingDatabaseUrl: process.env.STAGING_DATABASE_URL,

        // Production environment
        productionSupabaseUrl: process.env.PRODUCTION_SUPABASE_URL,
        productionSupabaseAnonKey: process.env.PRODUCTION_SUPABASE_ANON_KEY,
        productionSupabaseServiceKey: process.env.PRODUCTION_SUPABASE_SERVICE_KEY,
        productionDatabaseUrl: process.env.PRODUCTION_DATABASE_URL,

        // Legacy config (for backward compatibility)
        databaseUrl: process.env.DATABASE_URL,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_ANON_KEY,

        // Other secret keys
        stripeSecretKey: process.env.STRIPE_SECRET_KEY,
        clerkSecretKey: process.env.CLERK_SECRET_KEY,
        twicpicsApiKey: process.env.TWICPICS_API_KEY,
    },

    compatibilityDate: '2025-03-01',

    // UI Configuration
    ui: {
        global: true,
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
                './error.vue',
            ],
            theme: {
                extend: {},
            },
        },
    },
})
