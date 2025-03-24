import type { NextConfig } from "next";
import withPWA from 'next-pwa';

// Create a proper PWA configuration using next-pwa
const pwaConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  scope: '/',
  sw: 'service-worker.js',
  // Offline fallback page
  fallbacks: {
    document: '/offline',
  },
};

// Apply PWA configuration using withPWA wrapper
const nextConfig: NextConfig = {
  // Use proper Next.js 15 configuration
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "mindsync-ao.vercel.app"],
    },
    // Enable turbo for faster builds
    turbo: {},
  },
  // Standalone output for better performance
  output: "standalone",
  // Configure images
  images: {
    domains: ["lh3.googleusercontent.com"], // For Google profile images
    // Only disable optimization in development
    unoptimized: process.env.NODE_ENV === 'development',
    // Add better image formats
    formats: ['image/avif', 'image/webp'],
  },
  // Ensure environment variables are accessible
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  },
  // Enable compression
  compress: true,
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// Export the config wrapped with PWA
export default withPWA(pwaConfig)(nextConfig);
