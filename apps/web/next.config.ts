import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@smart-train/domain", "@smart-train/platform"],
};

export default nextConfig;

