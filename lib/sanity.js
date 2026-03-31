// lib/sanity.js
// ─────────────────────────────────────────────────────────────────
// Sanity client + image URL builder + GROQ query helpers
// Improved with better error handling and configuration
// ─────────────────────────────────────────────────────────────────

import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from '@sanity/image-url'

// ── Configuration Validation ──────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. " +
    "Please check your .env.local file."
  );
}

// ── Client Configuration ──────────────────────────────────────────
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published", // Only fetch published documents
  stega: {
    enabled: false, // Disable Stega encoding for better performance
  },
});

// ── Image URL Builder ─────────────────────────────────────────────
const builder = createImageUrlBuilder(sanityClient);

/**
 * Returns a Sanity image URL builder for a given source.
 * Usage: urlFor(image).width(800).url()
 * @param {any} source - Sanity image reference
 * @returns {ImageUrlBuilder} Fluent image builder
 */
export function urlFor(source) {
  if (!source) {
    throw new Error("urlFor() requires an image source");
  }
  return builder.image(source);
}

// ── GROQ Queries ──────────────────────────────────────────────────

/**
 * Fetch all projects, sorted by creation date descending.
 * Includes only the fields needed for the project grid.
 * @returns {Promise<Array>} Array of project documents
 */
export async function getAllProjects() {
  try {
    const query = `*[_type == "project"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      description,
      image,
      tags,
      _createdAt
    }`;

    const projects = await sanityClient.fetch(query);
    return projects || [];
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

/**
 * Fetch a single project by its slug.
 * Returns the full document including all fields.
 * @param {string} slug - Project slug
 * @returns {Promise<Object|null>} Project document or null if not found
 */
export async function getProjectBySlug(slug) {
  try {
    const query = `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      longDescription,
      image,
      tags,
      liveUrl,
      githubUrl,
      _createdAt
    }`;

    const project = await sanityClient.fetch(query, { slug });
    return project || null;
  } catch (error) {
    console.error(`Error fetching project with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all project slugs — used by generateStaticParams for static generation.
 * @returns {Promise<Array>} Array of slug objects
 */
export async function getAllProjectSlugs() {
  try {
    const query = `*[_type == "project" && defined(slug.current)] { 
      "slug": slug.current 
    }`;

    const slugs = await sanityClient.fetch(query);
    return slugs || [];
  } catch (error) {
    console.error("Error fetching project slugs:", error);
    return [];
  }
}

/**
 * Helper to check Sanity connection health
 * @returns {Promise<boolean>} True if connection is healthy
 */
export async function checkSanityConnection() {
  try {
    await sanityClient.fetch(`count(*)`);
    return true;
  } catch (error) {
    console.error("Sanity connection check failed:", error);
    return false;
  }
}