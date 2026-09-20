import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container empty-state not-found">
      <p className="eyebrow">404 / A loose page</p>
      <h1>This page isn’t here.</h1>
      <p>The address may have changed, or the entry may still be a draft.</p>
      <Link href="/" className="button">
        Back to the notebook →
      </Link>
    </div>
  );
}
