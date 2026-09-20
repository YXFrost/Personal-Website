import Link from "next/link";
import ResponsiveImage from "./ResponsiveImage";
import { entryPath } from "@/lib/utils.mjs";
export default function ProjectCard({ entry, headingLevel = "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="project-card">
      <div className="project-preview">
        {entry.coverImage ? (
          <ResponsiveImage
            image={entry.coverImage}
            decorative
            sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1200px) 45vw, 570px"
          />
        ) : (
          <div className="image-placeholder" aria-hidden="true">
            <span>⌘</span>
            <span>Project notebook</span>
          </div>
        )}
      </div>
      <div className="project-card-content">
        <div className="meta">
          <span className="accent">Project</span>
          {entry.status && <span>{entry.status}</span>}
        </div>
        <Heading>
          <Link className="card-title" href={entryPath(entry)}>
            {entry.title}
            <span aria-hidden="true"> ↗</span>
          </Link>
        </Heading>
        <p>{entry.summary}</p>
        <ul className="tags" aria-label="Technologies">
          {entry.technologies.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
