// Offline migration only: reads a Sanity data.ndjson export; never writes to the CMS.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
const [input, mapPath, output] = process.argv.slice(2);
if (!input || !mapPath || !output)
  throw new Error(
    "Usage: node scripts/migrate-content.mjs data.ndjson mapping.json migrated.ndjson",
  );
const destinations = [resolve(output), resolve(join(dirname(output), "legacy-routes.json"))];
if ([input, mapPath].some(path => destinations.includes(resolve(path)))) {
  throw new Error("Output files must not overwrite the source export or mapping.");
}
const docs = readFileSync(input, "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .map(JSON.parse);
const map = JSON.parse(readFileSync(mapPath, "utf8"));
const result = [],
  redirects = [];
for (const { id, type, slug, month } of map) {
  if (!["writing", "progress"].includes(type))
    throw new Error(`Unsupported target type: ${type}`);
  const original = docs.find((d) => d._id === id && d._type === "project");
  if (!original) throw new Error(`Project not found: ${id}`);
  if (id.startsWith("drafts.")) throw new Error("Drafts must be published deliberately in Studio before migration.");
  const targetSlug = slug || original.slug?.current;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(targetSlug || ""))
    throw new Error(`Invalid slug for ${id}`);
  const { _rev, _createdAt, _updatedAt, ...copy } = original;
  const document = {
    ...copy,
    _id: `${type}.${original._id}`,
    _type: type,
    slug: { _type: "slug", current: targetSlug },
    summary: original.summary || original.description,
    body: original.body || original.longDescription || [],
    coverImage: original.coverImage || original.image,
    publishedAt: original.publishedAt || original._createdAt,
    ...(month ? { month } : {}),
  };
  for (const key of [
    "description",
    "longDescription",
    "image",
    "technologies",
    "status",
    "liveUrl",
    "demoUrl",
    "githubUrl",
    "gallery",
  ])
    delete document[key];
  if (
    result.some(
      (d) =>
        d._id === document._id ||
        (d._type === type && d.slug.current === targetSlug),
    )
  )
    throw new Error(`Duplicate mapping for ${id}`);
  result.push(document);
  redirects.push({
    source: `/projects/${original.slug.current}`,
    destination: `/${type}/${targetSlug}`,
  });
}
writeFileSync(output, result.map((d) => JSON.stringify(d)).join("\n") + "\n");
writeFileSync(
  join(dirname(output), "legacy-routes.json"),
  JSON.stringify(redirects, null, 2) + "\n",
);
console.log(
  `Prepared ${result.length} copies and redirects. Originals are unchanged. Review before importing.`,
);
