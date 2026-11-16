"use client";
import Link from "next/link";
import { useEffect } from "react";
export default function ErrorPage({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container empty-state">
      <p className="eyebrow">Something interrupted the page</p>
      <h1>The notebook couldn’t load.</h1>
      <p>Please try again in a moment.</p>
      <div className="actions">
        <button className="button" onClick={() => retry()}>
          Try again
        </button>
        <Link className="text-link" href="/">
          Back to the notebook <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
