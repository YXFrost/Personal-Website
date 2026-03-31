// components/HeroSection.jsx
// ─────────────────────────────────────────────────────────────────
// Animated hero with large name, subtitle, and ambient grid.
// ─────────────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 overflow-hidden"
      aria-label="Introduction"
    >
      {/* ── Ambient grid background ──────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid opacity-100 pointer-events-none"
      />

      {/* ── Radial vignette over grid ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #080808 100%)",
        }}
      />

      {/* ── Decorative corner brackets ────────────────────────────── */}
      <CornerBrackets />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl">
        {/* Index label */}
        <p className="font-mono text-xs text-amber tracking-widest uppercase mb-8 animate-fade-up">
          01 / Introduction
        </p>

        {/* Main heading */}
        <h1 className="font-display font-bold leading-none tracking-tight mb-6">
          {/* Name — large display */}
          <span className="block text-[clamp(3rem,10vw,8rem)] text-text-primary animate-fade-up delay-100">
            Welcome!
          </span>

          {/* Subtitle — smaller, with amber accent */}
          <span className="block text-[clamp(1.1rem,3vw,2rem)] text-text-secondary font-mono font-normal mt-2 animate-fade-up delay-200">
            <span className="text-amber">{">"}</span>{" "}
            I do{" "}
            <span className="text-text-primary">studying</span> &amp;{" "}
            <span className="text-text-primary">projects</span>
          </span>
        </h1>

        {/* Bio line */}
        <p className="font-sans text-text-secondary text-base md:text-lg max-w-xl leading-relaxed animate-fade-up delay-300">
          Struggling student trying to improve one step at a time.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-4 mt-10 animate-fade-up delay-400">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-amber text-amber font-mono text-sm tracking-wide hover:bg-amber hover:text-void transition-all duration-200"
          >
            View Projects
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </a>
        </div>

        {/* Status indicator */}
        {/*
        <div className="flex items-center gap-2 mt-8 animate-fade-up delay-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber" />
          </span>
          <span className="font-mono text-xs text-text-muted">
            Available for freelance / collaborations
          </span>
        </div>
        */}
      </div>

      {/* ── Bottom scroll hint ────────────────────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up delay-700"
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-linear-to-b from-text-muted to-transparent" />
      </div>
    </section>
  );
}

// ── Decorative corner brackets ────────────────────────────────────
function CornerBrackets() {
  const bracketClass =
    "absolute w-6 h-6 border-amber opacity-20 pointer-events-none";
  return (
    <>
      <div
        className={`${bracketClass} top-8 left-8 border-t border-l`}
        aria-hidden="true"
      />
      <div
        className={`${bracketClass} top-8 right-8 border-t border-r`}
        aria-hidden="true"
      />
      <div
        className={`${bracketClass} bottom-16 left-8 border-b border-l`}
        aria-hidden="true"
      />
      <div
        className={`${bracketClass} bottom-16 right-8 border-b border-r`}
        aria-hidden="true"
      />
    </>
  );
}
