# YN — reconciled personal website

Start with **START-HERE.md** for the Windows installation guide. This is a normal Next.js source project, not an AI-hosted page builder.

## What was reconciled

- New design: black/amber editorial homepage, Writing / Projects / Progress / About, readable articles, TOC, search, related writing, metadata, sitemap, robots and `/feed.xml`.
- The framework, CMS and tools are pinned in `package.json` and `package-lock.json`.
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

Tailwind 4 is enabled alongside component CSS and shared tokens in `app/(site)/globals.css`. The interface uses self-hosted Inter, with Georgia for long-form prose and system monospace for code.

## Commands

Use Node 22.12+ in the 22.x line, or Node 24.

```sh
npm ci
npm run dev
npm run check
npm run start
```

`check` runs lint, unit tests and a production build. The old `next lint` and ineffective JavaScript `tsc --noEmit` scripts have been removed; this remains JavaScript, not a fully type-checked TypeScript rewrite.

After a build, run `npm run test:smoke` for HTTP checks or set `TEST_URL` to verify an already running or deployed site. Set `TEST_SITE_ORIGIN` to check production canonicals, robots, sitemap, and RSS, and `TEST_LEGACY_MOVES=1` to check the three Sanity-backed redirects. Set `TEST_PREVIEW=1` against a build that uses fictional fixtures. Install Chromium with `npx playwright install chromium` for `npm run test:browser`. Native zoom requires `TEST_NATIVE_ZOOM=1` and extension support.

## CMS and data safety

Use your existing Sanity project ID and dataset. Nothing in this package automatically imports, deletes, converts, or publishes documents. Opening the new Studio loads new schemas without replacing your data. Existing image alt omissions show warnings rather than blocking old entries; add meaningful descriptions when editing them.

New entries use `body`, `summary`, `coverImage`, optional dates/tags/SEO and other type-specific fields. Projects keep legacy fields visible; they are fallbacks, not duplicated content that must be re-entered. Writing includes references and mathematics. Progress supports subjects, hours, milestones, reflections, difficulties and next steps. Most fields are optional.

Use headings in a project body for Overview → Motivation → Process → Challenges → Result → Lessons learned. No rigid template is required.

Sanity supplies Writing, Progress, and CMS-managed projects when configured. The notebook case study in `content/projects.json` is also available in Projects. A published Sanity project with the same slug takes precedence. With no project ID, the site uses `content/*.json`. A configured CMS error is shown as an error, and CMS reads revalidate approximately every 60 seconds.

Set `SITE_URL` to your public HTTPS origin in Vercel Production, or enable the Vercel system production URL. `NEXT_PUBLIC_SITE_URL` is accepted for compatibility. Missing public origin and Vercel Preview builds disable indexing. Keep `CONTENT_PREVIEW=0` for production.

`CONTENT_PREVIEW=1` enables explicitly labeled fictional layout specimens, including old-schema content. It excludes them from RSS/sitemap and sets noindex. It does not preview your Sanity drafts.

### Privacy

"Show on the public website" controls the site’s listings and public routes. Published documents in a public dataset are readable through the Sanity API. Keep private text unpublished and keep private files out of the public asset CDN. The "Hide from search engines, sitemap and feed" setting adds a noindex tag and excludes the entry from the sitemap and RSS. The entry remains publicly readable on the website when shown there.

Run the embedded Studio from a Sanity-authorized origin. The configured project accepts `http://localhost:3000` for local editing.

The three legacy Sanity records in `content/legacy-routes.json` are presented under Writing and Progress with permanent redirects. The existing records remain editable in Studio under Projects and retain their dates and heading anchors. If a matching native Writing or Progress entry is published later, the public site uses that entry at the same URL. The optional `scripts/migrate-content.mjs` prepares an offline migration from a local export.

## Deployment

Use the existing GitHub repository and Vercel project. Review the branch deployment before promoting to production. Verify the public origin and Studio authentication after deployment. Keep write tokens out of NEXT_PUBLIC variables.

No proprietary builder, AI dependency, new account or separate Studio install is needed. Build output, dependencies and secrets are not included in the archive.
