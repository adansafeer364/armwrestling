import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Smaller, faster responses
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Allow and optimize remote images (we store image LINKS, not blobs).
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
