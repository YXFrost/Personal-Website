import { getEntry } from "./content";
import { absoluteUrl, site, preview, hasPublicOrigin } from "./site";
import { entryPath } from "./utils.mjs";
import { imageInfo } from "./images";
export function pageMetadata(title, description, path) {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
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
      preview || !hasPublicOrigin
        ? { index: false, follow: false }
        : { index: true, follow: true },
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
