import Link from "next/link";
// Each label links to its archive filtered by that label.
export default function TagList({ tags = [], basePath, label = "Tags" }) {
  if (!tags.length) return null;
  return (
    <ul className="tags" aria-label={label}>
      {tags.map((t) => (
        <li key={t}>
          <Link className="tag-link" href={`${basePath}?tag=${encodeURIComponent(t)}`}>
            {t}
          </Link>
        </li>
      ))}
    </ul>
  );
}
