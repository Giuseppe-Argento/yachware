import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 async rewrites() {
    return [
      {
        source: '/analytics',
        destination: 'http://localhost:3001/analytics',
      },
      {
        source: '/analytics/:path*',
        destination: 'http://localhost:3001/analytics/:path*',
      },
    ]
  },
};

export default nextConfig;
