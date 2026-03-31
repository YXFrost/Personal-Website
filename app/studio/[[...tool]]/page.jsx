// app/studio/[[...tool]]/page.jsx
// ─────────────────────────────────────────────────────────────────
// Embeds Sanity Studio inside your Next.js app at /studio.
// Access it at: http://localhost:3000/studio
//
// NOTE: You should restrict this route in production with auth
// or simply not deploy it. It's mainly useful during development.
// ─────────────────────────────────────────────────────────────────

"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
