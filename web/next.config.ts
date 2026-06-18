import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  devIndicators: false,

  // ── Image optimisation ──────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },

  // ── Compiler transforms ────────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ── Exclude Three.js from server bundle ───────────────────────────────────
  serverExternalPackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // ── Bundle analyzer & split chunks ────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@tsparticles/react",
      "@tsparticles/slim",
    ],
  },

  // ── Security headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",         value: "DENY" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/(.*)\\.(png|jpg|jpeg|svg|webp|avif|woff2|woff|ttf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
