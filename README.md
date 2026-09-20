# YN — reconciled personal website

Start with **START-HERE.md** for the Windows installation guide. This is a normal Next.js source project, not an AI-hosted page builder.

## What was reconciled

- New design: black/amber editorial homepage, Writing / Projects / Progress / About, readable articles, TOC, search, related writing, metadata, sitemap, robots and `/feed.xml`.
- Current technical foundation: Next 16.2.1, React 19.2.4, Sanity 5.18.0, next-sanity 12.2.1, Tailwind 4.2.2. Core versions are pinned instead of `latest`.
- Studio remains embedded at `/studio`, with Sanity's code-input plugin and filename support. No `studio/` subproject or separate deployment.
- Original project field names and `/projects/[slug]` URLs are preserved. Existing `description`, `longDescription`, `image`, `tags`, `githubUrl` and `liveUrl` are normalized into the new display model.
- Rich-text headings h1–h6, underline, links, lists, quotes, code, images and captions are supported. Content h1 renders as h2 to retain one page title.
- Code highlighting renders on the server. Image enlargement uses a native modal dialog, keyboard-operable trigger, Escape, focus return and scroll-lock cleanup.
- Sanity image URLs are capped at 1920px; Next Image generates responsive variants. Images retain crop/hotspot and intrinsic dimensions. Cards don't contain nested buttons; enlargement only appears on detail pages.
- Existing project documents lacking `featured` still appear in the home project's section. New curated content can take precedence later.

## Project organization

- `app/(site)/`: public pages and root layout. The group name is not in URLs.
- `app/studio/`: independent root layout, so global publication CSS and site navigation do not interfere with the editor.
- `app/feed.xml`, `app/sitemap.js`, `app/robots.js`, `app/opengraph-image`: publication endpoints.
- `components/`: reusable cards, navigation, rich text, code and images.
- `sanity/schema/`: additive project, writing and progress models and shared content blocks.
- `lib/`: CMS queries, legacy normalization, images, metadata and URL safety.
- `content/site.json`: editable name, description, Currently, About, contact links.

Tailwind 4 is enabled, but the design uses readable component CSS and centralized tokens in `app/(site)/globals.css`. The unused legacy Tailwind configuration is retired. System fonts replace Google font downloads; metadata and code retain monospace, while prose uses a readable serif. A simple CSS grid background remains.

## Commands

Use Node 22.12+ in the 22.x line, or Node 24.

```sh
npm ci
npm run dev
npm run check
npm run start
```

`check` runs lint, unit tests and a production build. The old `next lint` and ineffective JavaScript `tsc --noEmit` scripts have been removed; this remains JavaScript, not a fully type-checked TypeScript rewrite.

After a build, server-rendered smoke tests can run with `node tests/http-smoke.mjs` (designed for the included local content, not your CMS's slugs). Full browser tests: `npx playwright install chromium`, then `npm run test:browser`. Native zoom tests require `TEST_NATIVE_ZOOM=1` and a browser environment supporting extension loading. See VERIFICATION.md for what was actually run.

## CMS and data safety

Use your existing Sanity project ID and dataset. Nothing in this package automatically imports, deletes, converts, or publishes documents. Opening the new Studio loads new schemas without replacing your data. Existing image alt omissions show warnings rather than blocking old entries; add meaningful descriptions when editing them.

New entries use `body`, `summary`, `coverImage`, optional dates/tags/SEO and other type-specific fields. Projects keep legacy fields visible; they are fallbacks, not duplicated content that must be re-entered. Writing includes references and mathematics. Progress supports subjects, hours, milestones, reflections, difficulties and next steps. Most fields are optional.

Use headings in a project body for Overview → Motivation → Process → Challenges → Result → Lessons learned. No rigid template is required.

When Sanity is configured, Sanity is the content source. When no project ID is configured, the site uses `content/*.json`; this includes a website project example, with empty Writing/Progress. A configured CMS error is surfaced rather than silently presenting an empty archive. CMS reads revalidate approximately every 60 seconds.

Set `SITE_URL` to your actual HTTPS public origin in local/Vercel environments. Missing public origin disables indexing. `NEXT_PUBLIC_SITE_URL` is accepted for compatibility. Keep `CONTENT_PREVIEW=0` for production.

`CONTENT_PREVIEW=1` enables explicitly labeled fictional layout specimens, including old-schema content. It excludes them from RSS/sitemap and sets noindex. It does not preview your Sanity drafts.

Old monthly updates and essays will remain under Projects until YOU choose which documents to reclassify. This is deliberate: the repository archive did not contain the actual Sanity dataset. The optional `scripts/migrate-content.mjs` works only on local exported data, but is not part of installation; do not run a CMS import without reviewing its output and backing up the dataset. No redirects are active until you explicitly populate `content/legacy-routes.json`.

## Deployment

Use your existing GitHub repository and Vercel project. First push `website-redesign` as a preview branch. Keep the production branch unchanged until review. Preserve existing environment values; add SITE_URL to Preview and Production. Keep Studio's normal Sanity authentication. Do not put write tokens in NEXT_PUBLIC variables.

No proprietary builder, AI dependency, new account or separate Studio install is needed. Build output, dependencies and secrets are not included in the archive.
