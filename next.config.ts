import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
   reactStrictMode: true,
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'],
  },
};

// export default nextConfig;
export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // optional
})(nextConfig);
