import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { images } from './images'

// Define the image downloads table for tracking download events
export const imageDownloads = pgTable('image_downloads', {
    id: serial('id').primaryKey(),
    imageId: integer('image_id')
        .notNull()
        .references(() => images.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    downloadedAt: timestamp('downloaded_at').notNull().defaultNow(),
})
