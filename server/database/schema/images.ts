import { pgTable, serial, text, boolean, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'

// Define the tag enum for image categories
export const tagEnum = pgEnum('tag_enum', ['Kasiki', 'Reception', 'Nikah', 'Studio', 'Magazine'])

// Define the images table
export const images = pgTable('images', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    imagePath: text('image_path').notNull(),
    thumbnailPath: text('thumbnail_path').notNull(),
    tags: tagEnum('tags').array().notNull(),
    isPremium: boolean('is_premium').notNull().default(false),
    downloadCount: integer('download_count').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})
