/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  experimental: {
    optimizePackageImports: ["tailwindcss"],
  },
};

module.exports = nextConfig;
