import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost", "images.unsplash.com"],
  },
  async headers() {
    return [
      {
        source: "/models/tsintskaro-graveyard/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Temporarily removed Payload CMS specific configurations
  // experimental: {
  //   serverComponentsExternalPackages: ['payload'],
  // },
  // webpack: (config) => {
  //   config.externals.push('@payloadcms/db-mongodb');
  //   return config;
  // },
};

export default nextConfig;
