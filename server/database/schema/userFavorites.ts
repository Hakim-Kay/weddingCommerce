import { pgTable, text, integer, primaryKey } from 'drizzle-orm/pg-core'
import { images } from './images'

// Define the user favorites table (junction table for many-to-many relationship)
export const userFavorites = pgTable(
    'user_favorites',
    {
        userId: text('user_id').notNull(),
        imageId: integer('image_id')
            .notNull()
            .references(() => images.id, { onDelete: 'cascade' }),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.userId, table.imageId] }),
        }
    }
)
