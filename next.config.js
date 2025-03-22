/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  experimental: {
    optimizePackageImports: ["tailwindcss"],
  },

  eslint: {
    // This setting will completely disable ESLint during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
