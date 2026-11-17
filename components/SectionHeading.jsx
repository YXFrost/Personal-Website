import NavigationLink from "./NavigationLink";
export default function SectionHeading({ id, title, href, linkText }) {
  return (
    <div className="section-heading" data-reveal="">
      <h2 id={id} tabIndex={id ? -1 : undefined}>{title}</h2>
      {href && (
        <NavigationLink href={href} className="text-link" prefetchOnIntent>
          {linkText || "View all"} <span aria-hidden="true">→</span>
        </NavigationLink>
      )}
    </div>
  );
}
