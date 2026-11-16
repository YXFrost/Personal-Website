import { getEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import ProgressCard from "@/components/ProgressCard";
import ArchiveFilters, { ArchiveCount, readFilters } from "@/components/ArchiveFilters";
import Link from "next/link";
import HoursChart from "@/components/HoursChart";
import {
  facetCounts,
  filterEntries,
  hoursByMonth,
  subjectTotals,
} from "@/lib/utils.mjs";
export const revalidate = 60;
export const metadata = pageMetadata(
  "Progress",
  "An archive of study, monthly reflections, and learning milestones.",
  "/progress",
);
export default async function ProgressPage({ searchParams }) {
  const active = readFilters(await searchParams);
  const entries = await getEntries("progress");
  const subjectFacets = facetCounts(entries.flatMap((d) => d.subjects || []));
  const filtered = filterEntries(entries, active);
  const filtering = Boolean(active.q || active.tag);
  const months = hoursByMonth(entries);
  const totals = subjectTotals(entries);
  const logged = entries.filter((d) => typeof d.studyHours === "number");
  const total = logged.reduce((sum, d) => sum + d.studyHours, 0);
  const subjects = new Set(entries.flatMap((d) => d.subjects || []));
  const groups = filtered.reduce((groups, d) => {
    const year = (d.month || d.publishedAt || "Undated").slice(0, 4);
    (groups[year] ||= []).push(d);
    return groups;
  }, {});
  return (
    <div className="container archive">
      <header className="page-heading">
        <p className="eyebrow">The learning archive</p>
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
          <div data-reveal="" style={{ "--i": 0 }}>
            <dt>Reflections</dt>
            <dd>{entries.length}</dd>
          </div>
          {logged.length > 0 && (
            <div data-reveal="" style={{ "--i": 1 }}>
              <dt>
                Hours recorded · {logged.length}{" "}
                {logged.length === 1 ? "entry" : "entries"}
              </dt>
              <dd>{total.toLocaleString("en-GB")}</dd>
            </div>
          )}
          {subjects.size > 0 && (
            <div data-reveal="" style={{ "--i": 2 }}>
              <dt>Subjects explored</dt>
              <dd>{subjects.size}</dd>
            </div>
          )}
        </dl>
      )}
      {totals.length > 0 && (
        <div className="subject-totals" data-reveal="">
          <h2>Hours logged alongside each subject</h2>
          <ul>
            {totals.map((t) => (
              <li key={t.subject}>
                <Link href={`/progress?tag=${encodeURIComponent(t.subject)}`}>
                  {t.subject}
                </Link>
                <span>
                  {t.logs} {t.logs === 1 ? "log" : "logs"}
                  {t.hours > 0 && ` · ${t.hours.toLocaleString("en-GB")} h`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <HoursChart months={months} />
      {entries.length > 0 && (
        <ArchiveFilters
          basePath="/progress"
          label="Subjects"
          active={active}
          facets={{ param: "tag", values: subjectFacets, allLabel: "All subjects" }}
          showChips={subjectFacets.length > 1 || entries.length > 6}
          search={
            entries.length > 12 && {
              id: "progress-search",
              label: "Find a log or subject",
              placeholder: "Search titles, summaries, subjects…",
            }
          }
          resultsId="progress-results"
        />
      )}
      {filtering && (
        <ArchiveCount
          count={filtered.length}
          noun={["log", "logs"]}
          active={active}
          basePath="/progress"
        />
      )}
      {entries.length > 0 && !filtered.length && (
        <div className="empty-state" data-reveal="">
          <h2>No logs match.</h2>
          <p>Try another subject or clear the filters.</p>
        </div>
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
        <div className="empty-state" data-reveal="">
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
