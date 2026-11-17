"use client";
import { useEffect, useRef } from "react";
export default function PointerGlow() {
  const glow = useRef(null);
  useEffect(() => {
    const el = glow.current;
    const surface = el?.parentElement;
    if (!surface) return;

    const motion = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let cursor;
    let position;

    function paint() {
      frame = 0;
      const rect = surface.getBoundingClientRect();
      const x = cursor.x - rect.left;
      const y = cursor.y - rect.top;
      if (!position) {
        position = { x, y };
        el.dataset.active = "true";
      }
      position.x += (x - position.x) * .24;
      position.y += (y - position.y) * .24;
      const settled = Math.hypot(x - position.x, y - position.y) < .6;
      if (settled) position = { x, y };
      el.style.setProperty("--mx", `${position.x}px`);
      el.style.setProperty("--my", `${position.y}px`);
      if (!settled) frame = requestAnimationFrame(paint);
    }

    function move(event) {
      if (!motion.matches || event.pointerType !== "mouse") return;
      cursor = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function leave() {
      cancelAnimationFrame(frame);
      frame = 0;
      position = undefined;
      el.dataset.active = "false";
    }

    surface.addEventListener("pointermove", move, { passive: true });
    surface.addEventListener("pointerleave", leave);
    motion.addEventListener("change", leave);
    return () => {
      cancelAnimationFrame(frame);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", leave);
      motion.removeEventListener("change", leave);
    };
  }, []);
  return <div ref={glow} className="pointer-glow" aria-hidden="true" />;
}
