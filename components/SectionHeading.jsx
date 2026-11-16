import Link from "next/link";
export default function SectionHeading({ title, href, linkText }) {
  return (
    <div className="section-heading" data-reveal="">
      <h2>{title}</h2>
      {href && (
        <Link href={href} className="text-link">
          {linkText || "View all"} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
