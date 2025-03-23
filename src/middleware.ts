import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TEMPORARY: Disabled middleware to break out of redirect loop
export async function middleware(req: NextRequest) {
  // Create a response and supabase client
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  try {
    // Add debug information to response headers
    const pathname = req.nextUrl.pathname;
    res.headers.set('x-pathname', pathname);
    
    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    res.headers.set('x-has-session', session ? 'true' : 'false');
    
    // *** TEMPORARY: Return without redirects to stop the refresh loop ***
    console.log(`Middleware bypassed for ${pathname}, has session: ${!!session}`);
    return res;

    /* Commenting out all redirects temporarily
    // Add a cookie to track redirects
    const redirectCount = parseInt(req.cookies.get('redirect_count')?.value || '0');
    
    // If there have been too many redirects, just proceed to avoid loops
    if (redirectCount > 2) {
      console.log(`Too many redirects (${redirectCount}), proceeding without redirect`);
      const newResponse = NextResponse.next();
      newResponse.cookies.set('redirect_count', '0');
      return newResponse;
    }

    // *** TEMPORARY CHANGE: Bypass redirection for testing ***
    if (pathname === '/auth/sign-in') {
      console.log('Allowing access to sign-in page without redirect checks');
      return res;
    }

    // Check auth state for protected routes
    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                            pathname.startsWith('/settings');
    
    // If there's no session and it's a protected route
    if (!session && isProtectedRoute) {
      console.log(`No session, redirecting from ${pathname} to /auth/sign-in`);
      const redirectUrl = new URL('/auth/sign-in', req.url);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set('redirect_count', (redirectCount + 1).toString());
      return response;
    }

    // If there's a session and the user is trying to access auth routes
    if (session && pathname.startsWith('/auth')) {
      console.log(`User has session, redirecting from ${pathname} to /dashboard`);
      const redirectUrl = new URL('/dashboard', req.url);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set('redirect_count', (redirectCount + 1).toString());
      return response;
    }

    // If user is on the homepage and already authenticated, redirect to dashboard
    if (session && pathname === '/') {
      console.log(`User has session on homepage, redirecting to /dashboard`);
      const redirectUrl = new URL('/dashboard', req.url);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set('redirect_count', (redirectCount + 1).toString());
      return response;
    }
    */

    // Reset redirect count for successful requests
    res.cookies.set('redirect_count', '0');
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of errors, just proceed rather than risk a redirect loop
    return res;
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/settings/:path*',
    '/auth/:path*',
  ],
}; 