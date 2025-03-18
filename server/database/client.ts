import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { useRuntimeConfig } from '#imports'

// Define environment types
type Environment = 'local' | 'staging' | 'production'
type EnvironmentConfig = {
    url: string
    anonKey: string
    serviceKey: string
    dbUrl: string
}

// Get current environment
const getCurrentEnv = (): Environment => {
    const config = useRuntimeConfig()
    const env = (config.supabaseEnv as Environment) || 'local'
    return env
}

// Environment configuration
const getEnvironmentConfig = (env: Environment): EnvironmentConfig => {
    const config = useRuntimeConfig()
    const environments: Record<Environment, EnvironmentConfig> = {
        local: {
            url: config.localSupabaseUrl || 'http://localhost:54321',
            anonKey: config.localSupabaseAnonKey,
            serviceKey: config.localSupabaseServiceKey,
            dbUrl:
                config.localDatabaseUrl ||
                'postgresql://postgres:postgres@localhost:54322/postgres',
        },
        staging: {
            url: config.stagingSupabaseUrl,
            anonKey: config.stagingSupabaseAnonKey,
            serviceKey: config.stagingSupabaseServiceKey,
            dbUrl: config.stagingDatabaseUrl,
        },
        production: {
            url: config.productionSupabaseUrl,
            anonKey: config.productionSupabaseAnonKey,
            serviceKey: config.productionSupabaseServiceKey,
            dbUrl: config.productionDatabaseUrl,
        },
    }

    return environments[env]
}

// For use in Nuxt server runtime
export const createDrizzleClient = () => {
    const currentEnv = getCurrentEnv()
    const envConfig = getEnvironmentConfig(currentEnv)

    if (!envConfig.dbUrl) {
        throw new Error(`Database URL is not defined for environment: ${currentEnv}`)
    }

    // Create a postgres client with prepare: false for Supabase connection pooling
    const client = postgres(envConfig.dbUrl, { prepare: false })

    // Create a drizzle client
    return drizzle(client, { schema })
}

/**
 * Server-only function to create a Supabase client.
 * This is separate from the Nuxt plugin and should only be used in API routes.
 */
export const createServerSupabaseClient = (useServiceKey = false) => {
    const currentEnv = getCurrentEnv()
    const envConfig = getEnvironmentConfig(currentEnv)
    const key = useServiceKey ? envConfig.serviceKey : envConfig.anonKey

    if (!envConfig.url || !key) {
        throw new Error(`Missing Supabase configuration for environment: ${currentEnv}`)
    }

    return createClient(envConfig.url, key)
}

// Export the database client for immediate use
export const db = createDrizzleClient()

// Export environment utilities
export const getCurrentEnvironment = getCurrentEnv
export const isProduction = () => getCurrentEnv() === 'production'
export const isStaging = () => getCurrentEnv() === 'staging'
export const isLocal = () => getCurrentEnv() === 'local'

/**
 * IMPORTANT: Use this function instead of importing a shared instance
 * Creates a fresh Supabase client each time it's called, preventing conflicts
 * with Nuxt's plugin system. Only use in server-side code (API routes).
 */
export const getServerSupabase = () => {
    return createServerSupabaseClient()
}
