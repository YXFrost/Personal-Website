// app/page.js
// ─────────────────────────────────────────────────────────────────
// Homepage: Hero section + dynamic projects grid from Sanity.
// Combined version: Synchronous loading for unified fade-in transitions.
// ─────────────────────────────────────────────────────────────────

import { getAllProjects } from "@/lib/sanity";
import ProjectCard from "@/components/ProjectCard";
import HeroSection from "@/components/HeroSection";

// ── Page Configuration ────────────────────────────────────────────
// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

// ── Metadata ──────────────────────────────────────────────────────
export const metadata = {
  title: "Home",
  description: "Welcome to my portfolio. Explore my projects and work.",
};

// ── Main Page Component ───────────────────────────────────────────
export default async function HomePage() {
  // Fetching data at the top level ensures the page waits to render 
  // everything at once, preserving the "top-to-bottom" animation flow.
  const projects = await getAllProjects();

  return (
    <>
      <HeroSection id="home"/>
      
      <section
        id="projects"
        className="relative px-6 md:px-12 lg:px-20 pb-32"
        aria-labelledby="projects-heading"
      >
        {/* Section Header - Linked to the delay in HeroSection */}
        <div className="mb-12 animate-fade-up delay-400">
          <div className="flex items-center gap-4 mb-3">
            <span className="font-mono text-xs text-amber tracking-widest uppercase">
              02 /
            </span>
            <div className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
          <h2 
            id="projects-heading" 
            className="font-display text-3xl md:text-4xl text-text-primary"
          >
            Projects
          </h2>
        </div>

        {/* Projects Grid or Empty State */}
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Project grid"
          >
            {projects.map((project, index) => (
              <div 
                key={project._id} 
                role="listitem"
                /* We add a stagger delay based on index. 
                   Ensure your globals.css has delays up to 800+ 
                */
                className={`animate-fade-up delay-${(index + 5) * 100}`}
              >
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// ── Empty State Component ─────────────────────────────────────────
function EmptyState() {
  return (
    <div 
      className="col-span-3 flex flex-col items-center justify-center py-24 text-center animate-fade-up delay-500"
      role="status"
      aria-live="polite"
    >
      <div 
        className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-6"
        aria-hidden="true"
      >
        <span className="font-mono text-text-muted text-2xl">∅</span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-2">
        No projects found
      </p>
      <p className="text-xs text-text-muted max-w-xs">
        Add your first project in Sanity Studio and it will appear here
        automatically.
      </p>
    </div>
  );
}