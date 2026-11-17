"use client";
import { useEffect, useRef } from "react";

import {
  connectionOpacity,
  linkageAt,
  linkagePivots,
  orbitPairs,
  orbitPositions,
  orbitTrail,
  point,
  traceFraction,
  waveExperimentAt,
} from "@/lib/mastheadMotion";

function linkagePainter(scene) {
  const [left, right] = linkagePivots;
  const crankArm = scene.querySelector("[data-crank]");
  const rockerArm = scene.querySelector("[data-rocker]");
  const coupler = scene.querySelector("[data-coupler]");
  const penTraces = scene.querySelectorAll("[data-pen-trace]");
  const previousTrace = scene.querySelector("[data-old-trace]");
  const pins = scene.querySelectorAll("[data-linkage-pin]");
  const halo = scene.querySelector("[data-pen-halo]");
  return (seconds) => {
    const still = seconds === null;
    const phase = (0.13 + (seconds ?? 0) / 7.6) % 1;
    const { crank, rocker, pen } = linkageAt(phase);

    crankArm.setAttribute("d", `M${point(left)}L${point(crank)}`);
    rockerArm.setAttribute("d", `M${point(right)}L${point(rocker)}`);
    coupler.setAttribute("d", `M${point(crank)}L${point(rocker)}L${point(pen)}Z`);
    [crank, rocker, pen].forEach(({ x, y }, index) => {
      pins[index].setAttribute("cx", x.toFixed(2));
      pins[index].setAttribute("cy", y.toFixed(2));
    });
    halo.setAttribute("transform", `translate(${point(pen)})`);
    const offset = still ? "0" : (1 - traceFraction(phase)).toFixed(4);
    for (const trace of penTraces) trace.setAttribute("stroke-dashoffset", offset);
    // The finished trace hands over to the faint copy, which fades out on an ease-out curve.
    previousTrace.setAttribute("opacity", still ? "0" : ((1 - phase) ** 3 * 0.85).toFixed(3));
  };
}

function wavePainter(scene) {
  const paths = scene.querySelectorAll("[data-wave]");
  return (seconds) => {
    const phase = seconds === null ? 0.43 : 0.22 + seconds / 8;
    const wave = waveExperimentAt(phase);
    for (const path of paths) path.setAttribute("d", wave[path.dataset.wave]);
  };
}

function orbitPainter(scene) {
  const bodies = scene.querySelectorAll("[data-orbit-body]");
  const trails = scene.querySelectorAll("[data-orbit-trail]");
  const links = scene.querySelectorAll("[data-orbit-link]");
  const moon = scene.querySelector("[data-orbit-moon]");
  return (seconds) => {
    const time = seconds ?? 0;
    const positions = orbitPositions(time);
    bodies.forEach((body, index) => body.setAttribute("transform", `translate(${point(positions[index])})`));
    trails.forEach((trail) => {
      trail.setAttribute("d", orbitTrail(Number(trail.dataset.orbitTrail), time, Number(trail.dataset.length)));
    });
    orbitPairs.forEach(([first, second], index) => {
      const a = positions[first];
      const b = positions[second];
      const link = links[index];
      const opacity = connectionOpacity(a, b);
      link.setAttribute("opacity", opacity.toFixed(3));
      if (opacity === 0) return;
      link.setAttribute("x1", a.x.toFixed(2));
      link.setAttribute("y1", a.y.toFixed(2));
      link.setAttribute("x2", b.x.toFixed(2));
      link.setAttribute("y2", b.y.toFixed(2));
    });
    moon.setAttribute("transform", `rotate(${(28 + time * 86) % 360})`);
  };
}

const createPainter = { linkage: linkagePainter, waves: wavePainter, orbits: orbitPainter };

// Motion eases in from rest over this many seconds instead of starting at full speed.
const SPIN_UP = 1.6;
// Pointer drift: maximum offset in px and spring stiffness (per second).
const DRIFT = 10;
const FOLLOW = 5.5;

export default function SectionArt({ children }) {
  const art = useRef(null);
  useEffect(() => {
    const el = art.current;
    const masthead = el.parentElement;
    const scene = el.querySelector("[data-motion-scene]");
    const drifting = el.querySelector(".masthead-art");
    const paint = scene && createPainter[scene.dataset.motionScene](scene);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    let visible = !("IntersectionObserver" in window);
    let clock = 0;
    let running = 0;
    let frame = 0;
    let lastTick;
    const target = { x: 0, y: 0 };
    const drift = { x: 0, y: 0 };

    function tick(now) {
      // Clamp long gaps (tab switch, slow frame) so nothing leaps forward.
      const dt = Math.min(0.05, (now - (lastTick ?? now)) / 1000);
      lastTick = now;
      running += dt;
      // Smoothstep spin-up: the scene accelerates gently, then runs at constant speed.
      const ramp = Math.min(1, running / SPIN_UP);
      clock += dt * ramp * ramp * (3 - 2 * ramp);
      paint?.(clock);

      if (drifting) {
        const k = 1 - Math.exp(-FOLLOW * dt);
        drift.x += (target.x - drift.x) * k;
        drift.y += (target.y - drift.y) * k;
        drifting.style.transform = `translate3d(${drift.x.toFixed(2)}px, ${drift.y.toFixed(2)}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      const active = visible && !document.hidden && !reduced.matches;
      el.dataset.idle = active ? "false" : "true";
      if (active) {
        if (!frame) frame = requestAnimationFrame(tick);
        return;
      }
      cancelAnimationFrame(frame);
      frame = 0;
      lastTick = undefined;
      if (reduced.matches) {
        clock = 0;
        paint?.(null);
        if (drifting) drifting.style.transform = "";
      }
    }

    function move(event) {
      if (!finePointer.matches || reduced.matches) return;
      const rect = masthead.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * DRIFT;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2 * DRIFT * 0.6;
    }
    function leave() {
      target.x = 0;
      target.y = 0;
    }

    const visibility = visible ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    visibility?.observe(el);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    masthead.addEventListener("pointermove", move);
    masthead.addEventListener("pointerleave", leave);
    sync();

    return () => {
      cancelAnimationFrame(frame);
      visibility?.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      masthead.removeEventListener("pointermove", move);
      masthead.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={art} className="section-art" data-idle="true" aria-hidden="true">
      {children}
    </div>
  );
}
