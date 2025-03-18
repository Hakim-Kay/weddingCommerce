// Script to sync files from one Supabase storage environment to another
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Environment configuration
const environments = {
    local: {
        url: process.env.LOCAL_SUPABASE_URL || 'http://localhost:54321',
        serviceKey:
            process.env.LOCAL_SUPABASE_SERVICE_KEY ||
            'YOUR_LOCAL_SUPABASE_SERVICE_KEY',
    },
    staging: {
        url: process.env.STAGING_SUPABASE_URL,
        serviceKey: process.env.STAGING_SUPABASE_SERVICE_KEY,
    },
    production: {
        url: process.env.PRODUCTION_SUPABASE_URL,
        serviceKey: process.env.PRODUCTION_SUPABASE_SERVICE_KEY,
    },
}

// Get source and target environments
const sourceEnv = process.env.SYNC_SOURCE_ENV || 'production'
const targetEnv = process.env.SYNC_TARGET_ENV || 'local'
const bucketName = process.env.SYNC_BUCKET_NAME || 'Wedding Images'

// Validate environments
if (
    !environments[sourceEnv] ||
    !environments[sourceEnv].url ||
    !environments[sourceEnv].serviceKey
) {
    console.error(`Error: Source environment "${sourceEnv}" is not properly configured`)
    process.exit(1)
}

if (
    !environments[targetEnv] ||
    !environments[targetEnv].url ||
    !environments[targetEnv].serviceKey
) {
    console.error(`Error: Target environment "${targetEnv}" is not properly configured`)
    process.exit(1)
}

// Create Supabase clients
console.log(`Connecting to source Supabase (${sourceEnv}) at ${environments[sourceEnv].url}...`)
const sourceSupabase = createClient(environments[sourceEnv].url, environments[sourceEnv].serviceKey)

console.log(`Connecting to target Supabase (${targetEnv}) at ${environments[targetEnv].url}...`)
const targetSupabase = createClient(environments[targetEnv].url, environments[targetEnv].serviceKey)

// Temporary directory to store downloaded files
const tempDir = path.join(process.cwd(), 'temp_storage')

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
}

// Function to list all files in a bucket (including in folders)
async function listAllFiles(supabase, bucket, prefix = '') {
    const { data, error } = await supabase.storage.from(bucket).list(prefix)

    if (error) {
        console.error('Error listing files:', error)
        return []
    }

    if (!data || data.length === 0) {
        return []
    }

    let allFiles = []

    for (const item of data) {
        if (item.id) {
            // It's a file
            allFiles.push(prefix ? `${prefix}/${item.name}` : item.name)
        } else {
            // It's a folder
            const folderPath = prefix ? `${prefix}/${item.name}` : item.name
            const nestedFiles = await listAllFiles(supabase, bucket, folderPath)
            allFiles = [...allFiles, ...nestedFiles]
        }
    }

    return allFiles
}

// Function to download a file from source storage
async function downloadFile(filePath) {
    console.log(`Downloading ${filePath}...`)
    const { data, error } = await sourceSupabase.storage.from(bucketName).download(filePath)

    if (error) {
        console.error(`Error downloading ${filePath}:`, error)
        return null
    }

    const localFilePath = path.join(tempDir, filePath)

    // Create directory if it doesn't exist
    const dir = path.dirname(localFilePath)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    // Save file to disk
    fs.writeFileSync(localFilePath, Buffer.from(await data.arrayBuffer()))

    return localFilePath
}

// Function to upload a file to target storage
async function uploadFile(filePath, buffer) {
    console.log(`Uploading ${filePath} to ${targetEnv} storage...`)
    const { data, error } = await targetSupabase.storage.from(bucketName).upload(filePath, buffer, {
        upsert: true,
    })

    if (error) {
        console.error(`Error uploading ${filePath}:`, error)
        return false
    }

    console.log(`Successfully uploaded ${filePath}`)
    return true
}

// Main function to sync files
async function syncFiles() {
    try {
        console.log(`Starting storage sync from ${sourceEnv} to ${targetEnv}...`)

        // Verify connection to source Supabase
        const { error: sourceError } = await sourceSupabase.storage.getBucket(bucketName)
        if (sourceError) {
            console.error(`Error connecting to source bucket "${bucketName}":`, sourceError)
            console.error(
                `Please check your ${sourceEnv.toUpperCase()}_SUPABASE_URL and ${sourceEnv.toUpperCase()}_SUPABASE_SERVICE_KEY in the .env file.`
            )
            return
        }

        // Create bucket in target Supabase if it doesn't exist
        const { error: bucketError } = await targetSupabase.storage.createBucket(bucketName, {
            public: false,
            fileSizeLimit: 50 * 1024 * 1024, // 50MB
        })

        if (bucketError && !bucketError.message.includes('already exists')) {
            console.error('Error creating bucket:', bucketError)
            return
        }

        // List all files in source storage
        console.log(`Listing files in source bucket "${bucketName}"...`)
        const files = await listAllFiles(sourceSupabase, bucketName)
        console.log(`Found ${files.length} files to sync`)

        if (files.length === 0) {
            console.log('No files found in the source bucket. Nothing to sync.')
            return
        }

        // Download and upload each file
        let successCount = 0
        let failCount = 0

        for (const filePath of files) {
            console.log(`Processing ${filePath}...`)

            // Download file from source
            const localFilePath = await downloadFile(filePath)
            if (!localFilePath) {
                failCount++
                continue
            }

            // Read file from disk
            const fileBuffer = fs.readFileSync(localFilePath)

            // Upload to target Supabase
            const success = await uploadFile(filePath, fileBuffer)
            if (success) {
                successCount++
            } else {
                failCount++
            }
        }

        console.log('Storage sync completed!')
        console.log(`Successfully synced ${successCount} files.`)
        if (failCount > 0) {
            console.log(`Failed to sync ${failCount} files. Check the logs for details.`)
        }
    } catch (error) {
        console.error('Error syncing files:', error)
    } finally {
        // Clean up temp directory
        if (fs.existsSync(tempDir)) {
            console.log('Cleaning up temporary files...')
            fs.rmSync(tempDir, { recursive: true, force: true })
        }
    }
}

// Run the sync
syncFiles()
