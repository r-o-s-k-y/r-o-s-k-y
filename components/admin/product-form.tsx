'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { uploadProductImage, deleteProductImage } from '@/lib/db'
import { useToast } from '@/hooks/use-toast'
import { Upload, X } from 'lucide-react'

export interface ProductFormData {
  name: string
  description: string
  price: number
  discount: number
  image_url?: string | null
}

interface ProductFormProps {
  initialData?: ProductFormData
  onSubmit: (data: ProductFormData) => Promise<void>
  isLoading?: boolean
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: '',
      description: '',
      price: 0,
      discount: 0,
      image_url: null,
    }
  )
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image_url || null
  )
  const [uploading, setUploading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Product name is required'
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0'
    }

    if (formData.discount < 0 || formData.discount > 100) {
      errors.discount = 'Discount must be between 0 and 100'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleImageUpload(file: File) {
    try {
      setUploading(true)

      // Validate file
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select a valid image file',
          variant: 'destructive',
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image must be less than 5MB',
          variant: 'destructive',
        })
        return
      }

      // Delete old image if exists
      if (formData.image_url && initialData?.image_url !== formData.image_url) {
        await deleteProductImage(formData.image_url)
      }

      // Upload new image
      const publicUrl = await uploadProductImage(
        file,
        `temp-${Date.now()}`
      )

      setFormData((prev) => ({
        ...prev,
        image_url: publicUrl,
      }))
      setPreviewImage(publicUrl)

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  function handleRemoveImage() {
    setFormData((prev) => ({
      ...prev,
      image_url: null,
    }))
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Form Fields */}
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }))
                setValidationErrors((prev) => ({ ...prev, name: '' }))
              }}
              placeholder="e.g., Doro Wot"
              className={validationErrors.name ? 'border-red-500' : ''}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0,
                }))
                setValidationErrors((prev) => ({ ...prev, price: '' }))
              }}
              placeholder="0.00"
              className={validationErrors.price ? 'border-red-500' : ''}
            />
            {validationErrors.price && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.price}</p>
            )}
          </div>

          {/* Discount */}
          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  discount: parseFloat(e.target.value) || 0,
                }))
                setValidationErrors((prev) => ({ ...prev, discount: '' }))
              }}
              placeholder="0"
              className={validationErrors.discount ? 'border-red-500' : ''}
            />
            {validationErrors.discount && (
              <p className="text-sm text-red-500 mt-1">
                {validationErrors.discount}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Image Upload */}
        <div className="space-y-4">
          <Label>Product Image</Label>
          <Card className="p-6">
            {previewImage ? (
              <div className="space-y-4">
                <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={handleRemoveImage}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Click to upload image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
              disabled={uploading}
            />
          </Card>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
            setValidationErrors((prev) => ({ ...prev, description: '' }))
          }}
          placeholder="Describe your product..."
          rows={6}
          className={validationErrors.description ? 'border-red-500' : ''}
        />
        {validationErrors.description && (
          <p className="text-sm text-red-500 mt-1">
            {validationErrors.description}
          </p>
        )}
      </div>

      {/* Calculated Price */}
      {formData.price > 0 && (
        <Card className="p-4 bg-muted">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Original Price:</span>
            <span className="font-semibold">${formData.price.toFixed(2)}</span>
          </div>
          {formData.discount > 0 && (
            <>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-semibold text-red-600">
                  -${(formData.price * (formData.discount / 100)).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-border mt-2 pt-2 flex justify-between items-center">
                <span className="text-muted-foreground font-medium">
                  Final Price:
                </span>
                <span className="text-lg font-bold text-green-600">
                  ${(
                    formData.price *
                    (1 - formData.discount / 100)
                  ).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || uploading}
        className="w-full"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  )
}
