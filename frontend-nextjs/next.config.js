/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['economictimes.indiatimes.com', 'moneycontrol.com', 'business-standard.com', 'livemint.com'],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig 