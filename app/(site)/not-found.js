import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container empty-state not-found">
      <p className="eyebrow">404</p>
      <h1>This page isn’t here.</h1>
      <p>Check the address or browse the notebook.</p>
      <div className="actions">
        <Link href="/" className="button">Back to the notebook</Link>
        <Link href="/writing" className="text-link">Browse writing <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
