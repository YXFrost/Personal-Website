import { getEntry } from "./content";
import { absoluteUrl, site, isPublicSite } from "./site";
import { entryPath, isIndexable } from "./utils.mjs";
import { imageInfo } from "./images";
export function pageMetadata(title, description, path) {
  return {
    title,
    description,
    alternates: {
      ...(isPublicSite ? {
        canonical: absoluteUrl(path),
        types: { "application/rss+xml": absoluteUrl("/feed.xml") },
      } : {}),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: site.name,
      type: "website",
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "YN — a personal notebook",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
    robots:
      isPublicSite ? { index: true, follow: true } : { index: false, follow: false },
  };
}
export async function entryMetadata(type, slug) {
  const d = await getEntry(type, slug);
  if (!d) return { title: "Not found", robots: { index: false } };
  const meta = pageMetadata(
    d.seo?.title || d.title,
    d.seo?.description || d.summary,
    entryPath(d),
  );
  if (!isIndexable(d)) meta.robots = { index: false, follow: false };
  const cover = imageInfo(d.seo?.image || d.coverImage);
  if (cover && !cover.src.split("?")[0].endsWith(".svg")) {
    meta.openGraph.images = [
      {
        url: absoluteUrl(cover.src),
        width: cover.width,
        height: cover.height,
        alt: d.coverImage?.alt || d.title,
      },
    ];
    meta.twitter.images = [absoluteUrl(cover.src)];
  }
  if (type === "writing")
    Object.assign(meta.openGraph, {
      type: "article",
      publishedTime: d.publishedAt,
      modifiedTime: d.updatedAt,
    });
  return meta;
}
