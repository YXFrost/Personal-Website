"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
// Animate each offscreen item on entry while keeping its default state visible.
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
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;
          if (target.dataset.reveal === "pending") target.dataset.reveal = "in";
          observer.unobserve(target);
        }
      },
      { rootMargin: "0px 0px 3% 0px" },
    );
    function finishOnFocus(event) {
      const target = event.target.closest?.('[data-reveal="pending"],[data-reveal="in"]');
      if (!target) return;
      observer.unobserve(target);
      target.dataset.reveal = "done";
    }
    for (const el of document.querySelectorAll('[data-reveal=""],[data-reveal="pending"]')) {
      if (el.getBoundingClientRect().top < innerHeight) continue;
      el.dataset.reveal = "pending";
      observer.observe(el);
    }
    document.addEventListener("focusin", finishOnFocus);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", finishOnFocus);
    };
  }, [pathname]);
  return null;
}
