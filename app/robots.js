import { absoluteUrl, isPublicSite } from "@/lib/site";
export default function robots() {
  // Crawlers must be able to read the noindex metadata on previews and Studio.
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(isPublicSite ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}
