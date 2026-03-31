// components/ProjectCard.jsx
// ─────────────────────────────────────────────────────────────────
// Reusable project card for the grid layout.
// Improved with better practices and accessibility
// ─────────────────────────────────────────────────────────────────

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";

/**
 * ProjectCard Component
 * Displays a single project with image, title, description, and tags
 * 
 * @param {Object} props
 * @param {Object} props.project - Sanity project document
 * @param {string} props.project.title - Project title
 * @param {Object} props.project.slug - Project slug object
 * @param {string} props.project.description - Short description
 * @param {Object} props.project.image - Sanity image object
 * @param {string[]} props.project.tags - Array of technology tags
 * @param {number} props.index - Position in grid (for animation stagger)
 */
export default function ProjectCard({ project, index = 0 }) {
  const { title, slug, description, image, tags } = project;

  // Calculate animation delay class based on index
  const delayClasses = [
    '',
    'delay-100',
    'delay-200',
    'delay-300',
    'delay-400',
    'delay-500',
    'delay-600',
    'delay-700',
  ];
  const delayClass = delayClasses[Math.min(index, delayClasses.length - 1)];

  // Build optimized image URL
  const imageUrl = image
    ? urlFor(image)
        .width(800)
        .height(500)
        .fit("crop")
        .auto("format")
        .quality(90)
        .url()
    : null;

  // Ensure slug exists
  const projectSlug = slug?.current ?? "";

  return (
    <Link
      href={`/projects/${projectSlug}`}
      className="group block focus-visible:outline-none"
      aria-label={`View ${title} project details`}
    >
      <article
        className={`
          card-glow
          relative flex flex-col
          bg-card border border-border rounded-sm
          overflow-hidden
          animate-fade-up
          ${delayClass}
        `}
      >
        {/* ── Project Image ────────────────────────────────────────── */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${title} preview`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              priority={index < 3}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-grid">
              <span className="font-mono text-text-muted text-sm" aria-label="No image available">
                No image
              </span>
            </div>
          )}

          {/* Gradient overlay on bottom */}
          <div 
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent"
            aria-hidden="true"
          />

          {/* Hover glow overlay */}
          <div 
            className="absolute inset-0 bg-amber opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"
            aria-hidden="true"
          />
        </div>

        {/* ── Card Content ─────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Title */}
          <h3 className="font-display font-bold text-text-primary text-base leading-snug group-hover:text-amber transition-colors duration-200">
            {title}
          </h3>

          {/* Description */}
          <p className="font-sans text-text-secondary text-sm leading-relaxed flex-1 line-clamp-3">
            {description}
          </p>

          {/* Tags and Arrow */}
          <div className="flex items-end justify-between gap-2 pt-1">
            {/* Technology Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5" role="list" aria-label="Technologies used">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag-pill" role="listitem">
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="tag-pill" aria-label={`${tags.length - 3} more tags`}>
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Arrow indicator */}
            <span 
              className="ml-auto flex-shrink-0 font-mono text-xs text-text-muted group-hover:text-amber group-hover:translate-x-1 transition-all duration-200"
              aria-hidden="true"
            >
              →
            </span>
          </div>
        </div>

        {/* ── Bottom accent line ───────────────────────────────────── */}
        <div 
          className="absolute bottom-0 inset-x-0 h-px bg-amber opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          aria-hidden="true"
        />
      </article>
    </Link>
  );
}