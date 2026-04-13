'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProductForm, ProductFormData } from '@/components/admin/product-form'
import { getProduct, updateProduct } from '@/lib/db'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [product, setProduct] = useState<ProductFormData | null>(null)
  const [productId, setProductId] = useState<string>('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadProduct() {
      try {
        const resolvedParams = await params
        setProductId(resolvedParams.id)

        const data = await getProduct(resolvedParams.id)
        if (!data) {
          toast({
            title: 'Error',
            description: 'Product not found',
            variant: 'destructive',
          })
          router.push('/admin/products')
          return
        }

        setProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          discount: data.discount,
          image_url: data.image_url,
        })
      } catch (error) {
        console.error('Error loading product:', error)
        toast({
          title: 'Error',
          description: 'Failed to load product',
          variant: 'destructive',
        })
      } finally {
        setIsLoadingProduct(false)
      }
    }

    loadProduct()
  }, [params, router, toast])

  async function handleSubmit(data: ProductFormData) {
    try {
      setIsLoading(true)
      await updateProduct(productId, {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        image_url: data.image_url,
      })

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      })

      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
          <p className="text-muted-foreground mt-1">Update product details</p>
        </div>
      </div>

      <Card className="p-6">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  )
}
