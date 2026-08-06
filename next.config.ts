import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist/client",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
