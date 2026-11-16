import settings from "@/content/site.json";
export const site = settings;
export const preview = process.env.CONTENT_PREVIEW === "1";
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

function publicOrigin(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname.includes(".") && !url.hostname.endsWith(".localhost") &&
      !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash) {
      return url.origin;
    }
  } catch {
    // Local development and unset deployment values use the fallback below.
  }
}

const origin = [process.env.SITE_URL, process.env.NEXT_PUBLIC_SITE_URL, productionHost && `https://${productionHost}`]
  .map(publicOrigin)
  .find(Boolean);
export const siteUrl = origin || "http://localhost:3000";
export const isPublicSite = Boolean(origin) && !preview &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
