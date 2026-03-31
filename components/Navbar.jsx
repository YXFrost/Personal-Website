// components/Navbar.jsx
// ─────────────────────────────────────────────────────────────────
// Minimal fixed navbar with name + navigation links.
// ─────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";



const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#projects", label: "Projects" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Backdrop blur strip */}
      <div className="absolute inset-0 backdrop-blur-md bg-void/80 border-b border-border" />

      <nav
        className="relative flex items-center justify-between px-6 md:px-12 lg:px-20 h-14"
        aria-label="Main navigation"
      >
        {/* ── Wordmark ─────────────────────────────────────────── */}
        <Link
          href="/"
          className="font-display font-bold text-sm tracking-widest text-text-primary hover:text-amber transition-colors duration-200 uppercase"
        >
          YN<span className="text-amber">.</span>
        </Link>

        {/* ── Links ────────────────────────────────────────────── */}
        <ul className="flex items-center gap-6" role="list">
          {navLinks.map(({ href, label, external }) => {
            const isActive = !external && pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={`
                    font-mono text-xs tracking-wider uppercase transition-colors duration-200
                    ${
                      isActive
                        ? "text-amber"
                        : "text-text-secondary hover:text-text-primary"
                    }
                  `}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
