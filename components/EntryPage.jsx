import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry, getEntries } from "@/lib/content";
import { site, absoluteUrl, preview } from "@/lib/site";
import { entryPath, formatDate, safeUrl, jsonLd } from "@/lib/utils.mjs";
import ArticleRenderer, { getHeadings } from "./ArticleRenderer";
import ResponsiveImage from "./ResponsiveImage";
import ArticleCard from "./ArticleCard";
import { imageInfo } from "@/lib/images";
const labels = {
  writing: "Writing",
  project: "Projects",
  progress: "Progress",
};
const sections = [
  "milestones",
  "highlights",
  "difficulties",
  "reflections",
  "nextSteps",
];
const sectionLabels = {
  milestones: "Milestones",
  highlights: "Highlights",
  difficulties: "Difficulties",
  reflections: "Reflections",
  nextSteps: "Next steps",
};
export default async function EntryPage({ type, slug }) {
  const entry = await getEntry(type, slug);
  if (!entry) notFound();
  const headings = getHeadings(entry.body);
  const toc = headings.length >= 4;
  const related =
    type === "writing"
      ? (await getEntries("writing"))
          .filter(
            (d) =>
              d.slug !== slug &&
              (d.category === entry.category ||
                d.tags.some((t) => entry.tags.includes(t))),
          )
          .slice(0, 2)
      : [];
  const data = {
    "@context": "https://schema.org",
    "@type": type === "writing" ? "BlogPosting" : "CreativeWork",
    name: entry.title,
    headline: entry.title,
    description: entry.summary,
    url: absoluteUrl(entryPath(entry)),
    author: { "@type": "Person", name: site.name },
    ...(entry.publishedAt ? { datePublished: entry.publishedAt } : {}),
    ...(entry.updatedAt ? { dateModified: entry.updatedAt } : {}),
  };
  const cover = imageInfo(entry.coverImage);
  if (cover) data.image = absoluteUrl(cover.src);
  return (
    <div className="container entry-page">
      {!preview && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
        />
      )}
      <Link
        className="back-link"
        href={type === "project" ? "/projects" : `/${type}`}
      >
        ← All {labels[type].toLowerCase()}
      </Link>
      <article>
        <header className="entry-header">
          <p className="eyebrow">
            {entry.category || labels[type]}
            {entry.status ? ` / ${entry.status}` : ""}
          </p>
          <h1>{entry.title}</h1>
          <p className="entry-summary">{entry.summary}</p>
          <div className="meta">
            {entry.publishedAt && (
              <time dateTime={entry.publishedAt}>
                {formatDate(entry.publishedAt)}
              </time>
            )}
            {type === "writing" && <span>{entry.readingTime} min read</span>}
            {entry.updatedAt && (
              <span>Updated {formatDate(entry.updatedAt)}</span>
            )}
          </div>
          <ul
            className="tags"
            aria-label={type === "project" ? "Technologies" : "Tags"}
          >
            {(type === "project" ? entry.technologies : entry.tags).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {type === "project" && (
            <div className="actions">
              {safeUrl(entry.githubUrl) && (
                <a className="button secondary" href={entry.githubUrl}>
                  Source on GitHub ↗
                </a>
              )}
              {safeUrl(entry.demoUrl) && (
                <a className="button secondary" href={entry.demoUrl}>
                  Open project ↗
                </a>
              )}
            </div>
          )}
        </header>
        {entry.coverImage && (
          <figure
            className={`entry-cover ${type === "project" ? "screenshot" : ""}`}
          >
            <ResponsiveImage
              image={entry.coverImage}
              zoomable={type === "project"}
              priority
              sizes="(max-width: 1024px) calc(100vw - 40px), 1000px"
            />
            {entry.coverImage.caption && (
              <figcaption>{entry.coverImage.caption}</figcaption>
            )}
          </figure>
        )}
        <div className={`reading-layout ${toc ? "has-toc" : ""}`}>
          {toc && (
            <aside className="toc">
              <nav aria-label="On this page">
                <h2>On this page</h2>
                <ol>
                  {headings.map((h) => (
                    <li
                      key={h.id}
                      className={h.level === "h3" ? "toc-nested" : ""}
                    >
                      <a href={`#${h.id}`}>{h.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}
          <div className="reading-body">
            {type === "progress" && (
              <div className="progress-facts">
                {typeof entry.studyHours === "number" && (
                  <div>
                    <strong>{entry.studyHours}</strong>
                    <span>Hours studied</span>
                  </div>
                )}
                {entry.subjects?.length > 0 && (
                  <div>
                    <strong>{entry.subjects.join(" · ")}</strong>
                    <span>Subjects</span>
                  </div>
                )}
              </div>
            )}
            <ArticleRenderer body={entry.body} />
            {type === "progress" &&
              sections.map(
                (key) =>
                  entry[key]?.length > 0 && (
                    <section className="prose" key={key}>
                      <h2>{sectionLabels[key]}</h2>
                      {Array.isArray(entry[key]) ? (
                        <ul>
                          {entry[key].map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{entry[key]}</p>
                      )}
                    </section>
                  ),
              )}
            {entry.gallery?.length > 0 && (
              <section className="gallery">
                <h2>In detail</h2>
                {entry.gallery.map((img, i) => {
                  const info = imageInfo(img);
                  return (
                    info && (
                      <figure key={img._key || i}>
                        <ResponsiveImage image={img} zoomable />
                        <figcaption>
                          {img.caption && <span>{img.caption} · </span>}
                          <a href={info.src} target="_blank" rel="noreferrer">
                            View image {i + 1} larger{" "}
                            <span className="sr-only">
                              (opens in a new tab)
                            </span>
                            ↗
                          </a>
                        </figcaption>
                      </figure>
                    )
                  );
                })}
              </section>
            )}
            {entry.references?.length > 0 && (
              <section className="prose references">
                <h2>References & further reading</h2>
                <ol>
                  {entry.references.map((r, i) => (
                    <li key={r._key || i}>
                      {safeUrl(r.url) ? <a href={r.url}>{r.title}</a> : r.title}
                      {r.note && <span> — {r.note}</span>}
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <div className="article-end">
              <span aria-hidden="true">■</span>
              <Link href={type === "project" ? "/projects" : `/${type}`}>
                Back to {labels[type].toLowerCase()} →
              </Link>
            </div>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="section related">
          <h2>Keep exploring</h2>
          {related.map((d) => (
            <ArticleCard key={d._id} entry={d} />
          ))}
        </section>
      )}
    </div>
  );
}
