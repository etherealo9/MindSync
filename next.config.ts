import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use proper Next.js 15 configuration
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "mindsync.vercel.app"],
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
};

export default nextConfig;
