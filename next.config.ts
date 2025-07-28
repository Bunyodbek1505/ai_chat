import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.dribbble.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/voice-proxy/:path*",
        destination: "http://192.168.102.8:8080/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/voice-proxy/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
