import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: 'api.dicebear.com',
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
