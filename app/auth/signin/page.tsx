import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { SignInForm } from '@/components/auth/signin-form'
import { Suspense } from 'react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to manage your products
            </p>
          </div>

          {/* Form with Suspense */}
          <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
            <SignInForm />
          </Suspense>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Back to{' '}
              <Link href="/" className="text-primary hover:underline">
                website
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
