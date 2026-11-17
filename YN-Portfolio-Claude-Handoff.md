# YN portfolio handoff for Claude

## Start here

Open the existing project at `D:\website\my-portfolio` if you have access to this PC. For a separate environment, extract the ZIP and open the `portfolio` folder. It is a complete source snapshot, including the latest uncommitted code and the project image. The sibling `previews` folder shows the design on desktop and mobile.

At the time of export, the local branch was `website-redesign` at commit `5db4096` (`Improve portfolio typography, discovery, and accessibility`), with further saved changes in the working tree. Use those files or this ZIP as the baseline. A fresh checkout of the branch alone would omit the latest motion, navigation, and section redesign. The ZIP contains the public site, embedded Studio, content fixtures, lockfile, and tests. Environment credentials, installed dependencies, build output, and Git history are excluded.

Read `AGENTS.md` and `CLAUDE.md`. The pinned version of Next.js requires consulting the relevant guides inside `node_modules/next/dist/docs/` before editing. `START-HERE.md` describes an earlier repository migration. For this export, open the source directly and use the commands below.

## Copy into Claude

> Read this handoff and inspect the current files in the portfolio workspace. Use the working tree as the source of truth. This is my personal notebook and portfolio for essays, projects, and study logs. I'm happy with the current dark editorial design, detailed but quick motion, and the new section backgrounds. Preserve those when making the next change I ask for. Check the local Next.js guides before editing. Test your changes in the browser at mobile and desktop sizes, including keyboard and reduced motion where relevant. Use local fixtures for design and browser checks when you need sample content.

## Run locally

The project uses JavaScript, Next.js 16.4.6 with App Router, React 19.3.1, Tailwind CSS 4, Sanity 6, and Playwright. Use Node 22.12+ in the 22.x series or Node 24. Node 24.14.1 was used in the original workspace. Run these commands from the `portfolio` folder.

For a fresh copy without private settings, use the included fictional entries to review all layouts. In PowerShell:

```powershell
npm ci
$env:CONTENT_PREVIEW = "1"
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`. With preview mode enabled, the site displays fictional layout specimens and disables indexing. The existing workspace can use its own ignored `.env.local` and `CONTENT_PREVIEW=0` to show the real Sanity content. Use `.env.local.example` as a guide if the owner supplies that configuration. `CONTENT_PREVIEW` in the shell overrides the file, so open a new terminal or set it to `0` when returning to real content.

`/studio` is embedded in the same Next.js project. Real editing requires the owner's existing Sanity project, dataset, and authorized origin. `content/site.json` holds the profile, About copy, and Currently panel. `lib/content.js` owns public CMS queries, legacy mapping, and the local fallback. Real content and public origin configuration matter for the live RSS, canonical URLs, and redirects.

## Current design and behaviour

| Page | What to preserve |
| --- | --- |
| Home `/` | Oversized editorial hero, amber grid and contour layers, pointer spotlight, staggered headline, and Currently card. The primary button opens the latest essay when available. Native jump links lead to Projects, Writing, and Study logs. The lead project has an artwork reveal, parallax, and a cover transition. |
| Writing `/writing` | Warm ruled-paper masthead, prominent first essay cover where available, compact filtered results, search feedback, and RSS when a public origin is configured. Detail pages prioritize long-form readability, TOC, and rich text. |
| Projects `/projects` | Olive blueprint masthead and wide lead project showcase when browsing unfiltered. The cover morphs into the case study. Preserve tag and status filtering and existing project URLs. |
| Progress `/progress` | Teal grid masthead, overview metrics, subject links, and a keyboard-friendly jump to the study logs. The monthly hours chart appears when at least two logs record hours. |
| About `/about` | Warm contour masthead, readable biography, working-principle panel, and three clear links to the notebook sections. |

Keep self-hosted Inter for the interface, Georgia for prose, and the restrained dark/sand/amber palette. The section-specific colors set context, while the shared buttons, links, and navigation retain a consistent accent. Use motion on artwork and surfaces where it clarifies hierarchy or continuity. Keep scrolling native and let text and controls stay steady. Respect `prefers-reduced-motion` and preserve the static fallback for scroll-driven CSS.

The three design references informed the focused introduction, image-led project presentation, and quick section navigation. [Justin Schüler](https://justinschueler.com/) · [Christoph Mandl](https://mandl.design/en) · [Abdullah](https://helloabdullah.com/)

## Where to work

| File | Responsibility |
| --- | --- |
| `app/(site)/globals.css` | Design tokens, typography, responsive layouts, section motifs, scroll-driven parallax, shared transitions, and reduced-motion styles. |
| `app/(site)/page.js`, `components/HeroSection.jsx`, `components/HeroGlow.jsx` | Home content, native section links, hero backdrop, and desktop pointer spotlight. |
| `components/SectionPage.jsx` and the four public index pages | Shared section masthead and route-specific content layouts. |
| `components/PageTransition.jsx`, `components/ProjectCard.jsx`, `components/EntryPage.jsx` | Page transition and the matching project-cover identity on the archive and case study. |
| `components/NavigationLink.jsx`, `components/Navbar.jsx`, `app/(site)/layout.js` | Intent prefetch, pending feedback in the header, main navigation, and immediate route scrolling with native smooth section jumps. |
| `components/RevealObserver.jsx` | Optional viewport reveals. Base content renders visible and keyboard focus finishes a reveal. |
| `components/ArchiveFilters.jsx`, `components/ArchiveCount.jsx`, `components/ArchiveReturn.jsx` | Query-based archives, result announcements, clear-filter focus, and return to results. |
| `components/HoursChart.jsx`, `lib/utils.mjs` | Progress chart, month links, aggregate hours, subjects, and archive filtering. |
| `lib/content.js`, `content/legacy-routes.json`, `sanity/schema/` | Content sources, legacy paths, and Studio fields. |

## Verification

For the standalone source with layout fixtures, stop the dev server and run:

```powershell
$env:CONTENT_PREVIEW = "1"
$env:TEST_PREVIEW = "1"
npm run check
npx playwright install chromium
npm run test:browser
npm run test:smoke
```

`npm run check` covers lint, unit tests, and a production build. The browser test normally starts its own local production server. After a build, `npm run start` can also serve a manual production preview. Next.js prefetching runs in production, while `npm run dev` can still pause on the first visit to an uncompiled route. Use production mode when comparing navigation timing. The CSS page entrance is 250 ms, with a separate project-cover morph.

For the original workspace the production build, 14 unit tests, HTTP and legacy-route smoke checks, 36 responsive layout checks, 6 automated accessibility scans, and 15 zoom/reflow checks passed. Targeted Chromium checks covered layered motion from 320 to 1440 px, reduced motion, project-cover transition, Writing search and clear, Progress navigation and subject filters, and About links. The chart was also checked with the included fictional entries at desktop and narrow widths. These results describe local browser and build verification.

When editing this baseline, recheck the four section index pages and the home page. Test Writing search and returning to filtered results, opening a project from its cover, the Progress jump and subject filter, and all three About cards. Use keyboard focus, mobile widths including 320 px, and reduced motion. Use the screenshots as a design comparison and the actual browser for motion.

