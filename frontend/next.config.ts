import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // 👈 разрешаем картинки с localhost
  },
  reactStrictMode: false
};

export default nextConfig;
