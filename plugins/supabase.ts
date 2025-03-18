import { createClient } from '@supabase/supabase-js'


// Use a WeakMap to store client instances instead of directly on nuxtApp
const clientInstances = new WeakMap()

export default defineNuxtPlugin((nuxtApp) => {
  // Check if we already have a client in the WeakMap
  if (clientInstances.has(nuxtApp)) {
    console.log('Using existing Supabase client instance')
    return {
      provide: {
        supabase: clientInstances.get(nuxtApp)
      }
    }
  }

  console.log('Initializing Supabase plugin...')
  
  const config = useRuntimeConfig().public
  
  // Define environment type
  type Environment = 'local' | 'staging' | 'production'
  
  // Cast currentEnv to the Environment type
  const currentEnv = (config.supabaseEnv || 'local') as Environment
  
  // Environment configuration with proper types
  const environments: Record<Environment, { url: string; anonKey: string }> = {
    local: {
      url: config.localSupabaseUrl || 'http://localhost:54321',
      anonKey: config.localSupabaseAnonKey || '',
    },
    staging: {
      url: config.stagingSupabaseUrl || '',
      anonKey: config.stagingSupabaseAnonKey || '',
    },
    production: {
      url: config.productionSupabaseUrl || '',
      anonKey: config.productionSupabaseAnonKey || '',
    },
  }
  
  // Get environment configuration
  const envConfig = environments[currentEnv]
  if (!envConfig) {
    console.error(`Unknown environment: ${currentEnv}`)
    throw new Error(`Unknown environment: ${currentEnv}`)
  }
  
  if (!envConfig.url || !envConfig.anonKey) {
    console.error(`Missing Supabase configuration for environment: ${currentEnv}`)
    throw new Error(`Missing Supabase configuration for environment: ${currentEnv}`)
  }

  console.log(`Creating Supabase client for environment: ${currentEnv}`)
  
  try {
    // Create the Supabase client
    const clientInstance = createClient(envConfig.url, envConfig.anonKey, {
      auth: {
        persistSession: true,
        storageKey: `supabase-auth-${currentEnv}`, // Use environment in storage key to prevent conflicts
      },
    })
    
    // Store the client instance in the WeakMap
    clientInstances.set(nuxtApp, clientInstance)
    
    // Return the provider
    return {
      provide: {
        supabase: clientInstance
      }
    }
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    throw error
  }
}) 