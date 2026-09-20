import Link from "next/link";
import { entryPath, formatDate } from "@/lib/utils.mjs";
export default function ProgressCard({ entry }) {
  return (
    <article className="progress-card">
      <div className="progress-stamp">
        <span className="eyebrow">Field notes</span>
        <span>{formatDate(entry.month || entry.publishedAt, true)}</span>
        {typeof entry.studyHours === "number" && (
          <strong>
            {entry.studyHours}
            <small> hours studied</small>
          </strong>
        )}
      </div>
      <div>
        <h3>
          <Link className="card-title" href={entryPath(entry)}>
            {entry.title} <span aria-hidden="true">→</span>
          </Link>
        </h3>
        <p>{entry.summary}</p>
        <ul className="tags" aria-label="Subjects">
          {(entry.subjects || []).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
