import NavigationLink from "./NavigationLink";
import Form from "next/form";
import SearchSubmit from "./SearchSubmit";
import { archiveUrl } from "@/lib/utils.mjs";
export { default as ArchiveCount } from "./ArchiveCount";
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
        <Form action={basePath} className="search-form" role="search" prefetch={false}>
          <label htmlFor={search.id}>{search.label}</label>
          <div>
            <input
              key={active.q}
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
            {active.month && <input name="month" type="hidden" value={active.month} />}
            <SearchSubmit results={resultsId} />
          </div>
        </Form>
      )}
      {showChips && values.length > 0 && (
        <nav className="filters" aria-label={label}>
          <NavigationLink
            href={archiveUrl(basePath, { ...active, [param]: "" })}
            aria-current={!active[param] ? "page" : undefined}
          >
            {allLabel}
          </NavigationLink>
          {values.map(({ value }) => (
            <NavigationLink
              key={value}
              href={archiveUrl(basePath, { ...active, [param]: value })}
              aria-current={active[param] === value ? "page" : undefined}
            >
              {value}
            </NavigationLink>
          ))}
        </nav>
      )}
    </>
  );
}
// Read q, category and tag from searchParams, ignoring arrays and long values.
export function readFilters(params, { progress = false } = {}) {
  const one = (value) => typeof value === "string" ? value.slice(0, 150).trim() : "";
  const active = { q: one(params?.q), tag: one(params?.tag) };
  if (!progress) return { ...active, category: one(params?.category) };
  const month = one(params?.month);
  return { ...active, month: /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : "" };
}
