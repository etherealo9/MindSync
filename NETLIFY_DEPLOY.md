# Deploying MindSync to Netlify

This guide provides instructions for deploying the MindSync application to Netlify.

## Prerequisites

1. A Netlify account
2. Google Cloud Console project with OAuth credentials configured
3. Your repository pushed to GitHub, GitLab, or Bitbucket

## Deployment Steps

### 1. Configure Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add your production URLs:
   - Authorized JavaScript origins: `https://mindsync.netlify.app`
   - Authorized redirect URIs: `https://mindsync.netlify.app/api/auth/google/callback`
6. Save your changes

### 2. Connect to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect to your Git provider (GitHub, GitLab, etc.)
4. Select your repository
5. Configure build settings:
   - Build command: `npm run netlify-build`
   - Publish directory: `.next`
6. Click "Deploy site"

### 3. Configure Environment Variables

1. Once deployed, go to Site settings > Build & deploy > Environment
2. Add the following environment variables:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_PRODUCTION_URL=https://mindsync.netlify.app
   ```
3. Re-deploy your site

### 4. Set Up Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your domain

### 5. Verify Deployment

1. Visit your deployed site
2. Test the Google Calendar integration
3. Check Netlify logs if any issues occur

## Troubleshooting

### OAuth Redirect Issues

If you're having issues with OAuth redirects:

1. Double-check your redirect URIs in Google Cloud Console
2. Verify your environment variables in Netlify
3. Check Netlify Function logs for errors

### Build Failures

If your build fails:

1. Check Netlify build logs
2. Ensure all dependencies are properly installed
3. Verify your `next.config.ts` settings

## Additional Resources

- [Netlify Next.js Plugin Documentation](https://github.com/netlify/next-runtime)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2) 