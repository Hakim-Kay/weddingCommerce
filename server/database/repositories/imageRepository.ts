import { and, eq, sql, desc } from 'drizzle-orm'
import { db } from '../client'
import { images, tagEnum, imageDownloads, userFavorites } from '../schema'
import { withErrorHandling, withTransaction } from '../utils'

export interface ImageFilter {
    tags?: string[]
    isPremium?: boolean
    page?: number
    limit?: number
}

export const imageRepository = {
    /**
     * Get all images with optional filtering
     * @returns Array of images matching the filter criteria
     */
    async getImages(filter: ImageFilter = {}): Promise<(typeof images.$inferSelect)[]> {
        const result = await withErrorHandling(async () => {
            const { tags, isPremium, page = 1, limit = 20 } = filter

            // Build conditions array
            const conditions = []

            // Apply tag filter if provided
            if (tags && tags.length > 0) {
                // For array contains operator, we need to use a custom SQL expression
                const enumTags = tags.map(
                    (tag) => tag as unknown as (typeof tagEnum.enumValues)[number]
                )
                conditions.push(sql`${images.tags} && ARRAY[${sql.join(enumTags)}]::tag_enum[]`)
            }

            // Apply premium filter if provided
            if (isPremium !== undefined) {
                conditions.push(eq(images.isPremium, isPremium))
            }

            // Apply all conditions with AND
            const whereCondition = conditions.length > 0 ? and(...conditions) : undefined

            // Create and execute query with pagination
            return db
                .select()
                .from(images)
                .where(whereCondition)
                .orderBy(desc(images.createdAt))
                .limit(limit)
                .offset((page - 1) * limit)
        })

        return result || []
    },

    /**
     * Get a single image by ID
     * @returns The image or null if not found
     */
    async getImageById(id: number): Promise<typeof images.$inferSelect | null> {
        const result = await withErrorHandling(async () => {
            const rows = await db.select().from(images).where(eq(images.id, id)).limit(1)

            return rows[0] || null
        })

        return result || null
    },

    /**
     * Create a new image
     * @returns The created image or null if creation failed
     */
    async createImage(
        imageData: typeof images.$inferInsert
    ): Promise<typeof images.$inferSelect | null> {
        const result = await withErrorHandling(async () => {
            const rows = await db.insert(images).values(imageData).returning()

            return rows[0] || null
        })

        return result || null
    },

    /**
     * Update an existing image
     * @returns The updated image or null if update failed
     */
    async updateImage(
        id: number,
        imageData: Partial<typeof images.$inferInsert>
    ): Promise<typeof images.$inferSelect | null> {
        const result = await withErrorHandling(async () => {
            const rows = await db.update(images).set(imageData).where(eq(images.id, id)).returning()

            return rows[0] || null
        })

        return result || null
    },

    /**
     * Delete an image
     * @returns The deleted image or null if deletion failed
     */
    async deleteImage(id: number): Promise<typeof images.$inferSelect | null> {
        const result = await withErrorHandling(async () => {
            const rows = await db.delete(images).where(eq(images.id, id)).returning()

            return rows[0] || null
        })

        return result || null
    },

    /**
     * Track a download event and increment the download counter
     * @returns true if successful, false otherwise
     */
    async trackDownload(imageId: number, userId: string): Promise<boolean> {
        const result = await withTransaction(async (tx) => {
            // Insert download record
            await tx.insert(imageDownloads).values({ imageId, userId })

            // Increment download count
            await tx
                .update(images)
                .set({ downloadCount: sql`${images.downloadCount} + 1` })
                .where(eq(images.id, imageId))

            return true
        })

        return result === true
    },

    /**
     * Get user's favorite images
     * @returns Array of favorite images
     */
    async getUserFavorites(
        userId: string,
        page = 1,
        limit = 20
    ): Promise<{ image: typeof images.$inferSelect }[]> {
        const result = await withErrorHandling(async () => {
            return db
                .select({
                    image: images,
                })
                .from(userFavorites)
                .innerJoin(images, eq(userFavorites.imageId, images.id))
                .where(eq(userFavorites.userId, userId))
                .orderBy(desc(images.createdAt))
                .limit(limit)
                .offset((page - 1) * limit)
        })

        return result || []
    },

    /**
     * Add an image to user's favorites
     * @returns The created favorite record or null if addition failed
     */
    async addToFavorites(
        imageId: number,
        userId: string
    ): Promise<typeof userFavorites.$inferSelect | null> {
        const result = await withErrorHandling(async () => {
            const rows = await db
                .insert(userFavorites)
                .values({ imageId, userId })
                .onConflictDoNothing()
                .returning()

            return rows[0] || null
        })

        return result || null
    },

    /**
     * Remove an image from user's favorites
     * @returns The removed favorite record or null if removal failed
     */
    async removeFromFavorites(
        imageId: number,
        userId: string
    ): Promise<typeof userFavorites.$inferSelect | null> {
        const result = await withErrorHandling(async () => {
            const rows = await db
                .delete(userFavorites)
                .where(and(eq(userFavorites.imageId, imageId), eq(userFavorites.userId, userId)))
                .returning()

            return rows[0] || null
        })

        return result || null
    },
}
