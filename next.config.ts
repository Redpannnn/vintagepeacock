import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pastikan file SQLite ikut masuk ke bundle serverless (dibutuhkan API /api/wishes)
  outputFileTracingIncludes: {
    "/api/wishes": ["./db/custom.db"],
    "/api/wishes/route": ["./db/custom.db"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
