import { getEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import ProjectCard from "@/components/ProjectCard";
export const revalidate = 60;
export const metadata = pageMetadata(
  "Projects",
  "Things I build, with notes on the process, decisions, and lessons along the way.",
  "/projects",
);
export default async function ProjectsPage() {
  const entries = await getEntries("project");
  return (
    <div className="container archive">
      <header className="page-heading">
        <p className="eyebrow">02 / The workbench</p>
        <h1>
          Projects<span>.</span>
        </h1>
        <p>
          Ideas made tangible.
          <br />
          The process matters as much as the result.
        </p>
      </header>
      <div className="archive-count">
        {entries.length} {entries.length === 1 ? "project" : "projects"}
      </div>
      <div className="project-grid">
        {entries.map((d) => (
          <ProjectCard headingLevel="h2" key={d._id} entry={d} />
        ))}
      </div>
      {!entries.length && (
        <div className="empty-state">
          <h2>Work in progress.</h2>
          <p>
            Projects will appear here with their context, process, and lessons.
          </p>
        </div>
      )}
    </div>
  );
}
