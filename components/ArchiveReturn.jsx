"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { archiveUrl } from "@/lib/utils.mjs";

export default function ArchiveReturn({ archive }) {
  const source = useSearchParams().get("filters");
  if (!source || source.length > 4500) return null;
  const params = new URLSearchParams(source);
  const keys = archive === "/progress" ? ["q", "tag", "month"] : ["q", "tag", "category"];
  const filters = Object.fromEntries(keys.map((key) => [key, params.get(key)?.slice(0, 150)]));
  const href = archiveUrl(archive, filters);
  if (href === archive) return null;
  return (
    <Link className="back-link" href={href} prefetch={false}>
      <span aria-hidden="true">←</span> Back to results
    </Link>
  );
}
