/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Admin-uploaded brand assets, team photos, post covers etc.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "@react-three/drei"],
    // Node-only database driver: load it from node_modules at runtime.
    serverComponentsExternalPackages: ["pg"],
  },
  // Pages removed in the five-page redesign (Home, About, Services,
  // VaishnaviPay, Contact). Permanent, so search engines move their links.
  async redirects() {
    return [
      { source: "/industries", destination: "/services", permanent: true },
      { source: "/insights", destination: "/", permanent: true },
      { source: "/insights/:path*", destination: "/", permanent: true },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader"],
    });
    return config;
  },
};

export default nextConfig;
