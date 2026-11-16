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
  // Number only the sections that render, so the sequence always starts at 01.
  const order = [
    featured.length > 0 && "featured",
    "writing",
    "projects",
    "progress",
  ].filter(Boolean);
  const number = (key) => String(order.indexOf(key) + 1).padStart(2, "0");
  return (
    <>
      <HeroSection />
      <div className="container home-content">
        {featured.length > 0 && (
          <section className="section">
            <SectionHeading number={number("featured")} title="Worth a closer look" />
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
            number={number("writing")}
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
            number={number("projects")}
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
            number={number("progress")}
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
          <p className="eyebrow">A little context</p>
          <h2>
            Following the questions.
            <br />
            <span>Keeping the notes.</span>
          </h2>
          <p>{site.description}</p>
          <Link className="text-link" href="/about">
            More about me <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
