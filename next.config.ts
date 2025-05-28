import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 💥 This disables ALL TypeScript build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // 💥 This disables ALL ESLint build errors
  }
};

export default nextConfig;
