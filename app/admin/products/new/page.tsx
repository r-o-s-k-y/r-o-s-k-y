'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProductForm, ProductFormData } from '@/components/admin/product-form'
import { createProduct } from '@/lib/db'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'

export default function CreateProductPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(data: ProductFormData) {
    try {
      setIsLoading(true)
      await createProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        image_url: data.image_url,
      })

      toast({
        title: 'Success',
        description: 'Product created successfully',
      })

      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground mt-1">
            Create a new product for your menu
          </p>
        </div>
      </div>

      <Card className="p-6">
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  )
}
