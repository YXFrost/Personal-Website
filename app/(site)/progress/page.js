import { getEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import ProgressCard from "@/components/ProgressCard";
export const revalidate = 60;
export const metadata = pageMetadata(
  "Progress",
  "An archive of study, monthly reflections, and learning milestones.",
  "/progress",
);
export default async function ProgressPage() {
  const entries = await getEntries("progress");
  const logged = entries.filter((d) => typeof d.studyHours === "number");
  const total = logged.reduce((sum, d) => sum + d.studyHours, 0);
  const subjects = new Set(entries.flatMap((d) => d.subjects || []));
  const groups = entries.reduce((groups, d) => {
    const year = (d.month || d.publishedAt || "Undated").slice(0, 4);
    (groups[year] ||= []).push(d);
    return groups;
  }, {});
  return (
    <div className="container archive">
      <header className="page-heading">
        <p className="eyebrow">03 / The learning archive</p>
        <h1>
          Progress<span>.</span>
        </h1>
        <p>
          The work between milestones.
          <br />
          Study notes, small discoveries, and honest retrospectives.
        </p>
      </header>
      {entries.length > 0 && (
        <dl className="stats">
          <div>
            <dt>Reflections</dt>
            <dd>{entries.length}</dd>
          </div>
          {logged.length > 0 && (
            <div>
              <dt>
                Hours recorded · {logged.length}{" "}
                {logged.length === 1 ? "entry" : "entries"}
              </dt>
              <dd>{total.toLocaleString("en-GB")}</dd>
            </div>
          )}
          {subjects.size > 0 && (
            <div>
              <dt>Subjects explored</dt>
              <dd>{subjects.size}</dd>
            </div>
          )}
        </dl>
      )}
      {Object.entries(groups)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([year, docs]) => (
          <section className="progress-year" key={year}>
            <h2>{year}</h2>
            {docs.map((d) => (
              <ProgressCard key={d._id} entry={d} />
            ))}
          </section>
        ))}
      {!entries.length && (
        <div className="empty-state">
          <p className="eyebrow">No numbers for their own sake</p>
          <h2>Making room to reflect.</h2>
          <p>
            Monthly logs will bring together study, books, projects,
            difficulties, and next steps.
          </p>
        </div>
      )}
    </div>
  );
}
