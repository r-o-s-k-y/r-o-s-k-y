import { type NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
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

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      // Check if user is an admin in Supabase
      try {
        const sb = getSupabase()
        const { data } = await sb
          .from('users')
          .select('role')
          .eq('email', user.email)
          .single()

        // Allow sign in if user exists and is admin
        if (data?.role === 'admin') {
          return true
        }

        // Create new user as admin if first time (or you can default to user role)
        if (!data) {
          await sb.from('users').insert({
            email: user.email,
            name: user.name,
            role: 'admin', // Default to admin for now
          })
          return true
        }

        return false
      } catch (error) {
        console.error('Auth error:', error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
