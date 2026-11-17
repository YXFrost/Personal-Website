import NavigationLink from "./NavigationLink";
import ResponsiveImage from "./ResponsiveImage";
import TagList from "./TagList";
import { archiveEntryPath, formatDate } from "@/lib/utils.mjs";
export default function ArticleCard({
  entry,
  featured = false,
  headingLevel = "h3",
  filters,
}) {
  const Heading = headingLevel;
  return (
    <article
      className={`article-card ${featured ? "featured-article" : ""}`}
      data-reveal=""
    >
      {featured && entry.coverImage && (
        <div className="article-preview">
          <ResponsiveImage
            image={entry.coverImage}
            decorative
            sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1280px) 37vw, 475px"
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
          <NavigationLink className="card-title" href={archiveEntryPath(entry, filters)} prefetchOnIntent>
            {entry.title}{" "}
            <span aria-hidden="true">→</span>
          </NavigationLink>
        </Heading>
        <p>{entry.summary}</p>
        <TagList tags={entry.tags} basePath="/writing" label="Tags" />
      </div>
    </article>
  );
}
