/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['economictimes.indiatimes.com', 'moneycontrol.com', 'business-standard.com', 'livemint.com'],
    unoptimized: true, // Required for static export
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure for static export (Render static sites)
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
}

module.exports = nextConfig 