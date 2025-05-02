/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 🔓 Accepts any HTTPS domain
      },
    ],
  },
};

module.exports = nextConfig;
