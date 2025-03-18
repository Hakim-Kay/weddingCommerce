const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Parse command line arguments
const args = process.argv.slice(2)
const envArg = args.find((arg) => arg.startsWith('--env='))
const env = envArg ? envArg.split('=')[1] : 'local'

// Get environment variables
let supabaseUrl, supabaseKey

if (env === 'local') {
    supabaseUrl = 'http://localhost:54321'
    supabaseKey =
        process.env.SUPABASE_LOCAL_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
} else {
    supabaseUrl = process.env.SUPABASE_URL
    supabaseKey = process.env.SUPABASE_KEY
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const storageDir = path.join(process.cwd(), 'storage')

async function uploadBucket(bucketName) {
    console.log(`Uploading bucket: ${bucketName}`)

    const bucketDir = path.join(storageDir, bucketName)
    if (!fs.existsSync(bucketDir)) {
        console.log(`Bucket directory ${bucketName} does not exist, skipping`)
        return
    }

    // Create bucket if it doesn't exist
    const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
        public: false,
    })

    if (bucketError && !bucketError.message.includes('already exists')) {
        console.error(`Error creating bucket ${bucketName}:`, bucketError)
        return
    }

    // Read all files in the bucket directory
    const files = fs.readdirSync(bucketDir)

    // Upload each file
    for (const fileName of files) {
        const filePath = path.join(bucketDir, fileName)

        // Skip directories
        if (fs.statSync(filePath).isDirectory()) {
            continue
        }

        const fileBuffer = fs.readFileSync(filePath)
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
                upsert: true,
            })

        if (uploadError) {
            console.error(`Error uploading file ${fileName}:`, uploadError)
            continue
        }

        console.log(`Uploaded: ${fileName}`)
    }
}

async function main() {
    if (!fs.existsSync(storageDir)) {
        console.error('Storage directory does not exist')
        process.exit(1)
    }

    // Get all bucket directories
    const buckets = fs
        .readdirSync(storageDir)
        .filter((item) => fs.statSync(path.join(storageDir, item)).isDirectory())

    // Upload files to each bucket
    for (const bucket of buckets) {
        await uploadBucket(bucket)
    }

    console.log('All storage files uploaded successfully!')
}

main().catch((err) => {
    console.error('Error:', err)
    process.exit(1)
})
