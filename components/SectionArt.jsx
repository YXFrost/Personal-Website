"use client";
import { useEffect, useRef } from "react";

// Decorative masthead art. Ambient loops pause while the masthead is off-screen, and the
// About rings publish their ellipse ratio so the orbiting planets stay on the drawn rings.
export default function SectionArt({ children }) {
  const art = useRef(null);
  useEffect(() => {
    const el = art.current;
    if (!el) return;
    const cleanups = [];

    if ("IntersectionObserver" in window) {
      const visibility = new IntersectionObserver(([entry]) => {
        el.dataset.idle = entry.isIntersecting ? "false" : "true";
      });
      visibility.observe(el);
      cleanups.push(() => visibility.disconnect());
    }

    const rings = el.querySelector(".about-rings");
    if (rings && "ResizeObserver" in window) {
      // Matches the farthest-side ellipse of a gradient centred at 63% 54%.
      const measure = () => {
        const { width, height } = rings.getBoundingClientRect();
        const w = rings.offsetWidth || width;
        const h = rings.offsetHeight || height;
        if (w && h) rings.style.setProperty("--ring-ratio", ((0.54 * h) / (0.63 * w)).toFixed(4));
      };
      const resize = new ResizeObserver(measure);
      resize.observe(rings);
      measure();
      cleanups.push(() => resize.disconnect());
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div ref={art} className="section-art" aria-hidden="true">
      {children}
    </div>
  );
}
