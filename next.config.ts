import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist/client",
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
