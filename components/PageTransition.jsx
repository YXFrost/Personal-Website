"use client";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
// Keyed by pathname so each navigation is an exit/enter pair that crossfades in place.
export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
