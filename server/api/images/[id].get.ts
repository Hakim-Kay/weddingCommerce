import { imageRepository } from '~/server/database/repositories/imageRepository'

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

        // Get image by ID
        const image = await imageRepository.getImageById(parseInt(id))

        if (!image) {
            return {
                success: false,
                error: 'Image not found',
            }
        }

        return {
            success: true,
            data: image,
        }
    } catch (error) {
        console.error(`Error fetching image:`, error)

        return {
            success: false,
            error: 'Failed to fetch image',
        }
    }
})
