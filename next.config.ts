import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.build.json',
    ignoreBuildErrors: false
  }
};

export default nextConfig;
