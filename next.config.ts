import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.pexels.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'picsum.photos' },
    ],
  },
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'gsap',
    'lenis',
    'framer-motion',
  ],
};

export default nextConfig;
