import type { UploadThingFile, UploadThingResponse } from '~/types/uploadthing';

/**
 * Adapter for the official UploadThing composable to match our custom API
 */
export function useUploadThingAdapter() {
  const config = useRuntimeConfig();
  const appId = config.public.uploadthingAppId;
  
  /**
   * Fetches images from the API
   * @param limit - Number of images to fetch
   * @param cursor - Cursor for pagination
   * @returns Promise with UploadThingResponse
   */
  const fetchImages = async (
    limit: number = 50,
    cursor?: string
  ): Promise<UploadThingResponse> => {
    let url = `/api/images?limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    
    return await $fetch<UploadThingResponse>(url);
  };
  
  /**
   * Fetches a single image by its key
   * @param key - The key of the image to fetch
   * @returns Promise with UploadThingFile
   */
  const getImage = async (key: string): Promise<UploadThingFile> => {
    return await $fetch<UploadThingFile>(`/api/images/${key}`);
  };
  
  /**
   * Updates an image's customId or metadata
   * @param key - The key of the image to update
   * @param data - The data to update
   * @returns Promise with updated UploadThingFile
   */
  const updateImage = async (
    key: string,
    data: { customId?: string; metadata?: Record<string, any> }
  ): Promise<UploadThingFile> => {
    return await $fetch<UploadThingFile>(`/api/images/${key}`, {
      method: 'PATCH',
      body: data,
    });
  };
  
  /**
   * Searches for images by customId or metadata
   * @param params - Search parameters
   * @returns Promise with search results
   */
  const searchImages = async (
    params: { customId?: string; metadataKey?: string; metadataValue?: string }
  ): Promise<UploadThingResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.customId) {
      queryParams.append('customId', params.customId);
    }
    
    if (params.metadataKey) {
      queryParams.append('metadataKey', params.metadataKey);
    }
    
    if (params.metadataValue) {
      queryParams.append('metadataValue', params.metadataValue);
    }
    
    return await $fetch<UploadThingResponse>(`/api/images/search?${queryParams.toString()}`);
  };
  
  /**
   * Gets the direct URL for an image by its key
   * @param key - The key of the image
   * @returns The direct URL to the image
   */
  const getImageUrl = (key: string): string => {
    return `https://${appId}.ufs.sh/f/${key}`;
  };
  
  return {
    fetchImages,
    getImage,
    updateImage,
    searchImages,
    getImageUrl,
  };
} 