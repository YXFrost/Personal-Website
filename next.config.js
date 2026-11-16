import { readFileSync } from "node:fs";
const legacyRoutes = JSON.parse(readFileSync(new URL("./content/legacy-routes.json", import.meta.url), "utf8"));
const config = {
  poweredByHeader: false, reactStrictMode: true, devIndicators: false,
  experimental: { globalNotFound: true },
  async redirects() {
    return legacyRoutes
      .filter(({ documentId }) => !documentId || (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.CONTENT_PREVIEW !== "1"))
      .map(({ source, destination }) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
    ] }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }],
    formats: ["image/avif", "image/webp"], deviceSizes: [320, 390, 640, 768, 1024, 1280, 1440, 1920]
  }
};
export default config;
