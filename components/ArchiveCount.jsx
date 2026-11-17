"use client";
import NavigationLink from "./NavigationLink";
import { useEffect, useRef } from "react";
import { formatDate } from "@/lib/utils.mjs";

export default function ArchiveCount({ count, noun, active, basePath, searchId }) {
  const filtered = Boolean(active.q || active.category || active.tag || active.month);
  const restoreFocus = useRef(false);
  const status = useRef(null);

  useEffect(() => {
    if (!filtered && restoreFocus.current) {
      restoreFocus.current = false;
      const target = (searchId && document.getElementById(searchId)) || status.current;
      target?.focus();
    }
  }, [filtered, searchId]);

  return (
    <div className="archive-count">
      <span ref={status} tabIndex={-1} role="status" aria-atomic="true">
        {count} {count === 1 ? noun[0] : noun[1]}
        {active.q && ` matching “${active.q}”`}
        {active.tag && ` · tagged #${active.tag}`}
        {active.month && ` · ${formatDate(active.month + "-01", true)}`}
      </span>
      {filtered && (
        <NavigationLink href={basePath} onNavigate={() => { restoreFocus.current = true; }}>
          Clear filters <span aria-hidden="true">×</span>
        </NavigationLink>
      )}
    </div>
  );
}
