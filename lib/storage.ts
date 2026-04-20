import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  try {
    const sb = getSupabase();
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${productId}-${timestamp}-${file.name}`;
    const path = `products/${filename}`;

    // Upload file
    const { data, error } = await sb.storage
      .from('products')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = sb.storage
      .from('products')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('[v0] Image upload error:', error);
    throw error;
  }
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    const sb = getSupabase();
    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    const { error } = await sb.storage
      .from('products')
      .remove([`products/${filename}`]);

    if (error) {
      console.error('[v0] Delete image error:', error);
      // Don't throw, just log - image might already be deleted
    }
  } catch (error) {
    console.error('[v0] Delete image error:', error);
  }
}
