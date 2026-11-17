import NavigationLink from "./NavigationLink";
import { ViewTransition } from "react";
import ResponsiveImage from "./ResponsiveImage";
import TagList from "./TagList";
import { archiveEntryPath } from "@/lib/utils.mjs";
export default function ProjectCard({ entry, headingLevel = "h3", filters, leading = false, sharedCover = false, showcase = false }) {
  const Heading = headingLevel;
  const cover = entry.coverImage && (
    <ResponsiveImage
      image={entry.coverImage}
      decorative
      eager={leading}
      sizes={showcase
        ? "(max-width: 768px) calc(90vw - 64px), (max-width: 1280px) 49vw, 610px"
        : "(max-width: 768px) calc(100vw - 40px), (max-width: 1200px) 45vw, 570px"}
    />
  );
  const preview = (
    <div className="project-preview">
      {cover ? (
        showcase ? <div className="project-artwork">{cover}</div> : cover
      ) : (
        <div className="image-placeholder" aria-hidden="true">
          <span>⌘</span>
          <span>Project notebook</span>
        </div>
      )}
    </div>
  );
  return (
    <article className={showcase ? "project-card project-showcase" : "project-card"} data-reveal="">
      {sharedCover && entry.coverImage ? (
        <ViewTransition name={`project-cover-${entry.slug}`} share="cover-morph" default="none">
          {preview}
        </ViewTransition>
      ) : preview}
      <div className="project-card-content">
        <div className="meta">
          <span className="accent">Project</span>
          {entry.status && <span>{entry.status}</span>}
        </div>
        <Heading>
          <NavigationLink className="card-title" href={archiveEntryPath(entry, filters)} prefetchOnIntent>
            {entry.title}{" "}
            <span aria-hidden="true">→</span>
          </NavigationLink>
        </Heading>
        <p>{entry.summary}</p>
        <TagList tags={entry.technologies} basePath="/projects" label="Technologies" />
      </div>
    </article>
  );
}
