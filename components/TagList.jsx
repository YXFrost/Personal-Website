import NavigationLink from "./NavigationLink";
// Each label links to its archive filtered by that label.
export default function TagList({ tags = [], basePath, label = "Tags" }) {
  if (!tags.length) return null;
  return (
    <ul className="tags" aria-label={label}>
      {tags.map((t) => (
        <li key={t}>
          <NavigationLink className="tag-link" href={`${basePath}?tag=${encodeURIComponent(t)}`}>
            {t}
          </NavigationLink>
        </li>
      ))}
    </ul>
  );
}
