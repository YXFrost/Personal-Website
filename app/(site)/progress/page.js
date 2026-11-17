import { getEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import ProgressCard from "@/components/ProgressCard";
import ArchiveFilters, { ArchiveCount, readFilters } from "@/components/ArchiveFilters";
import HoursChart from "@/components/HoursChart";
import NavigationLink from "@/components/NavigationLink";
import SectionPage from "@/components/SectionPage";
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
  const active = readFilters(await searchParams, { progress: true });
  const entries = await getEntries("progress");
  const subjectFacets = facetCounts(entries.flatMap((d) => d.subjects || []));
  const filtered = filterEntries(entries, active);
  const showSearch = entries.length > 12 || Boolean(active.q && entries.length);
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
    <SectionPage
      section="progress"
      title="Progress"
      description="Monthly study logs, reflections, and what I’m learning next."
      actions={entries.length > 0 && (
        <a className="text-link masthead-jump" href="#study-logs">
          Jump to study logs <span aria-hidden="true">↓</span>
        </a>
      )}
    >
      {entries.length > 0 && (
        <section aria-labelledby="progress-overview">
          <h2 id="progress-overview" className="overview-title">Archive overview</h2>
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
          {(months.length > 0 || totals.length > 0) && (
            <div className="progress-breakdown">
              <HoursChart months={months} />
              {totals.length > 0 && (
                <div className="subject-totals" data-reveal="">
                  <h3>Study logs by subject</h3>
                  <ul>
                    {totals.map((t) => (
                      <li key={t.subject}>
                        <NavigationLink href={`/progress?tag=${encodeURIComponent(t.subject)}`} prefetchOnIntent>
                          {t.subject}
                        </NavigationLink>
                        <span>{t.logs} {t.logs === 1 ? "log" : "logs"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      )}
      {entries.length > 0 && (
        <>
          <h2 id="study-logs" className="overview-title" tabIndex={-1}>Study logs</h2>
          <ArchiveFilters
            basePath="/progress"
            label="Subjects"
            active={active}
            facets={{ param: "tag", values: subjectFacets, allLabel: "All subjects" }}
            showChips={subjectFacets.length > 1 || entries.length > 6}
            search={
              showSearch && {
                id: "progress-search",
                label: "Find a log or subject",
                placeholder: "Search titles, summaries, subjects…",
              }
            }
            resultsId="progress-results"
          />
        </>
      )}
      {entries.length > 0 && (
        <ArchiveCount
          count={filtered.length}
          noun={["log", "logs"]}
          active={active}
          basePath="/progress"
          searchId={showSearch ? "progress-search" : undefined}
        />
      )}
      <div id="progress-results">
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
                <ProgressCard key={d._id} entry={d} filters={active} />
              ))}
            </section>
          ))}
        {!entries.length && (
          <div className="empty-state" data-reveal="">
            <h2>No study logs yet.</h2>
            <p>
              Monthly logs will bring together study, books, projects,
              difficulties, and next steps.
            </p>
            <NavigationLink className="text-link" href="/writing" prefetchOnIntent>
              Browse writing <span aria-hidden="true">→</span>
            </NavigationLink>
          </div>
        )}
      </div>
    </SectionPage>
  );
}
