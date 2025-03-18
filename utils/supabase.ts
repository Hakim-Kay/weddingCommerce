import { createClient } from '@supabase/supabase-js'

/**
 * This file provides utility functions for accessing the Supabase client
 * in different contexts.
 */

/**
 * Helper composable to access the Supabase client in component context.
 * Always use this in Nuxt components instead of direct imports.
 */
export const useSupabaseClient = () => {
  try {
    const nuxtApp = useNuxtApp();
    
    if (nuxtApp && nuxtApp.$supabase) {
      return nuxtApp.$supabase;
    } else {
      console.warn('Supabase client not available in Nuxt app context. Make sure plugins/supabase.ts is loaded.');
      return null;
    }
  } catch (error) {
    console.warn('Not in a Nuxt context, cannot access $supabase client');
    return null;
  }
}

/**
 * This function is ONLY for use in contexts where the Nuxt plugin system
 * is unavailable (such as middleware or server routes).
 * 
 * In component code, use the composable or const { $supabase } = useNuxtApp() instead.
 */
export const createStandaloneClient = () => {
  const runtimeConfig = useRuntimeConfig();
  const env = runtimeConfig.supabaseEnv || 'local';
  
  let url = '';
  let key = '';
  
  // Select the environment-specific config
  if (env === 'local') {
    url = runtimeConfig.localSupabaseUrl || 'http://localhost:54321';
    key = runtimeConfig.localSupabaseAnonKey || '';
  } else if (env === 'staging') {
    url = runtimeConfig.stagingSupabaseUrl || '';
    key = runtimeConfig.stagingSupabaseAnonKey || '';
  } else if (env === 'production') {
    url = runtimeConfig.productionSupabaseUrl || '';
    key = runtimeConfig.productionSupabaseAnonKey || '';
  }
  
  if (!url || !key) {
    console.error(`Missing Supabase configuration for environment: ${env}`);
    throw new Error(`Missing Supabase configuration for environment: ${env}`);
  }
  
  console.warn('Creating standalone Supabase client - this should only be used in server context');
  return createClient(url, key);
}

// No exports of supabase instance to avoid conflicts with the plugin 