// Script to create folder structure in local Supabase storage
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Local Supabase client
const localSupabaseUrl = process.env.LOCAL_SUPABASE_URL || 'http://127.0.0.1:54321'
const localSupabaseKey = process.env.LOCAL_SUPABASE_SERVICE_KEY
if (!localSupabaseKey) {
    console.error('Error: LOCAL_SUPABASE_SERVICE_KEY environment variable is not set')
    console.error('Please make sure it is defined in your .env file')
    process.exit(1)
}
const localSupabase = createClient(localSupabaseUrl, localSupabaseKey)

// Bucket name
const bucketName = process.env.SYNC_BUCKET_NAME || 'Wedding Images'

// Folders to create
const folders = ['Bachelors', 'Kasiki', 'Miscellaneous', 'Nikah', 'Reception', 'Studio']

// Function to create a folder in Supabase storage
async function createFolder(folderName) {
    // In Supabase, folders are created by uploading a zero-byte file with a trailing slash
    const { data, error } = await localSupabase.storage
        .from(bucketName)
        .upload(`${folderName}/.emptyfile`, new Uint8Array(0), {
            upsert: true,
        })

    if (error) {
        console.error(`Error creating folder ${folderName}:`, error)
        return false
    }

    console.log(`Successfully created folder ${folderName}`)
    return true
}

// Main function to create folders
async function createFolders() {
    try {
        console.log('Starting folder creation...')

        // Create bucket in local Supabase if it doesn't exist
        const { error: bucketError } = await localSupabase.storage.createBucket(bucketName, {
            public: false,
            fileSizeLimit: 50 * 1024 * 1024, // 50MB
        })

        if (bucketError && !bucketError.message.includes('already exists')) {
            console.error('Error creating bucket:', bucketError)
            return
        }

        // Create each folder
        for (const folder of folders) {
            await createFolder(folder)
        }

        console.log('Folder creation completed!')
    } catch (error) {
        console.error('Error creating folders:', error)
    }
}

// Run the folder creation
createFolders()
