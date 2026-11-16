"use client";
import { useEffect, useRef } from "react";
// A soft glow that follows a mouse pointer across the hero and lights up the grid near it.
// Mouse only, and off when reduced motion is requested (CSS hides it too).
export default function HeroGlow() {
  const glow = useRef(null);
  useEffect(() => {
    const el = glow.current;
    const hero = el?.parentElement;
    if (
      !hero ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    const move = (e) => {
      const rect = hero.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      el.dataset.active = "true";
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const leave = () => {
      el.dataset.active = "false";
    };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div ref={glow} className="hero-glow" aria-hidden="true" />;
}
