import { getEntries } from "@/lib/content";
import { site, absoluteUrl, preview } from "@/lib/site";
import { entryPath, escapeXml as x } from "@/lib/utils.mjs";
export const revalidate = 60;
export async function GET() {
  const entries = preview ? [] : await getEntries("writing");
  const items = entries
    .map(
      (d) =>
        `<item><title>${x(d.title)}</title><link>${x(absoluteUrl(entryPath(d)))}</link><guid isPermaLink="true">${x(absoluteUrl(entryPath(d)))}</guid><description>${x(d.summary)}</description>${d.publishedAt ? `<pubDate>${new Date(d.publishedAt).toUTCString()}</pubDate>` : ""}</item>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${x(site.name)} — Writing</title><link>${x(absoluteUrl("/writing"))}</link><description>${x(site.description)}</description><language>en</language><atom:link href="${x(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
