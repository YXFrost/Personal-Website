"use client";
export default function ErrorPage({ reset }) {
  return (
    <div className="container empty-state">
      <p className="eyebrow">Something interrupted the page</p>
      <h1>The notebook couldn’t load.</h1>
      <p>Please try again in a moment.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
