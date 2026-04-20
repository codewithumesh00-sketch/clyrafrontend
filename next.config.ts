import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://clyraui.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
};

export default nextConfig;