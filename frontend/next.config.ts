import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'api.sedmarket.kz'], // 👈 добавили api.sedmarket.kz
  },
  reactStrictMode: false
};

export default nextConfig;
