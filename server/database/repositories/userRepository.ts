import { eq } from 'drizzle-orm'
import { db } from '../client'
import { userPremiumAccess } from '../schema'
import { withErrorHandling } from '../utils'

export const userRepository = {
    /**
     * Check if a user has premium access
     * @returns true if the user has premium access, false otherwise
     */
    async hasPremiumAccess(userId: string): Promise<boolean> {
        const result = await withErrorHandling(async () => {
            const rows = await db
                .select()
                .from(userPremiumAccess)
                .where(eq(userPremiumAccess.userId, userId))
                .limit(1)

            return rows.length > 0
        })

        return result === true
    },

    /**
     * Grant premium access to a user
     * @returns The created premium access record or null if creation failed
     */
    async grantPremiumAccess(
        userId: string
    ): Promise<typeof userPremiumAccess.$inferSelect | null> {
        const result = await withErrorHandling(async () => {
            // Check if user already has premium access
            const existingAccess = await db
                .select()
                .from(userPremiumAccess)
                .where(eq(userPremiumAccess.userId, userId))
                .limit(1)

            if (existingAccess.length > 0) {
                return existingAccess[0]
            }

            // Grant premium access
            const rows = await db.insert(userPremiumAccess).values({ userId }).returning()

            return rows[0] || null
        })

        return result || null
    },

    /**
     * Revoke premium access from a user
     * @returns true if access was revoked, false otherwise
     */
    async revokePremiumAccess(userId: string): Promise<boolean> {
        const result = await withErrorHandling(async () => {
            const rows = await db
                .delete(userPremiumAccess)
                .where(eq(userPremiumAccess.userId, userId))
                .returning()

            return rows.length > 0
        })

        return result === true
    },

    /**
     * Get premium access details for a user
     * @returns The premium access record or null if not found
     */
    async getPremiumAccessDetails(
        userId: string
    ): Promise<typeof userPremiumAccess.$inferSelect | null> {
        const result = await withErrorHandling(async () => {
            const rows = await db
                .select()
                .from(userPremiumAccess)
                .where(eq(userPremiumAccess.userId, userId))
                .limit(1)

            return rows[0] || null
        })

        return result || null
    },
}
