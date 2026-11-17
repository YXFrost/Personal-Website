export const routes = {
  writing: "/writing",
  project: "/projects",
  progress: "/progress",
};
export function textOf(block) {
  return (block?.children || [])
    .map((child) => child.text || child.latex || "")
    .join("");
}
export function headingId(block) {
  return `section-${
    block._key ||
    textOf(block)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
  }`;
}
// Legacy documents use h1 for sections; the renderer outputs them as <h2>, so list them as h2.
export function getHeadings(body = []) {
  return body
    .filter((b) => b._type === "block" && ["h1", "h2", "h3"].includes(b.style))
    .map((b) => ({
      id: headingId(b),
      title: textOf(b),
      level: b.style === "h1" ? "h2" : b.style,
    }));
}
// The labels an entry is filed under: tags for writing, technologies for projects,
// subjects and tags for progress logs.
export function entryTags(doc) {
  if (doc?._type === "project") return doc.technologies || [];
  if (doc?._type === "progress")
    return [...new Set([...(doc.subjects || []), ...(doc.tags || [])])];
  return doc?.tags || [];
}
export function filterEntries(
  entries,
  { q = "", category = "", tag = "", month = "", categoryField = "category" } = {},
) {
  const needle = q.trim().toLowerCase();
  const wanted = tag.trim().toLowerCase();
  return entries.filter((d) => {
    const tags = entryTags(d);
    return (
      (!category || d[categoryField] === category) &&
      (!month || (d.month || d.publishedAt || "").slice(0, 7) === month) &&
      (!wanted || tags.some((t) => t.toLowerCase() === wanted)) &&
      (!needle ||
        `${d.title} ${d.summary} ${tags.join(" ")}`
          .toLowerCase()
          .includes(needle))
    );
  });
}
// [{ value, count }] for the given values, most used first, then alphabetical.
export function facetCounts(values) {
  const counts = new Map();
  for (const v of values) if (v) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}
// Neighbours in a newest-first list.
export function adjacentEntries(list, slug) {
  const i = list.findIndex((d) => d.slug === slug);
  if (i < 0) return { newer: null, older: null };
  return { newer: list[i - 1] || null, older: list[i + 1] || null };
}
// The last `span` months up to the newest log, oldest first. Months without a log are
// empty slots. Returns [] unless at least two logs record hours.
export function hoursByMonth(entries, span = 12) {
  const logs = entries.filter(
    (d) => typeof d.studyHours === "number" && (d.month || d.publishedAt),
  );
  if (logs.length < 2) return [];
  const byMonth = new Map();
  for (const d of logs) {
    const key = (d.month || d.publishedAt).slice(0, 7);
    const slot = byMonth.get(key) || { hours: 0, entries: [] };
    slot.hours += d.studyHours;
    slot.entries.push(d);
    byMonth.set(key, slot);
  }
  const latest = [...byMonth.keys()].sort().at(-1);
  const [year, month] = latest.split("-").map(Number);
  const months = [];
  for (let i = span - 1; i >= 0; i--) {
    const date = new Date(Date.UTC(year, month - 1 - i, 1));
    const key = date.toISOString().slice(0, 7);
    const slot = byMonth.get(key);
    months.push({
      key,
      label: formatDate(date.toISOString(), true),
      initial: new Intl.DateTimeFormat("en-GB", { month: "narrow", timeZone: "UTC" }).format(date),
      hours: slot ? slot.hours : null,
      entries: slot?.entries ?? [],
    });
  }
  return months;
}
export function subjectTotals(entries, limit = 6) {
  const totals = new Map();
  for (const d of entries)
    for (const s of new Set(d.subjects || [])) {
      const t = totals.get(s) || { subject: s, logs: 0 };
      t.logs += 1;
      totals.set(s, t);
    }
  return [...totals.values()]
    .sort((a, b) => b.logs - a.logs || a.subject.localeCompare(b.subject))
    .slice(0, limit);
}
export function isIndexable(doc) {
  return !doc?.seo?.noindex;
}
export function readingTime(body = []) {
  const text = body.map((b) => textOf(b) || b.code || "").join(" ");
  return Math.max(
    1,
    Math.ceil(text.trim().split(/\s+/u).filter(Boolean).length / 220),
  );
}
export function safeUrl(value, { mail = false, relative = false } = {}) {
  if (typeof value !== "string" || /[\u0000-\u0020\\]/.test(value))
    return undefined;
  if (relative && (/^\/(?!\/)/.test(value) || value.startsWith("#")))
    return value;
  try {
    const u = new URL(value);
    return ["https:", "http:", ...(mail ? ["mailto:"] : [])].includes(
      u.protocol,
    )
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}
export function formatDate(date, monthOnly = false) {
  if (!date || Number.isNaN(new Date(date).getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    ...(monthOnly ? {} : { day: "numeric" }),
    timeZone: "UTC",
  }).format(new Date(date));
}
export function normalize(doc) {
  const body = doc.body || doc.longDescription || [];
  return {
    ...doc,
    slug: typeof doc.slug === "string" ? doc.slug : doc.slug?.current,
    summary: doc.summary || doc.description || "",
    body,
    coverImage: doc.coverImage || doc.image,
    technologies: doc.technologies || doc.tags || [],
    tags: doc.tags || [],
    publishedAt: doc.publishedAt || doc.date || doc.month || doc._createdAt,
    demoUrl: doc.demoUrl || doc.liveUrl,
    readingTime: readingTime(body),
  };
}
export function isPublished(doc, now = Date.now()) {
  return (
    !doc._id?.startsWith("drafts.") &&
    doc.published !== false &&
    (!doc.publishedAt || new Date(doc.publishedAt).getTime() <= now)
  );
}
export function entryPath(doc) {
  return `${routes[doc._type]}/${doc.slug}`;
}
export function archiveUrl(basePath, params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) if (value) query.set(key, value);
  return query.size ? `${basePath}?${query}` : basePath;
}
export function archiveEntryPath(entry, filters) {
  const query = archiveUrl("", filters).slice(1);
  const path = entryPath(entry);
  return query ? `${path}?${new URLSearchParams({ filters: query })}` : path;
}
export function escapeXml(value = "") {
  return String(value).replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
}
export function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
