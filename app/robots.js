import { absoluteUrl, preview, hasPublicOrigin } from "@/lib/site";
export default function robots() {
  return preview || !hasPublicOrigin
    ? { rules: { userAgent: "*", disallow: "/" } }
    : {
        rules: { userAgent: "*", allow: "/", disallow: "/studio" },
        sitemap: absoluteUrl("/sitemap.xml"),
      };
}
