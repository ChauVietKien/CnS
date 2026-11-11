import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "bizweb.dktcdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
