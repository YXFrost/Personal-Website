import { cache } from "react";
import { sanityClient } from "./sanity";
import { normalize, isPublished } from "./utils.mjs";
import { preview } from "./site";
import writing from "@/content/writing.json";
import projects from "@/content/projects.json";
import progress from "@/content/progress.json";
import fixtures from "@/content/preview.json";
import legacyRoutes from "@/content/legacy-routes.json";
const local = { writing, project: projects, progress };
const fields = `_id, _type, title, slug, summary, description, category, tags, technologies,
  status, featured, published, publishedAt, updatedAt, _createdAt, month, date, studyHours, subjects,
  milestones, highlights, difficulties, reflections, nextSteps, coverImage, image, body, longDescription,
  gallery, githubUrl, demoUrl, liveUrl, references, seo`;
export const getEntries = cache(async (type) => {
  let docs;
  if (preview)
    docs = [...local[type], ...fixtures.filter((d) => d._type === type)];
  else if (sanityClient)
    docs = await sanityClient.fetch(
      `*[_type == $type && !(_id in path("drafts.**")) && published != false && (!defined(publishedAt) || publishedAt <= now())] | order(publishedAt desc, _createdAt desc) {${fields}}`,
      { type },
      { next: { revalidate: 60, tags: ["content", type] } },
    );
  else docs = local[type];
  return docs
    .map(normalize)
    .filter(
      (d) =>
        d.slug &&
        isPublished(d) &&
        !(
          type === "project" &&
          legacyRoutes.some((r) => r.source === `/projects/${d.slug}`)
        ),
    )
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
});
export const getEntry = cache(async (type, slug) =>
  (await getEntries(type)).find((d) => d.slug === slug),
);
export async function getAllEntries() {
  return (
    await Promise.all(["writing", "project", "progress"].map(getEntries))
  ).flat();
}
