import { cache } from "react";
import { sanityClient } from "./sanity";
import { entryPath, normalize, isPublished, readingTime, routes } from "./utils.mjs";
import { preview } from "./site";
import writing from "@/content/writing.json";
import projects from "@/content/projects.json";
import progress from "@/content/progress.json";
import fixtures from "@/content/preview.json";
import legacyRoutes from "@/content/legacy-routes.json";

const local = { writing, project: projects, progress };
const summaryFields = '_id, _type, title, slug, summary, description, category, tags, technologies, status, featured, published, publishedAt, updatedAt, _createdAt, month, date, studyHours, subjects, coverImage, image, seo';
const detailFields = summaryFields + ', milestones, highlights, difficulties, reflections, nextSteps, body, longDescription, gallery, githubUrl, demoUrl, liveUrl, references';
const publicationFilter = '!(_id in path("drafts.**")) && published != false && (!defined(publishedAt) || publishedAt <= now())';

function legacyEntries(type) {
  return legacyRoutes.filter((route) =>
    route.documentId && route.destination.startsWith(routes[type] + "/"),
  );
}

function normalizeEntry(doc, type, moves) {
  const entry = normalize(doc);
  const move = moves.find((route) => route.documentId === entry._id && doc._type === "project");
  if (!move) return entry;

  const body = move.images ? entry.body.map((block) => {
    const description = block._type === "image" && move.images[block._key];
    return description
      ? { ...block, alt: block.alt || description.alt, caption: block.caption || description.caption }
      : block;
  }) : entry.body;
  return {
    ...entry,
    _type: type,
    slug: move.destination.split("/").at(-1),
    summary: doc.summary || move.summary || entry.summary,
    category: move.category || entry.category,
    month: move.month || entry.month,
    subjects: move.subjects || entry.subjects,
    coverImage: move.coverAlt && entry.coverImage
      ? { ...entry.coverImage, alt: entry.coverImage.alt || move.coverAlt }
      : entry.coverImage,
    body,
  };
}

function visibleEntries(docs, type, moves) {
  const entries = new Map();
  for (const doc of docs) {
    const entry = normalizeEntry(doc, type, moves);
    if (!entry.slug || entry._type !== type || !isPublished(entry)) continue;
    if (type === "project" && legacyRoutes.some(({ source, documentId }) =>
      source === entryPath(entry) && (!documentId || documentId === entry._id),
    )) continue;
    if (!entries.has(entry.slug) || doc._type === type) entries.set(entry.slug, entry);
  }
  return [...entries.values()].sort((a, b) => {
    const date = (entry) => type === "progress" ? entry.month || entry.publishedAt : entry.publishedAt;
    return (date(b) || "").localeCompare(date(a) || "");
  });
}

function sourceOptions(type) {
  return { next: { revalidate: 60, tags: ["content", type] } };
}

export const getEntries = cache(async (type) => {
  if (preview || !sanityClient) {
    const docs = preview ? [...local[type], ...fixtures.filter((d) => d._type === type)] : local[type];
    return visibleEntries(docs, type, []);
  }
  const moves = legacyEntries(type);
  // Reading estimates only need text and code. Keep images and other body fields on the detail query.
  const readingBlocks = type === "writing" ? ', "_readingBlocks": coalesce(body, longDescription)[]{children[]{text,latex},code}' : "";
  const docs = await sanityClient.fetch(
    '*[(_type == $type || (_type == "project" && _id in $moved)) && ' +
      publicationFilter + '] {' + summaryFields + readingBlocks + '}',
    { type, moved: moves.map((move) => move.documentId) },
    sourceOptions(type),
  );
  const available = type === "project" ? [...projects, ...docs] : docs;
  return visibleEntries(available, type, moves).map(({ _readingBlocks, ...entry }) => ({
    ...entry,
    readingTime: _readingBlocks ? readingTime(_readingBlocks) : entry.readingTime,
  }));
});

export const getEntry = cache(async (type, slug) => {
  if (preview || !sanityClient) return (await getEntries(type)).find((entry) => entry.slug === slug);
  const moves = legacyEntries(type).filter((move) => move.destination === routes[type] + "/" + slug);
  const docs = await sanityClient.fetch(
    '*[((_type == $type && (slug.current == $slug || slug == $slug)) || (_type == "project" && _id in $moved)) && ' +
      publicationFilter + '] {' + detailFields + '}',
    { type, slug, moved: moves.map((move) => move.documentId) },
    sourceOptions(type),
  );
  return visibleEntries(docs, type, moves)[0] ||
    (type === "project" ? visibleEntries(projects, type, []).find((entry) => entry.slug === slug) : undefined);
});

export async function getAllEntries() {
  return (await Promise.all(["writing", "project", "progress"].map(getEntries))).flat();
}
