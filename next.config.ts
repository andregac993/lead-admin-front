import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Desabilitar Strict Mode para evitar dupla renderização
  logging: {
    fetches: {
      fullUrl: false, // Reduzir logs de fetch em dev
    },
  },
};

export default nextConfig;
