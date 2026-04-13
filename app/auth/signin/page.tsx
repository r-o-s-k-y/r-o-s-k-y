'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Github, Chrome } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const error = searchParams.get('error')

  async function handleSignIn(provider: 'github' | 'google') {
    try {
      setIsLoading(true)
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl,
      })

      if (result?.ok) {
        router.push(callbackUrl)
      } else if (result?.error) {
        console.error('Sign in error:', result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error === 'AccessDenied'
                ? 'You do not have permission to access this dashboard.'
                : 'An error occurred during sign in. Please try again.'}
            </div>
          )}

          {/* Sign In Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSignIn('github')}
              disabled={isLoading}
              variant="outline"
              className="w-full h-10"
            >
              <Github className="w-4 h-4 mr-2" />
              Sign in with GitHub
            </Button>
            <Button
              onClick={() => handleSignIn('google')}
              disabled={isLoading}
              variant="outline"
              className="w-full h-10"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Sign in with Google
            </Button>
          </div>

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
