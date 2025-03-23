// Google OAuth configuration
export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  // Determine the appropriate redirect URI based on environment
  redirectUri: process.env.NODE_ENV === 'production' 
    ? `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/auth/google/callback`
    : process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback',
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
}; 