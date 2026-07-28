import { supabase } from '../config/supabase';
import { AppError } from '../utils/errorFormatter';
import crypto from 'crypto';

export class StorageService {
  /**
   * Uploads a file to the 'documentation' public bucket in Supabase.
   * Returns the public URL and the storage bucket path.
   */
  static async uploadFile(
    file: Express.Multer.File,
    folder: 'notices' | 'resources'
  ): Promise<{ fileUrl: string; filePath: string }> {
    const fileExtension = file.originalname.split('.').pop();
    const randomHash = crypto.randomBytes(8).toString('hex');
    const fileName = `${randomHash}_${Date.now()}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to 'documentation' bucket
    const { error } = await supabase.storage
      .from('documentation')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new AppError(500, `Storage upload failed: ${error.message}`);
    }

    // Get public URL
    const { data } = supabase.storage
      .from('documentation')
      .getPublicUrl(filePath);

    return {
      fileUrl: data.publicUrl,
      filePath,
    };
  }

  /**
   * Deletes a file from the 'documentation' bucket in Supabase.
   */
  static async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from('documentation')
      .remove([filePath]);

    if (error) {
      throw new AppError(500, `Storage deletion failed: ${error.message}`);
    }
  }
}
