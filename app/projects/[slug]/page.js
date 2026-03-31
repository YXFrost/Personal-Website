import { getProjectBySlug, urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
// ✅ IMPORT THE COMPONENTS WE CREATED EARLIER
import ZoomableImage from "@/components/ZoomableImage";
import { RichTextComponents } from "@/components/RichTextComponents";

export default async function ProjectDetailPage({ params }) {
  // 1. Await params (Required for Next.js 15/16)
  const { slug } = await params; 
  const project = await getProjectBySlug(slug);

  // 2. If the project doesn't exist in Sanity, show the custom 404 page
  if (!project) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-32">
      {/* Back Button */}
      <Link 
        href="/" 
        className="font-mono text-sm text-text-secondary hover:text-amber transition-colors mb-12 inline-block"
      >
        ← Back to Home
      </Link>
      
      {/* Project Title */}
      <h1 className="text-4xl md:text-5xl font-display text-text-primary mb-6">
        {project.title}
      </h1>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-12">
        {project.tags?.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>

      {/* Cover Image */}
      {project.image && (
        <div className="relative w-full aspect-video mb-12 rounded-lg overflow-hidden border border-border">
          <ZoomableImage
            src={urlFor(project.image).url()}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Long Description (Rich Text) */}
      <div className="prose-dark max-w-none mb-12">
        {project.longDescription ? (
          <PortableText
            value={project.longDescription}
            components={RichTextComponents} // ✅ Matches the import above
          />
        ) : (
          <p className="text-text-secondary">{project.description}</p>
        )}
      </div>

      {/* Links (Live URL / GitHub) */}
      {(project.liveUrl || project.githubUrl) && (
        <div className="flex flex-wrap gap-4 pt-8 border-t border-border">
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border border-amber text-amber px-6 py-3 font-mono text-sm hover:bg-amber hover:text-void transition-colors"
            >
              View Live Demo ↗
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border border-border text-text-primary px-6 py-3 font-mono text-sm hover:border-text-primary transition-colors"
            >
              View Source Code
            </a>
          )}
        </div>
      )}
    </main>
  );
}