"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
const WIDE = "(min-width: 64.01rem)";
function subscribe(callback) {
  const query = matchMedia(WIDE);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
// Collapsible on narrow screens, always open in the desktop column, with scrollspy.
export default function Toc({ headings }) {
  const details = useRef(null);
  const wide = useSyncExternalStore(
    subscribe,
    () => matchMedia(WIDE).matches,
    () => false,
  );
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (details.current) details.current.open = wide;
  }, [wide]);
  // Current section: the last heading above 30% of the viewport. Recomputed once per
  // frame on scroll, so fast scrolling cannot skip a section.
  useEffect(() => {
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);
    if (!targets.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = innerHeight * 0.3;
      let current = null;
      for (const t of targets) {
        if (t.getBoundingClientRect().top > line) break;
        current = t.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [headings]);
  return (
    <aside className="toc">
      <details ref={details}>
        <summary
          tabIndex={wide ? -1 : undefined}
          onClick={(e) => {
            if (wide) e.preventDefault();
          }}
        >
          <h2>
            On this page <span className="toc-count">({headings.length})</span>
          </h2>
        </summary>
        <nav aria-label="On this page">
          <ol>
            {headings.map((h) => (
              <li key={h.id} className={h.level === "h3" ? "toc-nested" : ""}>
                <a
                  href={`#${h.id}`}
                  aria-current={active === h.id ? "location" : undefined}
                  onClick={() => {
                    setActive(h.id);
                    if (!wide && details.current) details.current.open = false;
                  }}
                >
                  {h.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
    </aside>
  );
}
