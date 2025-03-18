import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
}

export default {
    schema: './server/database/schema/*.ts',
    out: './supabase/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
} satisfies Config
