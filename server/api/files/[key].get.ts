import { UTApi } from "uploadthing/server";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const utapi = new UTApi();
    const appId = config.public.uploadthingAppId;
    
    // Get the file key from the route params
    const key = getRouterParam(event, 'key');
    
    if (!key) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'File key is required',
      });
    }
    
    // Fetch all files and filter by key
    const files = await utapi.listFiles();
    const file = files.files.find(f => f.key === key);
    
    if (!file) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'File not found',
      });
    }
    
    // Add the full URL to the file
    return {
      ...file,
      url: `https://${appId}.ufs.sh/f/${file.key}`,
    };
  } catch (error: any) {
    console.error('Error fetching file:', error);
    
    // Format the error response
    const errorResponse = {
      message: error.message || 'Failed to fetch file',
      code: error.code || 'INTERNAL_SERVER_ERROR',
      data: error.data || null
    };
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch file',
      message: errorResponse.message,
      data: errorResponse
    });
  }
}); 