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
LOCAL_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
LOCAL_SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
LOCAL_DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Staging Supabase Configuration
STAGING_SUPABASE_URL="https://your-staging-project.supabase.co"
STAGING_SUPABASE_ANON_KEY="your_staging_anon_key"
STAGING_SUPABASE_SERVICE_KEY="your_staging_service_key"
STAGING_DATABASE_URL="your_staging_db_url"

# Production Supabase Configuration
PRODUCTION_SUPABASE_URL="https://pidimnoauortugjylfhw.supabase.co"
PRODUCTION_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGltbm9hdW9ydHVnanlsZmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MzQ2MzAsImV4cCI6MjA1NzExMDYzMH0.RaTxCyP95EFuZXI0ZYzzl7V4-N0QhiDdtKyZ0qcSK4M"
PRODUCTION_SUPABASE_SERVICE_KEY="your_production_service_key"
PRODUCTION_DATABASE_URL="postgresql://postgres.pidimnoauortugjylfhw:@aws-0-eu-west-3.pooler.supabase.com:6543/postgres"

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
