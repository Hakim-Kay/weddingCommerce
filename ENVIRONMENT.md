# Multi-Environment Setup & Database Branching

This document explains how to work with multiple Supabase environments (local, staging, production) and how to use database branching for development.

## Environment Configuration

The application supports three environments:

1. **Local**: Your local development environment
2. **Staging**: A testing environment before production
3. **Production**: The live production environment

### Environment Variables

Environment variables are organized by environment in the `.env` file:

```
# Local Supabase Configuration
LOCAL_SUPABASE_URL="http://localhost:54321"
LOCAL_SUPABASE_ANON_KEY="..."
LOCAL_SUPABASE_SERVICE_KEY="..."
LOCAL_DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Staging Supabase Configuration
STAGING_SUPABASE_URL="https://your-staging-project.supabase.co"
STAGING_SUPABASE_ANON_KEY="..."
STAGING_SUPABASE_SERVICE_KEY="..."
STAGING_DATABASE_URL="..."

# Production Supabase Configuration
PRODUCTION_SUPABASE_URL="https://pidimnoauortugjylfhw.supabase.co"
PRODUCTION_SUPABASE_ANON_KEY="..."
PRODUCTION_SUPABASE_SERVICE_KEY="..."
PRODUCTION_DATABASE_URL="..."

# Current Environment
SUPABASE_ENV="local"
```

To switch environments, change the `SUPABASE_ENV` variable to `local`, `staging`, or `production`.

## Database Branching

Database branching allows you to create isolated branches of your database for feature development.

### Prerequisites

- Supabase CLI installed
- Local Supabase instance running

### Basic Commands

```bash
# List all branches
node supabase-env.js list-branches

# Create a new branch
node supabase-env.js create-branch feature-name

# Switch to a branch
node supabase-env.js switch-branch feature-name
```

### Workflow Example

1. Start with the main branch:
   ```bash
   supabase start
   ```

2. Create a feature branch:
   ```bash
   node supabase-env.js create-branch user-favorites
   ```

3. Make schema changes:
   ```bash
   supabase migration new add-user-favorites
   # Edit the migration file
   supabase migration apply
   ```

4. Test your changes locally

5. When ready, merge back to main:
   ```bash
   node supabase-env.js switch-branch main
   supabase db remote commit
   ```

## Syncing Storage Between Environments

You can sync storage (files and folders) between environments:

```bash
# Sync from production to local
./run-storage-sync.sh production local "Wedding Images"

# Sync from staging to local
./run-storage-sync.sh staging local "Wedding Images"

# Sync from local to staging
./run-storage-sync.sh local staging "Wedding Images"
```

## Syncing Data Between Environments

You can sync data between environments:

```bash
# Sync images table from production to local
node supabase-env.js sync-data production local images

# Sync multiple tables
node supabase-env.js sync-data production local images user_favorites user_premium_access
```

## Utility Functions

The application provides utility functions for working with different environments:

```javascript
// In server code
import { 
  createSupabaseClient, 
  createSupabaseClientForEnv,
  getCurrentEnvironment,
  isProduction,
  isStaging,
  isLocal
} from '~/server/database/client'

// Get client for current environment
const supabase = createSupabaseClient()

// Get client for specific environment
const productionClient = createSupabaseClientForEnv('production')

// Check current environment
if (isProduction()) {
  // Production-specific code
}
```

## Converting from Old Environment Setup

If you're migrating from the old environment setup, run:

```bash
node convert-env.js
```

This will:
1. Back up your current `.env` file
2. Create a new `.env.new` file with the multi-environment structure
3. Provide instructions for completing the migration 