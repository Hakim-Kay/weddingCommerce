import { fetchUploadThingFiles } from '~/utils/uploadthing';
import type { UploadThingFile } from '~/types/uploadthing';

/**
 * GET /api/images/search
 * Searches for images by customId or metadata
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const customId = query.customId as string | undefined;
    const metadataKey = query.metadataKey as string | undefined;
    const metadataValue = query.metadataValue as string | undefined;
    
    // Validate search parameters
    if (!customId && (!metadataKey || !metadataValue)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing search parameters',
        message: 'Please provide either customId or both metadataKey and metadataValue',
      });
    }
    
    // Fetch all files (we'll filter them client-side)
    // In a production app, you might want to implement pagination for this
    const response = await fetchUploadThingFiles(100);
    
    let filteredFiles: UploadThingFile[] = response.files;
    
    // Filter by customId if provided
    if (customId) {
      filteredFiles = filteredFiles.filter(file => file.customId === customId);
    }
    
    // Filter by metadata if both key and value are provided
    if (metadataKey && metadataValue) {
      filteredFiles = filteredFiles.filter(file => {
        if (!file.metadata) return false;
        
        // Check if the metadata has the key and if its value matches
        return file.metadata[metadataKey] === metadataValue;
      });
    }
    
    return {
      files: filteredFiles,
      totalFiles: filteredFiles.length,
    };
  } catch (error: any) {
    console.error('Error in /api/images/search:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    // Format the error response
    const errorResponse = {
      message: error.message || 'Failed to search images',
      code: error.code || 'INTERNAL_SERVER_ERROR',
      data: error.data || null
    };
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to search images',
      message: errorResponse.message,
      data: errorResponse
    });
  }
}); 