import { getUploadThingFile, updateUploadThingFile } from '~/utils/uploadthing';

/**
 * GET /api/images/[key]
 * Fetches a single image by its key
 */
export const GET = defineEventHandler(async (event) => {
  try {
    const key = getRouterParam(event, 'key');
    
    if (!key) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing file key',
      });
    }
    
    const file = await getUploadThingFile(key);
    
    if (!file) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found',
      });
    }
    
    return file;
  } catch (error: any) {
    console.error(`Error in GET /api/images/[key]:`, error);
    
    if (error.statusCode) {
      throw error;
    }
    
    // Format the error response
    const errorResponse = {
      message: error.message || 'Failed to fetch image',
      code: error.code || 'INTERNAL_SERVER_ERROR',
      data: error.data || null
    };
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch image',
      message: errorResponse.message,
      data: errorResponse
    });
  }
});

/**
 * PATCH /api/images/[key]
 * Updates a file's metadata or customId
 */
export const PATCH = defineEventHandler(async (event) => {
  try {
    const key = getRouterParam(event, 'key');
    
    if (!key) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing file key',
      });
    }
    
    const body = await readBody(event);
    
    if (!body || (typeof body !== 'object')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body',
      });
    }
    
    const updateData: { customId?: string; metadata?: Record<string, any> } = {};
    
    if ('customId' in body) {
      updateData.customId = body.customId;
    }
    
    if ('metadata' in body && typeof body.metadata === 'object') {
      updateData.metadata = body.metadata;
    }
    
    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid fields to update',
      });
    }
    
    const updatedFile = await updateUploadThingFile(key, updateData);
    
    return updatedFile;
  } catch (error: any) {
    console.error(`Error in PATCH /api/images/[key]:`, error);
    
    if (error.statusCode) {
      throw error;
    }
    
    // Format the error response
    const errorResponse = {
      message: error.message || 'Failed to update image',
      code: error.code || 'INTERNAL_SERVER_ERROR',
      data: error.data || null
    };
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to update image',
      message: errorResponse.message,
      data: errorResponse
    });
  }
}); 