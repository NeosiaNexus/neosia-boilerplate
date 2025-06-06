import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
      },
      {
        hostname: 'localhost',
        protocol: 'http',
        pathname: '/**',
      },
      {
        hostname: 'localhost',
        protocol: 'https',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  experimental: {
    nodeMiddleware: true,
    serverActions: {
      bodySizeLimit: '10000mb',
    },
  },
};

export default nextConfig;
