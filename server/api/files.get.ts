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
    
    // Fetch files using the official SDK
    const response = await utapi.listFiles({
      limit,
    });
    
    // Transform the response to include the full URL
    const files = response.files.map((file) => ({
      ...file,
      url: `https://${appId}.ufs.sh/f/${file.key}`,
    }));
    
    return {
      files,
      hasMore: response.hasMore,
    };
  } catch (error: any) {
    console.error('Error fetching files:', error);
    
    // Format the error response
    const errorResponse = {
      message: error.message || 'Failed to fetch files',
      code: error.code || 'INTERNAL_SERVER_ERROR',
      data: error.data || null
    };
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch files',
      message: errorResponse.message,
      data: errorResponse
    });
  }
}); 