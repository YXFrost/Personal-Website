import Link from "next/link";
import Form from "next/form";
import SearchSubmit from "./SearchSubmit";
function archiveUrl(basePath, params) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) p.set(k, v);
  return `${basePath}${p.size ? `?${p}` : ""}`;
}
// Search box and filter chips shared by the Writing, Projects and Progress archives.
// active: { q, category, tag }. facets: { param, values: [{ value, count }], allLabel }.
export default function ArchiveFilters({
  basePath,
  label,
  active,
  facets,
  search,
  showChips,
  resultsId,
}) {
  const { param, values = [], allLabel = "All" } = facets || {};
  return (
    <>
      {search && (
        <Form action={basePath} className="search-form" role="search">
          <label htmlFor={search.id}>{search.label}</label>
          <div>
            <input
              id={search.id}
              name="q"
              type="search"
              defaultValue={active.q}
              placeholder={search.placeholder}
              maxLength={150}
            />
            {active.category && (
              <input name="category" type="hidden" value={active.category} />
            )}
            {active.tag && <input name="tag" type="hidden" value={active.tag} />}
            <SearchSubmit results={resultsId} />
          </div>
        </Form>
      )}
      {showChips && values.length > 0 && (
        <nav className="filters" aria-label={label}>
          <Link
            href={archiveUrl(basePath, { ...active, [param]: "" })}
            aria-current={!active[param] ? "page" : undefined}
          >
            {allLabel}
          </Link>
          {values.map(({ value }) => (
            <Link
              key={value}
              href={archiveUrl(basePath, { ...active, [param]: value })}
              aria-current={active[param] === value ? "page" : undefined}
            >
              {value}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
export function ArchiveCount({ count, noun, active, basePath }) {
  const filtered = active.q || active.category || active.tag;
  return (
    <div className="archive-count">
      <span>
        {count} {count === 1 ? noun[0] : noun[1]}
        {active.q ? ` matching “${active.q}”` : ""}
        {active.tag ? ` · tagged #${active.tag}` : ""}
      </span>
      {filtered && <Link href={basePath}>Clear filters ×</Link>}
    </div>
  );
}
// Read q, category and tag from searchParams, ignoring arrays and long values.
export function readFilters(params) {
  const one = (v) => (typeof v === "string" ? v.slice(0, 150) : "");
  return { q: one(params?.q), category: one(params?.category), tag: one(params?.tag) };
}
