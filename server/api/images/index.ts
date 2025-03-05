import { fetchUploadThingFiles } from '~/utils/uploadthing';

/**
 * GET /api/images
 * Fetches images from UploadThing
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const limit = query.limit ? parseInt(query.limit as string) : 50;
    const cursor = query.cursor as string | undefined;
    
    const response = await fetchUploadThingFiles(limit, cursor);
    
    return response;
  } catch (error: any) {
    console.error('Error in /api/images:', error);
    
    // Format the error response
    const errorResponse = {
      message: error.message || 'Failed to fetch images',
      code: error.code || 'INTERNAL_SERVER_ERROR',
      data: error.data || null
    };
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch images',
      message: errorResponse.message,
      data: errorResponse
    });
  }
}); 