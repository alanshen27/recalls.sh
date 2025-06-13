import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript error checking
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint error checking
  },
  transpilePackages: ['@auth/core'], // Transpile @auth/core to handle type conflicts
};

export default nextConfig;
