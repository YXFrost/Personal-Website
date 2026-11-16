"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const links = [
  ["/writing", "Writing"],
  ["/projects", "Projects"],
  ["/progress", "Progress"],
  ["/about", "About"],
];
export default function Navbar() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}
function Navigation({ pathname }) {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const header = useRef(null);
  // Close when the user taps or clicks outside the open menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!header.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);
  return (
    <header
      ref={header}
      className="site-header"
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <nav className="container nav" aria-label="Main navigation">
        <Link href="/" className="wordmark" aria-label="YN — homepage" onClick={() => setOpen(false)}>
          YN<span>.</span>
        </Link>
        <button
          ref={button}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close −" : "Menu +"}
        </button>
        <div
          id="main-navigation"
          className={`nav-panel ${open ? "is-open" : ""}`}
        >
          <ul className="nav-links">
            {links.map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={
                    pathname === href || pathname.startsWith(href + "/")
                      ? "page"
                      : undefined
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
