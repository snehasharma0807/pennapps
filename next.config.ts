import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  // Optimize vendor chunks
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Ensure proper chunking
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
