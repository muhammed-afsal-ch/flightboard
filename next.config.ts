import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Image optimization settings
  images: {
    unoptimized: true, // Disable image optimization for simpler Docker deployment
  },
  
  // Disable type checking during build (we check types in CI)
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Disable ESLint during build (we lint in CI)
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
