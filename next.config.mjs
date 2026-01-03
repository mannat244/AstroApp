/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  serverComponentsExternalPackages: ['@vercel/og', 'sharp'],
  experimental: {
    serverComponentsExternalPackages: ['@vercel/og', 'sharp'],
  },
};

export default nextConfig;
