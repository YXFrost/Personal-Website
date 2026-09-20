import settings from "@/content/site.json";
export const site = settings;
export const preview = process.env.CONTENT_PREVIEW === "1";
export const siteUrl = (
  process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export const hasPublicOrigin =
  /^https:\/\//.test(siteUrl) && !siteUrl.includes("localhost");
export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
