import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

const nextConfig: NextConfig = {
  transpilePackages: ["shared-ui", "shared-api"],

  experimental: {
    reactCompiler: true,
  },

  images: {
    // avif trước để browser hỗ trợ được dùng avif (nhỏ hơn ~50% so với webp)
    formats: ["image/avif", "image/webp"],
    // deviceSizes cho full-width / hero images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // imageSizes cho fill/fixed nhỏ (cards, thumbnails)
    imageSizes: [64, 128, 256, 384, 480],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    // Cloudinary tự trả avif/webp qua f_auto — tắt Next.js re-encode để tránh double-transform
    // Nếu URL không đi qua f_auto thì bỏ dòng này
    // unoptimized: false, // giữ Next.js optimization cho non-Cloudinary URLs nếu có
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 ngày
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
