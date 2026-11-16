import Link from "next/link";
import ArchiveFilters, { ArchiveCount, readFilters } from "@/components/ArchiveFilters";
import { getEntries } from "@/lib/content";
import { facetCounts, filterEntries } from "@/lib/utils.mjs";
import { pageMetadata } from "@/lib/metadata";
import ArticleCard from "@/components/ArticleCard";
export const metadata = pageMetadata(
  "Writing",
  "Essays and notes on books, mathematics, science, philosophy, and the ideas between them.",
  "/writing",
);
export default async function WritingPage({ searchParams }) {
  const active = readFilters(await searchParams);
  const entries = await getEntries("writing");
  const categories = facetCounts(entries.map((d) => d.category));
  const filtered = filterEntries(entries, active);
  return (
    <div className="container archive">
      <header className="page-heading">
        <p className="eyebrow">The publication</p>
        <h1>
          Writing<span>.</span>
        </h1>
        <p>
          Thinking things through, one essay at a time.
          <br />
          Books, science, philosophy, and the connections between them.
        </p>
      </header>
      <ArchiveFilters
        basePath="/writing"
        label="Writing categories"
        active={active}
        facets={{ param: "category", values: categories, allLabel: "All topics" }}
        showChips={categories.length > 1 || entries.length > 6}
        search={{
          id: "writing-search",
          label: "Find an essay or topic",
          placeholder: "Search titles, summaries, tags…",
        }}
        resultsId="writing-results"
      />
      <ArchiveCount
        count={filtered.length}
        noun={["entry", "entries"]}
        active={active}
        basePath="/writing"
      />
      <div id="writing-results" className="archive-results">
        {filtered.length ? (
          filtered.map((d) => (
            <ArticleCard headingLevel="h2" key={d._id} entry={d} />
          ))
        ) : (
          <div className="empty-state" data-reveal="">
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
              {entries.length ? "See all writing" : "Explore the projects"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
