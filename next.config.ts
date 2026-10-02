import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Fotos de complejos subidas a Vercel Blob
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      // Fotos de demo del seed (prisma/seed.ts)
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig
