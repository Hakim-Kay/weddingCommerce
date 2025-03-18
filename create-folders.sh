#!/bin/bash

# Install dependencies if needed
if [ ! -d "node_modules/@supabase" ]; then
  echo "Installing required dependencies..."
  npm install @supabase/supabase-js
fi

# Run the folder creation script
node create-folders.js

echo "Folder creation process completed!" 