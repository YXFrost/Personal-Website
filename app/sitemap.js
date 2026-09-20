import { getAllEntries } from "@/lib/content";
import { absoluteUrl, preview, hasPublicOrigin } from "@/lib/site";
import { entryPath } from "@/lib/utils.mjs";
export const revalidate = 60;
export default async function sitemap() {
  if (preview || !hasPublicOrigin) return [];
  return [
    ...["/", "/writing", "/projects", "/progress", "/about"].map((p) => ({
      url: absoluteUrl(p),
    })),
    ...(await getAllEntries()).map((d) => ({
      url: absoluteUrl(entryPath(d)),
      ...(d.updatedAt || d.publishedAt
        ? { lastModified: d.updatedAt || d.publishedAt }
        : {}),
    })),
  ];
}
