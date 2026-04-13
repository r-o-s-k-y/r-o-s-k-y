# Admin Dashboard Setup Guide

## Overview
Your Sura's Chicken admin dashboard is now ready! This guide will help you complete the setup and get started managing your products.

## Quick Setup Steps

### 1. Set Environment Variables
You need to add these environment variables to your Vercel project. Go to **Settings → Vars** in the top right:

#### Required Variables:
- `NEXTAUTH_URL`: Your app URL (e.g., `https://yourdomain.com` or `http://localhost:3000` for local development)
- `NEXTAUTH_SECRET`: Generate one with: `openssl rand -base64 32`

#### OAuth Configuration (Choose at least one):

**GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Set Authorization callback URL to: `{NEXTAUTH_URL}/api/auth/callback/github`
4. Add these variables:
   - `AUTH_GITHUB_ID`: Your GitHub Client ID
   - `AUTH_GITHUB_SECRET`: Your GitHub Client Secret

**Google OAuth:**
1. Go to https://console.cloud.google.com/
2. Create a new project and enable Google+ API
3. Create OAuth 2.0 credentials (Web application)
4. Add authorized redirect URIs: `{NEXTAUTH_URL}/api/auth/callback/google`
5. Add these variables:
   - `AUTH_GOOGLE_ID`: Your Google Client ID
   - `AUTH_GOOGLE_SECRET`: Your Google Client Secret

### 2. Verify Supabase Storage Bucket
The database setup script created a `products` storage bucket. Check that it exists in your Supabase dashboard under Storage.

### 3. Database Tables
The following tables were automatically created:
- `products` - Stores all menu items (name, description, price, discount, image_url)
- `users` - Created by NextAuth (stores user sessions)

Row Level Security (RLS) policies are already configured to protect your data.

## Features Overview

### Public Menu Page (`/`)
- Displays all products from the database
- Real-time search functionality
- Shows discounts prominently
- Beautiful gradient design with product cards
- "Admin" button in header to access dashboard

### Admin Dashboard (`/admin`)
**Protected routes - Only authenticated users can access**

#### Features:
1. **Products Management** (`/admin/products`)
   - View all products in a table
   - Search products by name
   - Edit product details
   - Delete products
   - Batch actions (coming soon)

2. **Add Product** (`/admin/products/new`)
   - Create new menu items
   - Upload product image via photo selector
   - Set price and discount
   - Add description

3. **Edit Product** (`/admin/products/[id]`)
   - Modify existing products
   - Replace images
   - Update pricing and discounts
   - Preview changes before saving

### Image Management
- Photos are stored in Supabase Storage
- Automatic image optimization
- Public URLs for CDN delivery
- Old images automatically deleted when updated

## Database Schema

### Products Table
```
id: UUID (primary key)
name: text (product name)
description: text (detailed description)
price: decimal (price in dollars)
discount: integer (discount percentage 0-100)
image_url: text (public URL to product image)
created_at: timestamp
updated_at: timestamp
user_id: UUID (admin who created it)
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (requires auth)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (requires auth)
- `DELETE /api/products/[id]` - Delete product (requires auth)

### Authentication
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/callback/github` - GitHub OAuth callback
- `POST /api/auth/callback/google` - Google OAuth callback

## File Structure
```
/app
  /admin                  - Admin dashboard routes
    /layout.tsx          - Admin layout with sidebar
    /page.tsx            - Dashboard overview
    /products            - Product management
      /[id]/page.tsx     - Edit product
      /new/page.tsx      - Create product
      /page.tsx          - Products list
  /api
    /auth                - NextAuth endpoints
    /products            - Product CRUD endpoints
  /auth
    /signin              - Login page
  layout.tsx             - Root layout with providers
  page.tsx               - Public menu page

/components
  /admin
    /admin-layout.tsx    - Admin sidebar & navigation
    /product-form.tsx    - Reusable product form
  /providers.tsx         - NextAuth SessionProvider
  /ui                    - shadcn/ui components

/lib
  /auth.ts              - NextAuth configuration
  /db.ts                - Database queries
  /storage.ts           - Supabase storage utilities
  /utils.ts             - Helper functions

/scripts
  /setup-db.sql         - Database initialization
```

## Customization

### Change Branding
Edit these files to customize the restaurant name and branding:
- `app/page.tsx` - Public menu page
- `app/layout.tsx` - Metadata/title
- `components/admin/admin-layout.tsx` - Admin sidebar branding

### Add More Fields
To add fields like category, calories, ingredients, etc.:
1. Add columns to products table in Supabase
2. Update the Product interface in `lib/db.ts`
3. Add form fields in `components/admin/product-form.tsx`
4. Update validation schema in the form

### Customize Theme
- Colors in `app/globals.css`
- Typography in layout.tsx
- Component styles in shadcn/ui components

## Troubleshooting

### "Provider not configured" error
Make sure all environment variables are set correctly in Vercel Settings → Vars

### Images not uploading
- Check Supabase Storage bucket permissions
- Verify `products` bucket exists
- Check file size (max 5MB recommended)

### Can't sign in
- Verify OAuth credentials are correct
- Check NEXTAUTH_URL matches your domain
- Clear cookies and try again in incognito mode

### Database errors
- Check Supabase connection is active
- Verify database tables exist
- Check RLS policies aren't blocking operations

## Next Steps

1. Set up OAuth credentials (GitHub or Google)
2. Add environment variables
3. Deploy to Vercel
4. Sign in to admin dashboard
5. Create your first product
6. Share your menu with customers!

## Support
For issues:
- Check Supabase dashboard for database errors
- Check Vercel logs for API errors
- Verify environment variables are set correctly
