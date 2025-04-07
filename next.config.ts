import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pdf-uploader-server-s9iw.onrender.com/api/:path*' // Backend port
      },

    ];
  },
};

export default nextConfig;
