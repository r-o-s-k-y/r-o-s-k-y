import { withAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'

export default withAuth(function middleware(req: NextRequest) {
  // The withAuth middleware already checks if the user is authenticated
  // If not authenticated, it will redirect to the sign-in page
  return
})

export const config = {
  matcher: ['/admin/:path*'],
}
