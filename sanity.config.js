// sanity.config.js
// ─────────────────────────────────────────────────────────────────
// Sanity Studio v3 configuration.
// Place this in your project root (same level as package.json).
// Run: npx sanity dev  →  opens Studio at localhost:3333
// ─────────────────────────────────────────────────────────────────

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import project from "./sanity/schema/project";
import { codeInput } from "@sanity/code-input";

export default defineConfig({
  // ── Identity ──────────────────────────────────────────────────
  name: "portfolio-studio",
  title: "Portfolio CMS",

  // ── These come from https://sanity.io/manage ──────────────────
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  // ── Plugins ───────────────────────────────────────────────────
  plugins: [
    structureTool(),
    codeInput(),
  ],

  // ── Schema ────────────────────────────────────────────────────
  schema: {
    types: [project],
  },
});
