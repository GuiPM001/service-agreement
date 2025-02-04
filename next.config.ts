import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/app",
  assetPrefix: "/app",
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
