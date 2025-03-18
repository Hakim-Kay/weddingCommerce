import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// Define the user premium access table
export const userPremiumAccess = pgTable('user_premium_access', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull().unique(),
    purchasedAt: timestamp('purchased_at').notNull().defaultNow(),
})
