import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'

// Load current .env file
dotenv.config()

// Create new multi-environment .env content
const newEnvContent = `# Public variables
API_BASE_URL=${process.env.API_BASE_URL || '/api'}
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}

# Private variables
NUXT_CLERK_SECRET_KEY=${process.env.NUXT_CLERK_SECRET_KEY || ''}
TWICPICS_TOKEN_HEADER=${process.env.TWICPICS_TOKEN_HEADER || ''}
TWICPICS_API_KEY=${process.env.TWICPICS_API_KEY || ''}

# Local Supabase Configuration
LOCAL_SUPABASE_URL="http://localhost:54321"
LOCAL_SUPABASE_ANON_KEY="${process.env.SUPABASE_ANON_KEY || ''}"
LOCAL_SUPABASE_SERVICE_KEY="${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}"
LOCAL_DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Staging Supabase Configuration
STAGING_SUPABASE_URL="https://your-staging-project.supabase.co"
STAGING_SUPABASE_ANON_KEY="your_staging_anon_key"
STAGING_SUPABASE_SERVICE_KEY="your_staging_service_key"
STAGING_DATABASE_URL="your_staging_db_url"

# Production Supabase Configuration
PRODUCTION_SUPABASE_URL="${process.env.REMOTE_SUPABASE_URL || 'https://pidimnoauortugjylfhw.supabase.co'}"
PRODUCTION_SUPABASE_ANON_KEY="${process.env.REMOTE_SUPABASE_KEY || ''}"
PRODUCTION_SUPABASE_SERVICE_KEY="your_production_service_key"
PRODUCTION_DATABASE_URL="${process.env.DATABASE_URL || ''}"

# Current Environment
# Set this to "local", "staging", or "production"
SUPABASE_ENV="local"

# Storage Sync Configuration
# These are used by the storage sync script
SYNC_SOURCE_ENV="production"
SYNC_TARGET_ENV="local"
`

// Backup current .env file
if (fs.existsSync('.env')) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    fs.copyFileSync('.env', `.env.backup.${timestamp}`)
    console.log(`Backed up current .env file to .env.backup.${timestamp}`)
}

// Write new .env file
fs.writeFileSync('.env.new', newEnvContent)
console.log('Created new multi-environment .env file at .env.new')
console.log('Review the file and rename it to .env when ready.')

// Instructions
console.log(`
=== NEXT STEPS ===

1. Review the new .env file at .env.new
2. Update any missing values or incorrect configurations
3. When ready, replace your current .env file:
   mv .env.new .env

4. To sync storage between environments:
   ./run-storage-sync.sh production local "Wedding Images"

5. To manage database branches:
   node supabase-env.js create-branch feature-name
   node supabase-env.js switch-branch feature-name
   node supabase-env.js list-branches
`)
