/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compresión gzip/brotli automática
  compress: true,

  // Optimización de imágenes: WebP + AVIF automático
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['images.unsplash.com', 'api.qrserver.com'],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Tree-shaking agresivo para paquetes pesados
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'firebase/firestore',
    ],
  },

  // Headers de caché para assets estáticos
  async headers() {
    return [
      {
        source: '/hyperframes/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/:path*.jpeg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.jpg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
