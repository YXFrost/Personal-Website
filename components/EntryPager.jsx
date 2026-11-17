import NavigationLink from "./NavigationLink";
import { entryPath, formatDate } from "@/lib/utils.mjs";
function Item({ entry, direction, monthly }) {
  const older = direction === "older";
  const when = monthly ? formatDate(entry.month || entry.publishedAt, true) : "";
  return (
    <NavigationLink className={`pager-link pager-${direction}`} href={entryPath(entry)}>
      <span className="pager-label">
        {older && <span aria-hidden="true">←</span>}
        {older ? "Older" : "Newer"}
        {when && ` · ${when}`}
        {!older && <span aria-hidden="true">→</span>}
      </span>
      <span className="pager-title">{entry.title}</span>
    </NavigationLink>
  );
}
// Previous/next entries of the same type; renders nothing without a neighbour.
export default function EntryPager({ newer, older, monthly = false }) {
  if (!newer && !older) return null;
  return (
    <nav className="entry-pager" aria-labelledby="entry-pager-title">
      <h2 id="entry-pager-title" className="sr-only">
        More entries
      </h2>
      {older && <Item entry={older} direction="older" monthly={monthly} />}
      {newer && <Item entry={newer} direction="newer" monthly={monthly} />}
    </nav>
  );
}
