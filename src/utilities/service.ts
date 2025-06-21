// lib/SupabaseService.ts
import { supabase } from "@/lib/supabase";
import imageCompression from 'browser-image-compression';
import { UploadResult } from "./types";

export class Service {

  private bucket: string;
  private folder: string;

  constructor(bucket: string = 'images', folder: string = 'cars') {
    this.bucket = bucket;
    this.folder = folder;
  }

    //Image

    async uploadImage(file: File): Promise<UploadResult> {
        const compressed = await imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        });

        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}.${ext}`;
        const filePath = `${this.folder}/${filename}`;

        const { error: uploadError } = await supabase.storage
            .from(this.bucket)
            .upload(filePath, compressed);

        if (uploadError) throw new Error(uploadError.message);

        const { data } = supabase.storage.from(this.bucket).getPublicUrl(filePath);
        return {
            publicUrl: data.publicUrl,
            filePath,
        };
    }

    async removeImage(path: string): Promise<void> {
        const { error } = await supabase.storage.from(this.bucket).remove([path]);
        if (error) throw new Error(error.message);
    }

    async deleteData(id: number, table: string): Promise<{ error: string | null }> {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    }

}
