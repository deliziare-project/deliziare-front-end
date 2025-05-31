// import type { NextConfig } from "next";
// import withPWA from 'next-pwa';
// const isDeliveryModule = process.env.BUILD_DELIVERY === 'true';
// const nextConfig: NextConfig = {
//    reactStrictMode: true,
//   /* config options here */
//   images: {
//     domains: ['res.cloudinary.com'],
//   },

// };

// export default nextConfig;
// export default withPWA({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//  disable: !isDeliveryModule || process.env.NODE_ENV === 'development',
// })(nextConfig);


import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const isDeliveryModule = process.env.BUILD_DELIVERY === 'true';

const baseConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isDeliveryModule || process.env.NODE_ENV === 'development',
});

export default isDeliveryModule ? pwaConfig(baseConfig) : baseConfig;
