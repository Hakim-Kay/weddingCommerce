import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import { execSync } from 'child_process'

// Load environment variables
dotenv.config()

// Environment configuration
const environments = {
    local: {
        url: process.env.LOCAL_SUPABASE_URL || 'http://localhost:54321',
        anonKey: process.env.LOCAL_SUPABASE_ANON_KEY,
        serviceKey: process.env.LOCAL_SUPABASE_SERVICE_KEY,
        dbUrl:
            process.env.LOCAL_DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:54322/postgres',
    },
    staging: {
        url: process.env.STAGING_SUPABASE_URL,
        anonKey: process.env.STAGING_SUPABASE_ANON_KEY,
        serviceKey: process.env.STAGING_SUPABASE_SERVICE_KEY,
        dbUrl: process.env.STAGING_DATABASE_URL,
    },
    production: {
        url: process.env.PRODUCTION_SUPABASE_URL,
        anonKey: process.env.PRODUCTION_SUPABASE_ANON_KEY,
        serviceKey: process.env.PRODUCTION_SUPABASE_SERVICE_KEY,
        dbUrl: process.env.PRODUCTION_DATABASE_URL,
    },
}

// Get current environment
const currentEnv = process.env.SUPABASE_ENV || 'local'

// Create Supabase client for the current environment
function getSupabaseClient(env = currentEnv, useServiceKey = false) {
    const environment = environments[env]
    if (!environment) {
        throw new Error(`Unknown environment: ${env}`)
    }

    const key = useServiceKey ? environment.serviceKey : environment.anonKey
    return createClient(environment.url, key)
}

// Function to create a new branch in local Supabase
async function createBranch(branchName) {
    try {
        console.log(`Creating branch: ${branchName}`)
        execSync(`supabase db branch create ${branchName}`, { stdio: 'inherit' })
        console.log(`Branch ${branchName} created successfully!`)
    } catch (error) {
        console.error('Error creating branch:', error.message)
    }
}

// Function to switch to a branch in local Supabase
async function switchBranch(branchName) {
    try {
        console.log(`Switching to branch: ${branchName}`)
        execSync(`supabase db branch switch ${branchName}`, { stdio: 'inherit' })
        console.log(`Switched to branch ${branchName} successfully!`)
    } catch (error) {
        console.error('Error switching branch:', error.message)
    }
}

// Function to list all branches in local Supabase
async function listBranches() {
    try {
        console.log('Listing branches:')
        execSync('supabase db branches list', { stdio: 'inherit' })
    } catch (error) {
        console.error('Error listing branches:', error.message)
    }
}

// Function to sync data between environments
async function syncData(sourceEnv, targetEnv, tables = []) {
    try {
        console.log(`Syncing data from ${sourceEnv} to ${targetEnv}`)

        const sourceClient = getSupabaseClient(sourceEnv, true)
        const targetClient = getSupabaseClient(targetEnv, true)

        for (const table of tables) {
            console.log(`Syncing table: ${table}`)

            // Fetch data from source
            const { data, error } = await sourceClient.from(table).select('*')

            if (error) {
                console.error(`Error fetching data from ${table}:`, error)
                continue
            }

            if (!data || data.length === 0) {
                console.log(`No data found in ${table}`)
                continue
            }

            console.log(`Found ${data.length} records in ${table}`)

            // Clear target table
            const { error: deleteError } = await targetClient.from(table).delete().neq('id', 0) // This will delete all records

            if (deleteError) {
                console.error(`Error clearing table ${table}:`, deleteError)
                continue
            }

            // Insert data into target
            const { error: insertError } = await targetClient.from(table).insert(data)

            if (insertError) {
                console.error(`Error inserting data into ${table}:`, insertError)
                continue
            }

            console.log(`Successfully synced ${data.length} records to ${table}`)
        }

        console.log('Data sync completed!')
    } catch (error) {
        console.error('Error syncing data:', error.message)
    }
}

// Function to sync storage between environments
async function syncStorage(sourceEnv, targetEnv, bucketName = 'Wedding Images') {
    try {
        console.log(`Syncing storage from ${sourceEnv} to ${targetEnv}`)

        // Set environment variables for the sync script
        process.env.SYNC_SOURCE_ENV = sourceEnv
        process.env.SYNC_TARGET_ENV = targetEnv
        process.env.SYNC_BUCKET_NAME = bucketName

        // Run the storage sync script
        execSync('node sync-storage.js', { stdio: 'inherit' })

        console.log('Storage sync completed!')
    } catch (error) {
        console.error('Error syncing storage:', error.message)
    }
}

// Command line interface
const command = process.argv[2]
const arg1 = process.argv[3]
const arg2 = process.argv[4]

switch (command) {
    case 'create-branch':
        if (!arg1) {
            console.error('Branch name is required')
            process.exit(1)
        }
        createBranch(arg1)
        break

    case 'switch-branch':
        if (!arg1) {
            console.error('Branch name is required')
            process.exit(1)
        }
        switchBranch(arg1)
        break

    case 'list-branches':
        listBranches()
        break

    case 'sync-data':
        if (!arg1 || !arg2) {
            console.error('Source and target environments are required')
            process.exit(1)
        }
        // You can specify tables as additional arguments
        const tables = process.argv.slice(4)
        if (tables.length === 0) {
            console.error('At least one table name is required')
            process.exit(1)
        }
        syncData(arg1, arg2, tables)
        break

    case 'sync-storage':
        if (!arg1 || !arg2) {
            console.error('Source and target environments are required')
            process.exit(1)
        }
        const bucket = process.argv[5] || 'Wedding Images'
        syncStorage(arg1, arg2, bucket)
        break

    default:
        console.log(`
Supabase Environment Manager

Usage:
  node supabase-env.js <command> [arguments]

Commands:
  create-branch <branch-name>                Create a new branch in local Supabase
  switch-branch <branch-name>                Switch to a branch in local Supabase
  list-branches                              List all branches in local Supabase
  sync-data <source-env> <target-env> [tables...]  Sync data between environments
  sync-storage <source-env> <target-env> [bucket]  Sync storage between environments

Environments:
  local       Local Supabase instance
  staging     Staging Supabase project
  production  Production Supabase project
`)
}

export {
    getSupabaseClient,
    createBranch,
    switchBranch,
    listBranches,
    syncData,
    syncStorage,
    environments,
    currentEnv,
}
