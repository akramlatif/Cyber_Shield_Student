/** @type {import('next').NextConfig} */
// NOTE: This file mirrors next.config.ts. If you keep only one config file,
// prefer next.config.ts and delete this file to avoid ambiguity.
const nextConfig = {
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

module.exports = nextConfig;
