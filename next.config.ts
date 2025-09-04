import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Désactivez reactStrictMode ou mettez-le à false pour le déploiement
  reactStrictMode: false,
  
  // Supprimez la section experimental si vous n'en avez pas besoin
  // experimental: {
  //   optimizeCss: true,
  // },

  images: {
    domains: ['localhost'],
    unoptimized: true, // Bon pour Vercel
  },

  trailingSlash: false,

  // Supprimez le compiler ou ajustez-le
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },

  // Ajoutez ces configurations importantes pour Vercel
  output: 'standalone',
  compress: true,
  
  // Configuration des en-têtes de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

export default nextConfig;