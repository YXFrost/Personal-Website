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
