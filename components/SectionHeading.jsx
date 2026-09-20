import Link from "next/link";
export default function SectionHeading({ number, title, href, linkText }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{number} /</span>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-link">
          {linkText || "View all"} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
