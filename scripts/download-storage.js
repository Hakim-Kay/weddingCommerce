const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

// Parse command line arguments
const args = process.argv.slice(2)
const envArg = args.find((arg) => arg.startsWith('--env='))
const env = envArg ? envArg.split('=')[1] : 'local'

// Get environment variables
let supabaseUrl, supabaseKey

if (env === 'local') {
    supabaseUrl = process.env.LOCAL_SUPABASE_URL || 'http://localhost:54321'
    supabaseKey = process.env.LOCAL_SUPABASE_ANON_KEY
} else if (env === 'staging') {
    supabaseUrl = process.env.STAGING_SUPABASE_URL
    supabaseKey = process.env.STAGING_SUPABASE_ANON_KEY
} else if (env === 'production') {
    supabaseUrl = process.env.PRODUCTION_SUPABASE_URL
    supabaseKey = process.env.PRODUCTION_SUPABASE_ANON_KEY
} else {
    console.error(`Unknown environment: ${env}`)
    process.exit(1)
}

if (!supabaseUrl || !supabaseKey) {
    console.error(`Missing required environment variables for ${env} environment`)
    console.error(`Make sure ${env.toUpperCase()}_SUPABASE_URL and ${env.toUpperCase()}_SUPABASE_ANON_KEY are set in your .env file`)
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const storageDir = path.join(process.cwd(), 'storage')

async function downloadBucket(bucketName) {
    console.log(`Downloading bucket: ${bucketName}`)

    // Create bucket directory if it doesn't exist
    const bucketDir = path.join(storageDir, bucketName)
    if (!fs.existsSync(bucketDir)) {
        fs.mkdirSync(bucketDir, { recursive: true })
    }

    // List all files in the bucket
    const { data: files, error } = await supabase.storage.from(bucketName).list()

    if (error) {
        console.error(`Error listing files in bucket ${bucketName}:`, error)
        return
    }

    // Download each file
    for (const file of files) {
        if (file.name) {
            const { data, error: downloadError } = await supabase.storage
                .from(bucketName)
                .download(file.name)

            if (downloadError) {
                console.error(`Error downloading file ${file.name}:`, downloadError)
                continue
            }

            const filePath = path.join(bucketDir, file.name)
            fs.writeFileSync(filePath, Buffer.from(await data.arrayBuffer()))
            console.log(`Downloaded: ${file.name}`)
        }
    }
}

async function main() {
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true })
    }

    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error('Error listing buckets:', error)
        process.exit(1)
    }

    // Download files from each bucket
    for (const bucket of buckets) {
        await downloadBucket(bucket.name)
    }

    console.log('All storage files downloaded successfully!')
}

main().catch((err) => {
    console.error('Error:', err)
    process.exit(1)
})
