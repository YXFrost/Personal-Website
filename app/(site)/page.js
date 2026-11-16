import Link from "next/link";
import { getEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import ArticleCard from "@/components/ArticleCard";
import ProjectCard from "@/components/ProjectCard";
import ProgressCard from "@/components/ProgressCard";
export const revalidate = 60;
const homeTitle = `${site.name} — A personal notebook`;
const baseMetadata = pageMetadata(homeTitle, site.description, "/");
// The layout's title.template does not apply to a page in the same segment.
export const metadata = { ...baseMetadata, title: { absolute: homeTitle } };
export default async function HomePage() {
  const [writing, projects, progress] = await Promise.all(
    ["writing", "project", "progress"].map(getEntries),
  );
  const featured = [...writing, ...projects]
    .filter((d) => d.featured)
    .slice(0, 2);
  return (
    <>
      <HeroSection lead={writing[0] || projects[0] || progress[0]} />
      <div className="container home-content">
        {featured.length > 0 && (
          <section className="section">
            <SectionHeading title="Featured" />
            <div className="featured-grid">
              {featured.map((d) =>
                d._type === "writing" ? (
                  <ArticleCard key={d._id} entry={d} featured />
                ) : (
                  <ProjectCard key={d._id} entry={d} />
                ),
              )}
            </div>
          </section>
        )}
        <section className="section" id="writing">
          <SectionHeading
            title="Recent writing"
            href="/writing"
            linkText="All writing"
          />
          {writing.length ? (
            writing
              .slice(0, 3)
              .map((d) => <ArticleCard key={d._id} entry={d} />)
          ) : (
            <div className="empty-note" data-reveal="">
              <p>Room for longer thoughts.</p>
              <span>
                Essays and notes on books, science, and the ideas that connect
                them. The first entries are still to come.
              </span>
            </div>
          )}
        </section>
        <section className="section" id="projects">
          <SectionHeading
            title="Things I’m building"
            href="/projects"
            linkText="All projects"
          />
          <div className="project-grid">
            {[...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
              .slice(0, 2)
              .map((d) => (
                <ProjectCard key={d._id} entry={d} />
              ))}
          </div>
          {!projects.length && (
            <p className="empty-note" data-reveal="">
              Project notes will appear here as they take shape.{" "}
              <Link href="/projects">Explore the archive →</Link>
            </p>
          )}
        </section>
        <section className="section progress-section">
          <SectionHeading
            title="Learning, in progress"
            href="/progress"
            linkText="The archive"
          />
          <p className="section-intro">
            What I studied, what clicked, and what I’m still figuring out.
          </p>
          {progress.length ? (
            progress
              .slice(0, 2)
              .map((d) => <ProgressCard key={d._id} entry={d} />)
          ) : (
            <div className="empty-note" data-reveal="">
              <p>A record of the work between milestones.</p>
              <span>Monthly reflections and study notes will live here.</span>
            </div>
          )}
        </section>
        <section className="section about-strip" data-reveal="">
          <h2>About the notebook</h2>
          <Link className="text-link" href="/about">
            More about me <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
