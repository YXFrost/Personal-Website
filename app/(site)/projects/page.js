import { getEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import ProjectCard from "@/components/ProjectCard";
import ArchiveFilters, { ArchiveCount, readFilters } from "@/components/ArchiveFilters";
import { facetCounts, filterEntries } from "@/lib/utils.mjs";
export const revalidate = 60;
export const metadata = pageMetadata(
  "Projects",
  "Things I build, with notes on the process, decisions, and lessons along the way.",
  "/projects",
);
export default async function ProjectsPage({ searchParams }) {
  const active = readFilters(await searchParams);
  const entries = await getEntries("project");
  const statuses = facetCounts(entries.map((d) => d.status));
  const filtered = filterEntries(entries, { ...active, categoryField: "status" });
  return (
    <div className="container archive">
      <header className="page-heading">
        <p className="eyebrow">The workbench</p>
        <h1>
          Projects<span>.</span>
        </h1>
        <p>
          Ideas made tangible.
          <br />
          The process matters as much as the result.
        </p>
      </header>
      <ArchiveFilters
        basePath="/projects"
        label="Project status"
        active={active}
        facets={{ param: "category", values: statuses, allLabel: "All projects" }}
        showChips={statuses.length > 1 || entries.length > 6}
        search={
          entries.length > 6 && {
            id: "projects-search",
            label: "Find a project or technology",
            placeholder: "Search titles, summaries, technologies…",
          }
        }
        resultsId="projects-results"
      />
      <ArchiveCount
        count={filtered.length}
        noun={["project", "projects"]}
        active={active}
        basePath="/projects"
      />
      <div id="projects-results" className="archive-results project-grid">
        {filtered.map((d) => (
          <ProjectCard headingLevel="h2" key={d._id} entry={d} />
        ))}
      </div>
      {entries.length > 0 && !filtered.length && (
        <div className="empty-state" data-reveal="">
          <h2>No matching projects.</h2>
          <p>Try another technology or clear the filters.</p>
        </div>
      )}
      {!entries.length && (
        <div className="empty-state" data-reveal="">
          <h2>Work in progress.</h2>
          <p>
            Projects will appear here with their context, process, and lessons.
          </p>
        </div>
      )}
    </div>
  );
}
