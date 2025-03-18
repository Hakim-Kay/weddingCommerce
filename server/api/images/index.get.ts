import { defineEventHandler, getQuery } from 'h3'
import { imageRepository } from '~/server/database/repositories'

export default defineEventHandler(async (event) => {
    try {
        // Get query parameters
        const query = getQuery(event)

        // Parse filter parameters
        const filter = {
            tags: query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) : undefined,
            isPremium:
                query.isPremium === 'true' ? true : query.isPremium === 'false' ? false : undefined,
            page: query.page ? parseInt(query.page as string) : 1,
            limit: query.limit ? parseInt(query.limit as string) : 20,
        }

        // Get images with filter
        const images = await imageRepository.getImages(filter)

        // Return images
        return {
            success: true,
            data: images,
        }
    } catch (error) {
        console.error('Error fetching images:', error)
        return {
            success: false,
            error: 'Failed to fetch images',
        }
    }
})
