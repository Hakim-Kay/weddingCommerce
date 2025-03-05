import type { UploadThingFile, UploadThingResponse } from '~/types/uploadthing';

/**
 * Fetches files from UploadThing API
 * @param limit - Number of files to fetch (default: 50)
 * @param cursor - Cursor for pagination
 * @returns Promise with UploadThingResponse
 */
export async function fetchUploadThingFiles(
  limit: number = 50,
  cursor?: string
): Promise<UploadThingResponse> {
  const config = useRuntimeConfig();
  const appId = config.public.uploadthingAppId;
  
  // Construct the URL for the UploadThing API
  let url = `https://uploadthing.com/api/files?limit=${limit}`;
  if (cursor) {
    url += `&cursor=${cursor}`;
  }
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-uploadthing-api-key': config.uploadthingSecret as string,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`UploadThing API error: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the response to match our interface
    const files: UploadThingFile[] = data.files.map((file: any) => ({
      key: file.key,
      name: file.name,
      size: file.size,
      url: `https://${appId}.ufs.sh/f/${file.key}`,
      customId: file.customId,
      metadata: file.metadata,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }));
    
    return {
      files,
      totalFiles: data.totalFiles,
      nextCursor: data.nextCursor,
    };
  } catch (error) {
    console.error('Error fetching files from UploadThing:', error);
    throw error;
  }
}

/**
 * Gets a single file from UploadThing by its key
 * @param fileKey - The key of the file to fetch
 * @returns Promise with UploadThingFile
 */
export async function getUploadThingFile(fileKey: string): Promise<UploadThingFile | null> {
  const config = useRuntimeConfig();
  const appId = config.public.uploadthingAppId;
  
  try {
    const response = await fetch(`https://uploadthing.com/api/files/${fileKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-uploadthing-api-key': config.uploadthingSecret as string,
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json();
      throw new Error(`UploadThing API error: ${errorData.message || response.statusText}`);
    }
    
    const file = await response.json();
    
    return {
      key: file.key,
      name: file.name,
      size: file.size,
      url: `https://${appId}.ufs.sh/f/${file.key}`,
      customId: file.customId,
      metadata: file.metadata,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching file from UploadThing:', error);
    throw error;
  }
}

/**
 * Updates a file's metadata or customId
 * @param fileKey - The key of the file to update
 * @param data - The data to update (customId and/or metadata)
 * @returns Promise with updated UploadThingFile
 */
export async function updateUploadThingFile(
  fileKey: string,
  data: { customId?: string; metadata?: Record<string, any> }
): Promise<UploadThingFile> {
  const config = useRuntimeConfig();
  const appId = config.public.uploadthingAppId;
  
  try {
    const response = await fetch(`https://uploadthing.com/api/files/${fileKey}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-uploadthing-api-key': config.uploadthingSecret as string,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`UploadThing API error: ${errorData.message || response.statusText}`);
    }
    
    const file = await response.json();
    
    return {
      key: file.key,
      name: file.name,
      size: file.size,
      url: `https://${appId}.ufs.sh/f/${file.key}`,
      customId: file.customId,
      metadata: file.metadata,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  } catch (error) {
    console.error('Error updating file on UploadThing:', error);
    throw error;
  }
} 