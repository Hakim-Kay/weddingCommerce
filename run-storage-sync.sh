#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "Error: .env file not found!"
  exit 1
fi

# Get source and target environments from command line arguments
SOURCE_ENV=${1:-production}
TARGET_ENV=${2:-local}
BUCKET_NAME=${3:-"Wedding Images"}

echo "Source environment: $SOURCE_ENV"
echo "Target environment: $TARGET_ENV"
echo "Bucket name: $BUCKET_NAME"

# Validate source environment
if [ "$SOURCE_ENV" = "local" ] && [ -z "$LOCAL_SUPABASE_URL" ]; then
  echo "Error: LOCAL_SUPABASE_URL is not set in your .env file."
  exit 1
fi

if [ "$SOURCE_ENV" = "staging" ] && [ -z "$STAGING_SUPABASE_URL" ]; then
  echo "Error: STAGING_SUPABASE_URL is not set in your .env file."
  exit 1
fi

if [ "$SOURCE_ENV" = "production" ] && [ -z "$PRODUCTION_SUPABASE_URL" ]; then
  echo "Error: PRODUCTION_SUPABASE_URL is not set in your .env file."
  exit 1
fi

# Validate target environment
if [ "$TARGET_ENV" = "local" ] && [ -z "$LOCAL_SUPABASE_URL" ]; then
  echo "Error: LOCAL_SUPABASE_URL is not set in your .env file."
  exit 1
fi

if [ "$TARGET_ENV" = "staging" ] && [ -z "$STAGING_SUPABASE_URL" ]; then
  echo "Error: STAGING_SUPABASE_URL is not set in your .env file."
  exit 1
fi

if [ "$TARGET_ENV" = "production" ] && [ -z "$PRODUCTION_SUPABASE_URL" ]; then
  echo "Error: PRODUCTION_SUPABASE_URL is not set in your .env file."
  exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules/@supabase" ]; then
  echo "Installing required dependencies..."
  npm install @supabase/supabase-js dotenv
fi

# Run the sync script with environment variables
echo "Starting storage sync from $SOURCE_ENV to $TARGET_ENV..."
SYNC_SOURCE_ENV=$SOURCE_ENV SYNC_TARGET_ENV=$TARGET_ENV SYNC_BUCKET_NAME="$BUCKET_NAME" node sync-storage.js

echo "Storage sync process completed!"

mkdir -p .github/workflows
mkdir -p supabase/migrations
mkdir -p scripts 