import { getEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import ArticleCard from "@/components/ArticleCard";
import ProjectCard from "@/components/ProjectCard";
import ProgressCard from "@/components/ProgressCard";
import NavigationLink from "@/components/NavigationLink";
export const revalidate = 60;
const homeTitle = `${site.name} — A personal notebook`;
const baseMetadata = pageMetadata(homeTitle, site.description, "/");
// The layout's title.template does not apply to a page in the same segment.
export const metadata = { ...baseMetadata, title: { absolute: homeTitle } };
export default async function HomePage() {
  const [writing, projects, progress] = await Promise.all(
    ["writing", "project", "progress"].map(getEntries),
  );
  const featuredEssay = writing.find((entry) => entry.featured) || writing[0];
  const recentWriting = writing.filter((entry) => entry !== featuredEssay).slice(0, 2);
  const selectedProjects = [...projects]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 2);
  return (
    <>
      <HeroSection lead={writing[0] || projects[0] || progress[0]} />
      <div className="container home-content">
        <section className="section" aria-labelledby="projects">
          <SectionHeading
            id="projects"
            title="Things I’m building"
            href="/projects"
            linkText="All projects"
          />
          {selectedProjects.length ? (
            <div className="project-grid">
              {selectedProjects.map((entry, index) => (
                <ProjectCard key={entry._id} entry={entry} showcase={index === 0} sharedCover />
              ))}
            </div>
          ) : (
            <p className="empty-note" data-reveal="">
              Project notes will appear here as they take shape.
            </p>
          )}
        </section>
        <section className="section" aria-labelledby="writing">
          <SectionHeading
            id="writing"
            title="Writing"
            href="/writing"
            linkText="All writing"
          />
          {featuredEssay ? (
            <>
              <ArticleCard entry={featuredEssay} featured />
              {recentWriting.map((entry) => <ArticleCard key={entry._id} entry={entry} />)}
            </>
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
        <section className="section progress-section" aria-labelledby="study-logs">
          <SectionHeading
            id="study-logs"
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
          <NavigationLink className="text-link" href="/about" prefetchOnIntent>
            More about me <span aria-hidden="true">→</span>
          </NavigationLink>
        </section>
      </div>
    </>
  );
}
