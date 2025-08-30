import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Disable telemetry
  telemetry: {
    disabled: true,
  },
  
  // Image optimization settings
  images: {
    unoptimized: true, // Disable image optimization for simpler Docker deployment
  },
};

export default nextConfig;
