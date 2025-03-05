export interface UploadThingFile {
  key: string;
  name: string;
  size: number;
  url: string;
  customId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UploadThingResponse {
  files: UploadThingFile[];
  totalFiles: number;
  nextCursor?: string;
} 