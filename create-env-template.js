import fs from 'fs'

const envContent = `# Public variables
API_BASE_URL=/api
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Private variables
NUXT_CLERK_SECRET_KEY=your_clerk_secret_key
TWICPICS_TOKEN_HEADER=your_twicpics_token
TWICPICS_API_KEY=your_twicpics_api_key

# Local Supabase Configuration
LOCAL_SUPABASE_URL="http://localhost:54321"
LOCAL_SUPABASE_ANON_KEY="your_local_anon_key"
LOCAL_SUPABASE_SERVICE_KEY="your_local_service_key"
LOCAL_DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Staging Supabase Configuration
STAGING_SUPABASE_URL="https://your-staging-project.supabase.co"
STAGING_SUPABASE_ANON_KEY="your_staging_anon_key"
STAGING_SUPABASE_SERVICE_KEY="your_staging_service_key"
STAGING_DATABASE_URL="your_staging_db_url"

# Production Supabase Configuration
PRODUCTION_SUPABASE_URL="https://your-production-project.supabase.co"
PRODUCTION_SUPABASE_ANON_KEY="your_production_anon_key"
PRODUCTION_SUPABASE_SERVICE_KEY="your_production_service_key"
PRODUCTION_DATABASE_URL="your_production_db_url"

# Current Environment
# Set this to "local", "staging", or "production"
SUPABASE_ENV="local"

# Storage Sync Configuration
# These are used by the storage sync script
SYNC_SOURCE_ENV="production"
SYNC_TARGET_ENV="local"
`

fs.writeFileSync('.env.multi', envContent)
console.log('.env.multi template created successfully!')
