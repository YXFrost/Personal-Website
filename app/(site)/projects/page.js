import { getEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import ProjectCard from "@/components/ProjectCard";
import SectionPage from "@/components/SectionPage";
import ArchiveFilters, { ArchiveCount, readFilters } from "@/components/ArchiveFilters";
import { facetCounts, filterEntries } from "@/lib/utils.mjs";
import Link from "next/link";
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
  const showSearch = entries.length > 6 || Boolean(active.q && entries.length);
  const browsing = !active.q && !active.category && !active.tag;
  return (
    <SectionPage
      section="projects"
      title="Projects"
      description="Things I build, with notes on the decisions, setbacks, and results."
    >
      <ArchiveFilters
        basePath="/projects"
        label="Project status"
        active={active}
        facets={{ param: "category", values: statuses, allLabel: "All projects" }}
        showChips={statuses.length > 1 || entries.length > 6}
        search={
          showSearch && {
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
        searchId={showSearch ? "projects-search" : undefined}
      />
      <div id="projects-results" className="archive-results project-grid">
        {filtered.map((d, index) => (
          <ProjectCard
            headingLevel="h2"
            key={d._id}
            entry={d}
            filters={active}
            leading={index === 0}
            showcase={browsing && index === 0 && Boolean(d.coverImage)}
            sharedCover
          />
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
          <Link className="text-link" href="/writing">Browse writing <span aria-hidden="true">→</span></Link>
        </div>
      )}
    </SectionPage>
  );
}
