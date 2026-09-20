import Link from "next/link";
import ResponsiveImage from "./ResponsiveImage";
import { entryPath, formatDate } from "@/lib/utils.mjs";
export default function ArticleCard({
  entry,
  featured = false,
  headingLevel = "h3",
}) {
  const Heading = headingLevel;
  return (
    <article className={`article-card ${featured ? "featured-article" : ""}`}>
      {featured && entry.coverImage && (
        <div className="article-preview">
          <ResponsiveImage
            image={entry.coverImage}
            decorative
            sizes="(max-width: 768px) calc(100vw - 40px), 560px"
          />
        </div>
      )}
      <div className="article-card-content">
        <div className="meta">
          <span className="accent">{entry.category || "Essay"}</span>
          {entry.publishedAt && (
            <time dateTime={entry.publishedAt}>
              {formatDate(entry.publishedAt)}
            </time>
          )}
          <span>{entry.readingTime} min read</span>
        </div>
        <Heading>
          <Link className="card-title" href={entryPath(entry)}>
            {entry.title}
            <span aria-hidden="true"> ↗</span>
          </Link>
        </Heading>
        <p>{entry.summary}</p>
        <ul className="tags" aria-label="Tags">
          {entry.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
