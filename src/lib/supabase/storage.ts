import { supabase } from './client';

export const StorageAPI = {
  // Upload file to storage
  uploadFile: async (
    bucketName: string,
    filePath: string,
    file: File,
    options?: { contentType?: string }
  ): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: options?.contentType,
      });

    if (error) throw error;
    
    // Get public URL for the file
    const { data: publicURLData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return publicURLData.publicUrl;
  },

  // Delete file from storage
  deleteFile: async (bucketName: string, filePath: string): Promise<void> => {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) throw error;
  },

  // List files in a bucket with a specific prefix
  listFiles: async (bucketName: string, folderPath?: string): Promise<string[]> => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath || '', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) throw error;
    return data.map(file => file.name);
  }
}; 