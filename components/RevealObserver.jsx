"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
// Reveals [data-reveal] elements once as they scroll in. Content that is already on
// screen, or rendered without JS, is never hidden.
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.dataset.reveal = "in";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    for (const el of document.querySelectorAll('[data-reveal]:not([data-reveal="in"])')) {
      if (el.getBoundingClientRect().top < innerHeight * 0.9) continue;
      el.dataset.reveal = "pending";
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
