import { defineEventHandler, readBody } from 'h3'
import { userRepository } from '~/server/database/repositories'

export default defineEventHandler(async (event) => {
    try {
        // Get request body
        const { userId } = await readBody(event)

        // Validate userId
        if (!userId) {
            return {
                success: false,
                statusCode: 400,
                error: 'User ID is required',
            }
        }

        // Grant premium access
        const premiumAccess = await userRepository.grantPremiumAccess(userId)

        if (!premiumAccess) {
            return {
                success: false,
                statusCode: 500,
                error: 'Failed to grant premium access',
            }
        }

        // Return success
        return {
            success: true,
            data: premiumAccess,
        }
    } catch (error: any) {
        console.error('Error granting premium access:', error)

        // Return error
        return {
            success: false,
            error: error.message || 'Failed to grant premium access',
        }
    }
})
