import NavigationLink from "./NavigationLink";
import { archiveEntryPath, formatDate } from "@/lib/utils.mjs";
import TagList from "./TagList";
export default function ProgressCard({ entry, filters }) {
  return (
    <article className="progress-card" data-reveal="">
      <div className="progress-stamp">
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
          <NavigationLink className="card-title" href={archiveEntryPath(entry, filters)} prefetchOnIntent>
            {entry.title} <span aria-hidden="true">→</span>
          </NavigationLink>
        </h3>
        <p>{entry.summary}</p>
        <TagList tags={entry.subjects || []} basePath="/progress" label="Subjects" />
      </div>
    </article>
  );
}
