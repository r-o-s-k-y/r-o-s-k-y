import { createClient } from '@supabase/supabase-js'

let supabase: ReturnType<typeof createClient> | null = null

function getSupabase() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return supabase
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface ProductInput {
  name: string
  description: string
  price: number
  discount: number
  image_url?: string | null
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Get single product
export async function getProduct(id: string): Promise<Product | null> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

// Create product
export async function createProduct(input: ProductInput): Promise<Product> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('products')
    .insert({
      ...input,
      discount: input.discount || 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Update product
export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('products')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  const sb = getSupabase()
  const { error } = await sb.from('products').delete().eq('id', id)

  if (error) throw error
}

// Upload product image
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  const sb = getSupabase()
  const fileExt = file.name.split('.').pop()
  const fileName = `${productId}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await sb.storage
    .from('products')
    .upload(`images/${fileName}`, file, {
      upsert: true,
    })

  if (uploadError) throw uploadError

  const {
    data: { publicUrl },
  } = sb.storage.from('products').getPublicUrl(`images/${fileName}`)

  return publicUrl
}

// Delete product image
export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    const sb = getSupabase()
    const fileName = imageUrl.split('/').pop()
    if (!fileName) return

    const { error } = await sb.storage
      .from('products')
      .remove([`images/${fileName}`])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}
