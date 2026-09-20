import Link from "next/link";
import { getEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import ArticleCard from "@/components/ArticleCard";
export const metadata = pageMetadata(
  "Writing",
  "Essays and notes on books, mathematics, science, philosophy, and the ideas between them.",
  "/writing",
);
export default async function WritingPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q.slice(0, 150) : "";
  const category = typeof params?.category === "string" ? params.category : "";
  const entries = await getEntries("writing");
  const categories = [
    ...new Set(entries.map((d) => d.category).filter(Boolean)),
  ].sort();
  const filtered = entries.filter(
    (d) =>
      (!category || d.category === category) &&
      `${d.title} ${d.summary} ${d.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const filterUrl = (c) => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (c) p.set("category", c);
    return `/writing${p.size ? `?${p}` : ""}`;
  };
  return (
    <div className="container archive">
      <header className="page-heading">
        <p className="eyebrow">01 / The publication</p>
        <h1>
          Writing<span>.</span>
        </h1>
        <p>
          Thinking things through, one essay at a time.
          <br />
          Books, science, philosophy, and the connections between them.
        </p>
      </header>
      <form
        action="/writing"
        method="get"
        className="search-form"
        role="search"
      >
        <label htmlFor="writing-search">Find an essay or topic</label>
        <div>
          <input
            id="writing-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search titles, summaries, tags…"
            maxLength={150}
          />
          {category && <input name="category" type="hidden" value={category} />}
          <button className="button secondary" type="submit">
            Search
          </button>
        </div>
      </form>
      {categories.length > 0 && (
        <nav className="filters" aria-label="Writing categories">
          <Link
            href={filterUrl("")}
            aria-current={!category ? "page" : undefined}
          >
            All topics
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={filterUrl(c)}
              aria-current={category === c ? "page" : undefined}
            >
              {c}
            </Link>
          ))}
        </nav>
      )}
      <div className="archive-count">
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        {query ? ` matching “${query}”` : ""}
        {(query || category) && <Link href="/writing">Clear filters ×</Link>}
      </div>
      {filtered.length ? (
        filtered.map((d) => (
          <ArticleCard headingLevel="h2" key={d._id} entry={d} />
        ))
      ) : (
        <div className="empty-state">
          <p className="eyebrow">An open page</p>
          <h2>
            {entries.length
              ? "No matching essays."
              : "The writing starts here."}
          </h2>
          <p>
            {entries.length
              ? "Try a different phrase or clear the filters."
              : "A place for considered thoughts and useful questions. Essays will appear here when they’re ready."}
          </p>
          <Link
            className="text-link"
            href={entries.length ? "/writing" : "/projects"}
          >
            {entries.length ? "See all writing" : "Explore the projects"} →
          </Link>
        </div>
      )}
    </div>
  );
}
