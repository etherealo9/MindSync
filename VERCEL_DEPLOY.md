# Vercel Deployment Guide for MindSync

## Prerequisites
1. A Vercel account
2. Git repository with your MindSync code
3. Google OAuth credentials configured for your production domain

## Setup Steps

### 1. Add Required Environment Variables
In the Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` (set to https://mindsync.vercel.app/auth/google/callback)
- `NEXT_PUBLIC_PRODUCTION_URL` (set to https://mindsync.vercel.app)

### 2. PWA Icons Setup
Before deploying, ensure all PWA icons are properly added to the `public/icons` directory:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### 3. Google OAuth Configuration
1. Go to Google Cloud Console
2. Update the authorized redirect URI to your Vercel domain: 
   - https://mindsync.vercel.app/auth/google/callback
3. Add your production domain to authorized JavaScript origins:
   - https://mindsync.vercel.app

### 4. Deployment Process
1. Connect your Git repository to Vercel
2. Configure the project settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

### 5. After Deployment
1. Verify Google OAuth integration is working
2. Confirm PWA functionality using Lighthouse audit
3. Test Supabase connection and data access
4. Check OpenAI API integration

### 6. Netlify to Vercel Migration Notes
1. Netlify functions have been replaced with Next.js API routes in `/src/app/api/`
2. After successful Vercel deployment, you can remove these Netlify-specific files:
   - `netlify.toml`
   - `netlify/functions/` directory
   - `NETLIFY_DEPLOY.md`
   - Remove `@netlify/plugin-nextjs` from package.json dev dependencies

## Troubleshooting

### Dependency Conflicts
If encountering dependency conflicts during deployment:
- React version has been downgraded to 18.2.0 from 19.0.0 to resolve conflicts with cmdk
- The `--legacy-peer-deps` flag is added to both vercel.json and the build script
- If other dependency conflicts occur, check the Vercel build logs and update package.json accordingly

### Linting and TypeScript Errors
The build is configured to skip linting with the `--no-lint` flag to prevent deployment failures due to:
- TypeScript type errors (`@typescript-eslint/no-explicit-any`, etc.)
- Unused variable warnings
- React hook dependency warnings
- Unescaped entity errors

For production-ready code, these issues should be addressed by:
1. Adding proper types instead of using `any`
2. Removing unused variables
3. Fixing React hook dependencies
4. Properly escaping entities in JSX

### CORS Issues
If experiencing CORS issues, check:
- Allowed origins in next.config.ts 
- Supabase configuration
- Google Cloud Console settings

### Missing PWA Icons
If PWA icons don't load, verify:
- The icons directory has all required image files
- The manifest.json references match the actual file paths
- The file names and dimensions match what's specified in manifest.json

### Authentication Problems
For Google OAuth issues:
- Confirm environment variables are correctly set in Vercel
- Verify the redirect URI exactly matches what's in Google Cloud Console
- Check browser console for specific error messages

### API Route Issues
If API routes aren't working:
- Check that the route file structure matches Next.js App Router format
- Verify vercel.json has the correct route configurations
- Make sure any client-side code is updated to use the new API paths 