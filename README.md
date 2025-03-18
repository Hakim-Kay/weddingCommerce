# Wedding Photography E-commerce Platform

This is a wedding photography e-commerce platform built with Nuxt.js, similar to Adobe Stock or Pixieset. Users can browse, preview, purchase, and download wedding photographs with content protection features.

## Features

- Photo browsing and preview with playback controls and background music
- Content protection system to prevent unauthorized screenshots or recordings
- Favorites collection for users to save images
- Purchase flow with Stripe integration
- Download management with limited downloads per purchased image
- User authentication via Clerk
- Responsive, mobile-first approach

## Tech Stack

- Framework: Nuxt.js (v3) with TypeScript
- State Management: Pinia
- Styling: UnoCSS (implementing Client-First methodology)
- UI Components: shadcn UI-Vue
- Authentication: Clerk
- Payment Processing: Stripe
- Database: Supabase (PostgreSQL)
- Image Management: Uploadthing & TwicPics
- Deployment: Cloudflare

## Setup and Development

### Prerequisites

- Node.js (v20)
- pnpm (v8+)

### Installation

```bash
# Clone the repository
git clone https://github.com/hakim-kay/weddingcommerce.git

# Install dependencies
pnpm install

# Create a .env file (copy from .env.example)
cp .env.example .env
```

---

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm dev

```

## Production

Build the application for production:

```bash
# pnpm
pnpm build

```

Locally preview production build:

```bash
# pnpm
pnpm preview

```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Environment Management

This project uses a three-tier environment structure:

### 1. Local Development

Uses Supabase CLI with Docker for local development:

```bash
# Start local Supabase
supabase start

# Create new migration after schema changes
supabase db diff -f migration_name

# Reset local database
supabase db reset

# Download storage files from production
node scripts/download-storage.js --env=production
```

### 2. Staging Environment

Automatically deployed from the `develop` branch:

- Create a PR to `develop` to trigger CI checks
- Merge to `develop` to deploy to staging
- Staging environment is seeded with sample data

### 3. Production Environment

Deployed from the `main` branch:

- Create a PR from `develop` to `main`
- Review changes carefully
- Merge to `main` to deploy to production

## Setup Instructions

### Prerequisites

- Node.js 16+
- Docker
- Supabase CLI
- GitHub account

### Initial Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Start Supabase locally: `supabase start`
4. Set up environment variables:
   - Create `.env.local` file for local development
   - Add GitHub repository secrets for CI/CD

### GitHub Repository Secrets

The following secrets need to be added to your GitHub repository:

- `SUPABASE_ACCESS_TOKEN`: Your Supabase access token
- `PRODUCTION_PROJECT_ID`: Production project ID
- `PRODUCTION_DB_PASSWORD`: Production database password
- `PRODUCTION_SUPABASE_URL`: Production Supabase URL
- `PRODUCTION_SUPABASE_KEY`: Production Supabase anon key
- `STAGING_PROJECT_ID`: Staging project ID
- `STAGING_DB_PASSWORD`: Staging database password
- `STAGING_SUPABASE_URL`: Staging Supabase URL
- `STAGING_SUPABASE_KEY`: Staging Supabase anon key

### Working with Migrations

```bash
# Create a new migration
supabase db diff -f migration_name

# Apply migrations to local database
supabase db reset

# Apply migrations to remote database
supabase db push
```

### Working with Storage

```bash
# Download files from remote to local
node scripts/download-storage.js --env=production

# Upload files from local to remote
node scripts/upload-storage.js --env=staging
```

## 7. Git Setup

Let's set up the Git branches:

```bash
# Ensure you're on main branch
git checkout main

# Create develop branch
git checkout -b develop

# Add all files
git add .

# Commit
git commit -m "Set up Supabase environment management"

# Push both branches
git push -u origin main
git push -u origin develop
```

## 8. Required Manual Steps

After implementing the above files, you'll need to:

1. Create a Supabase staging project through the Supabase dashboard
2. Generate and save all the required access tokens and credentials
3. Add the GitHub repository secrets:
   - `SUPABASE_ACCESS_TOKEN`
   - `PRODUCTION_PROJECT_ID`
   - `PRODUCTION_DB_PASSWORD`
   - `PRODUCTION_SUPABASE_URL`
   - `PRODUCTION_SUPABASE_KEY`
   - `STAGING_PROJECT_ID`
   - `STAGING_DB_PASSWORD`
   - `STAGING_SUPABASE_URL`
   - `STAGING_SUPABASE_KEY`
4. Install dependencies: `npm install @supabase/supabase-js`
5. Run `supabase init` if not already done
6. Link to your production project: `supabase link --project-ref <PRODUCTION_PROJECT_ID>`
7. Pull existing schema: `supabase db pull`

## 9. Testing the Setup

After completing the manual steps:

1. Start local Supabase: `supabase start`
2. Test storage scripts:
   - `node scripts/download-storage.js --env=production`
   - `node scripts/upload-storage.js --env=local`
3. Create a test migration: `supabase db diff -f test_migration`
4. Reset local database: `supabase db reset`
5. Create a feature branch, make changes, and open a PR to develop

The CI/CD pipeline should now automatically test and deploy your changes to the appropriate environments based on the branch structure.

This completes the YOLO mode implementation of your Supabase environment management system!
