"use client";
import NavigationLink from "./NavigationLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const links = [
  ["/writing", "Writing"],
  ["/projects", "Projects"],
  ["/progress", "Progress"],
  ["/about", "About"],
];

function NavigationLinks({ pathname, onClick }) {
  return (
    <ul className="nav-links">
      {links.map(([href, label]) => (
        <li key={href}>
          <NavigationLink
            href={href}
            prefetch={pathname !== href}
            onClick={onClick}
            aria-current={pathname === href ? "page" : pathname.startsWith(href + "/") ? "location" : undefined}
          >
            {label}
          </NavigationLink>
        </li>
      ))}
    </ul>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }) {
  const header = useRef(null);
  const mobile = useRef(null);
  const toggle = useRef(null);

  function closeMenu() {
    if (mobile.current) mobile.current.open = false;
  }

  useEffect(() => {
    const onPointerDown = (event) => {
      if (mobile.current?.open && !header.current?.contains(event.target)) closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <header
      ref={header}
      className="site-header"
      style={{ viewTransitionName: "site-header" }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobile.current?.open) {
          closeMenu();
          toggle.current?.focus();
        }
      }}
    >
      <nav className="container nav" aria-label="Main navigation">
        <NavigationLink href="/" className="wordmark" aria-label="YN — homepage" onClick={closeMenu}>
          YN<span>.</span>
        </NavigationLink>
        <div className="desktop-nav">
          <NavigationLinks pathname={pathname} />
        </div>
        <details
          ref={mobile}
          className="mobile-nav"
          onToggle={(event) => {
            const menu = event.currentTarget;
            menu.toggleAttribute("data-motion", menu.open);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
          }}
        >
          <summary ref={toggle} className="menu-toggle">
            <span>Menu</span><span className="menu-indicator" aria-hidden="true" />
          </summary>
          <NavigationLinks pathname={pathname} onClick={closeMenu} />
        </details>
      </nav>
    </header>
  );
}
