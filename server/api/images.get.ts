import { UTApi } from "uploadthing/server";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    // Initialize UTApi with the secret key
    const utapi = new UTApi();
    const appId = config.public.uploadthingAppId;
    
    // Get query parameters
    const query = getQuery(event);
    const limit = query.limit ? parseInt(query.limit as string) : 50;
    
    // Fetch images using the official SDK
    const response = await utapi.listFiles({
      limit,
    });
    
    // Transform the response to include the full URL and filter for images only
    const images = response.files
      .filter(file => {
        // Filter for image files based on name extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        return extension && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(extension);
      })
      .map((file) => ({
        ...file,
        url: `https://${appId}.ufs.sh/f/${file.key}`,
      }));
    
    return {
      images,
      hasMore: response.hasMore,
    };
  } catch (error: any) {
    console.error('Error fetching images:', error);
    
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