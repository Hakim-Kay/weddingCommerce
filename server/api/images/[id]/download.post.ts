import { imageRepository } from '~/server/database/repositories/imageRepository'
import { userRepository } from '~/server/database/repositories/userRepository'
import { getServerSupabase } from '~/server/database/client'

export default defineEventHandler(async (event) => {
    try {
        // Get image ID from route params
        const id = getRouterParam(event, 'id')

        if (!id || isNaN(parseInt(id))) {
            return {
                success: false,
                error: 'Invalid image ID',
            }
        }

        // Get user ID from auth (in a real implementation, this would come from Clerk)
        // For now, we'll use a mock user ID
        const userId = 'mock-user-id'

        // Get image by ID
        const image = await imageRepository.getImageById(parseInt(id))

        if (!image) {
            return {
                success: false,
                error: 'Image not found',
            }
        }

        // Check if the image is premium and if the user has premium access
        if (image.isPremium) {
            const hasPremiumAccess = await userRepository.hasPremiumAccess(userId)

            if (!hasPremiumAccess) {
                return {
                    success: false,
                    error: 'Premium access required to download this image',
                }
            }
        }

        // Track the download
        await imageRepository.trackDownload(parseInt(id), userId)

        // Get a fresh instance of the Supabase client
        const supabase = getServerSupabase()
        
        // Generate a signed URL for the image
        const { data, error } = await supabase.storage
            .from('Wedding Images')
            .createSignedUrl(image.imagePath, 60) // 60 seconds expiry

        if (error) {
            // Handle the error directly instead of rethrowing it
            console.error('Error generating signed URL:', error)
            return {
                success: false,
                error: 'Failed to generate download URL',
            }
        }

        return {
            success: true,
            data: {
                downloadUrl: data.signedUrl,
                expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
            },
        }
    } catch (error) {
        console.error(`Error downloading image:`, error)

        return {
            success: false,
            error: 'Failed to download image',
        }
    }
})
