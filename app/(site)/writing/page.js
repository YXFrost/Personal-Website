import Link from "next/link";
import ArchiveFilters, { ArchiveCount, readFilters } from "@/components/ArchiveFilters";
import { getEntries } from "@/lib/content";
import { facetCounts, filterEntries, isIndexable } from "@/lib/utils.mjs";
import { isPublicSite } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import ArticleCard from "@/components/ArticleCard";
import SectionPage from "@/components/SectionPage";
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
  const browsing = !active.q && !active.category && !active.tag;
  return (
    <SectionPage
      section="writing"
      title="Writing"
      description="Essays on books, science, philosophy, and the questions they share."
      actions={isPublicSite && entries.some(isIndexable) && (
        <a className="text-link feed-link" href="/feed.xml">Subscribe via RSS</a>
      )}
    >
      {entries.length > 0 && (
        <>
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
            searchId="writing-search"
          />
        </>
      )}
      <div id="writing-results" className="archive-results">
        {filtered.length ? (
          filtered.map((d, index) => (
            <ArticleCard
              headingLevel="h2"
              key={d._id}
              entry={d}
              filters={active}
              featured={browsing && index === 0 && Boolean(d.coverImage)}
            />
          ))
        ) : (
          <div className="empty-state" data-reveal="">
            <h2>
              {entries.length
                ? "No matching essays."
                : "No essays yet."}
            </h2>
            <p>
              {entries.length
                ? "Try a different phrase or clear the filters."
                : "In the meantime, browse the study logs or see what I’m building."}
            </p>
            <Link
              className="text-link"
              href={entries.length ? "/writing" : "/progress"}
            >
              {entries.length ? "See all writing" : "Browse study logs"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </SectionPage>
  );
}
