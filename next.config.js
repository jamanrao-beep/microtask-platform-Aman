/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  // Add this to prevent build-time errors from missing env vars:
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig
