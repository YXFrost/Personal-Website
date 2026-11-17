# Website Improvement Plan — YN personal notebook

## Context

The site (portfolio, writing, progress/learning logs) has a solid design and clean code but feels static: there is no motion at all, little interactivity, two of four sections are empty on real content, and browser-level verification was never completed. Goal: polish and extend what exists without redesigning. Audited on 2026-11-16, branch `website-redesign` @ `92e1ccf`.

Labels: **[C]** Confirmed (seen in code or in the running site) · **[I]** Inferred · **[Idea]** suggestion.

### What was actually checked

- Read every file under `app/`, `components/`, `lib/`, `sanity/schema/`, `content/`, `tests/`, config and docs.
- Ran `next dev` twice on port 3101: once with `CONTENT_PREVIEW=1` (fixtures), once against the configured Sanity dataset. Viewed home, `/writing`, `/writing/reading-specimen`, `/progress`, `/progress/sample-month`, `/projects/gallery-specimen` at ~800px and 375px wide; opened the mobile menu and the image lightbox; fetched real-content pages over HTTP.
- `npm test`: 8/8 pass. `npx eslint .`: clean.

### Not verified

- `npm run build` / `npm run check` (build not run). Lighthouse, Core Web Vitals, bundle sizes.
- axe / `npm run test:browser` (no Playwright browser installed). Screen readers. Real touch devices. Firefox/Safari.
- Widths ≥1024px in a browser (pane was ~800px), so the sticky desktop TOC column was reviewed in CSS only.
- Keyboard walk-through beyond what the code shows. Native zoom.
- Sanity Studio, dataset ACL, Vercel settings, the deployed production site.
- Raw Sanity documents (only rendered HTML was inspected).

### Side effect of the audit

Running `next dev` (Next 16.3.5) auto-generated two untracked files: `AGENTS.md` and `CLAUDE.md` (written by `node_modules/next/dist/server/lib/generate-agent-files.js`; they point agents to the bundled docs in `node_modules/next/dist/docs/`). They were left in place and will be re-created by any `next dev` run. See Open question 7.

---

## 1. Assessment

**Stack [C]:** Next.js 16.3.5 App Router (JavaScript), React 19.3, Sanity 6 with embedded Studio at `/studio`, Tailwind 4 imported but unused in markup (all styling is semantic classes in one 1,374-line `app/(site)/globals.css`), system fonts, ISR at 60s. Client components: `Navbar`, `ImageLightbox`, `Studio`, `error.js` only.

### Strengths [C]

- Coherent identity: near-black/amber, mono eyebrows, serif headings, grid hero. Consistent tokens in `:root`.
- Mostly server-rendered; code highlighting and KaTeX run on the server; math CSS loads only on math pages.
- Good accessibility base: skip link, landmarks, `aria-current`, visible focus, native `<dialog>` lightbox, 44px targets, reduced-motion and print blocks.
- Safe content handling: `safeUrl`, escaped JSON-LD/XML, draft/future filtering, legacy-field normalization with unit tests.
- SEO plumbing present: canonical, OG/Twitter, sitemap, robots, RSS, JSON-LD on entries, noindex without a public origin.
- No horizontal overflow at 375px on any page viewed; wide code/table scroll inside the article.

### Weaknesses

| # | Finding | Label |
|---|---|---|
| W1 | Real dataset has 3 documents, all typed `project`: one literary essay and two monthly study logs. `/writing` and `/progress` are empty; the homepage shows two empty notes; RSS has 0 items; logs are labelled "Project". This is the main reason the site feels unfinished. `scripts/migrate-content.mjs` + `content/legacy-routes.json` exist for this but were never used. | C |
| W2 | Zero motion. `document.getAnimations()` is 0 on the homepage; the only transitions are 160ms color changes. No hover feedback beyond border/color, no page or scroll transitions, lightbox and mobile menu appear instantly. | C |
| W3 | Homepage `<title>` is `A personal notebook` with no site name (the layout's `title.template` does not apply to a page in the same segment). | C |
| W4 | Section numbering is hardcoded. With no featured entry the homepage starts at "02 /". Homepage numbers (Writing 02, Projects 03, Progress 04) disagree with page eyebrows (01, 02, 03, About 04). | C |
| W5 | Empty `<ul class="tags">` rendered when an entry has no tags/subjects/technologies (`ArticleCard`, `ProjectCard`, `ProgressCard`, `EntryPage`). | C |
| W6 | TOC ignores legacy `h1` blocks: `ArticleRenderer` renders `h1` as `<h2>`, but `getHeadings` only collects `h2`/`h3`. The Crime and Punishment page renders ~9 section headings and no TOC. | I (raw doc not inspected) |
| W7 | TOC has no active-section state; below 1024px it is a static two-column block that pushes the article down. | C |
| W8 | Mobile menu toggles `display`, grows the sticky header to 257px of an 812px viewport, has no transition, and does not close on outside tap or focus leaving. | C |
| W9 | Discovery is thin: tags are not links; only Writing has search/category filter; Projects and Progress have none; no previous/next on entries; related content only for Writing. | C |
| W10 | Progress is a list plus three numbers. No view of hours over time, no per-subject view, no timeline feel. Monthly log pages show a full date ("1 September 2026") where cards show the month. | C |
| W11 | Very small text: `.updated` 0.62rem, `.tags` 0.63rem, `.hero-foot` 0.64rem, footer 0.65rem, stats/progress labels 0.65–0.68rem (≈10–11px). | C |
| W12 | "Visible on website" (`published: false`) is display-only. The Sanity client reads with no token, so the dataset is publicly readable and hidden documents can be fetched straight from the Sanity API by anyone with the public project ID. Only Sanity drafts are private. No per-entry noindex. | C (tokenless reads work) / I (consequence) |
| W13 | No loading or pending feedback anywhere (`loading.js` absent; search/filter are full server round trips with no indicator). `error.js` neither logs the error nor links home. | C |
| W14 | Code blocks have no copy button. Code figures without filename/language have no caption bar. | C |
| W15 | `site.github` and `site.email` are empty, so the footer shows only About + RSS and the About page has no contact block. `currently.updated` is a manual date (2026-09-20) that goes stale. | C |
| W16 | Docs drift: README/VERIFICATION cite Next 16.2.1, React 19.2.4, Sanity 5.18; `package.json` has 16.3.5, 19.3.0, 6.15.0. VERIFICATION.md states browser, axe and Lighthouse checks never ran. | C |
| W17 | Structured data only on entry pages (no `WebSite`/`Person` on home). All index pages and any entry without a raster cover share one static OG image. Feed is Writing-only, summary-only. | C |
| W18 | Tailwind 4 is loaded (preflight + `@theme`) but no utilities are used. Removing it would change resets; low-value debt, leave. List pages fetch full `body` for every document to compute reading time; fine at 3 documents, a cost later. Each zoomable image renders a second `<Image>` inside its own `<dialog>`. | C |
| W19 | Security headers lack CSP and Permissions-Policy. | C |

---

## 2. Prioritized backlog

Impact H/M/L · Effort S/M/L.

### Essential (bugs, accessibility, performance, verification)

| ID | Current | Change | Benefit | I | E | Risk |
|---|---|---|---|---|---|---|
| E1 | Build, axe and browser tests never run on this codebase | Run `npm run check`, install Chromium, run `npm run test:browser` in both modes; fix what fails | Real baseline before changing anything | H | M | May surface unknown failures |
| E2 | Home title lacks site name (W3) | `title: { absolute: "YN — A personal notebook" }` for home | Correct tab/SERP title | M | S | None |
| E3 | Hardcoded section numbers (W4) | Compute numbers from rendered sections; drop numbers that conflict with page eyebrows | Removes visible "02 first" glitch | M | S | None |
| E4 | Empty tag lists (W5) | Render lists only when non-empty | Cleaner markup and a11y tree, no stray margin | L | S | None |
| E5 | Legacy `h1` missing from TOC (W6) | Include `h1` in `getHeadings`, mapped to level `h2` | TOC appears on legacy long reads | M | S | Verify against real doc |
| E6 | Sub-11px text (W11) | Floor small mono text at 0.6875rem (11px); tags/meta 0.72rem | Legibility on phones | M | S | Minor wrapping changes |
| E7 | `error.js` minimal (W13) | Log error in `useEffect`, add "Back to the notebook" link | Recoverable error state | L | S | None |
| E8 | Monthly log shows day-level date (W10) | Month-only format when `entry.month` is set | Consistency with cards | L | S | None |
| E9 | "Hidden" is not private (W12) | State it in the Studio field description and README; add `seo.noindex` (see H9) | Prevents a false sense of privacy | H | S | None |
| E10 | Docs drift (W16) | Correct versions; rewrite VERIFICATION.md from E1 results | Trustworthy docs | L | S | None |

### High-value

| ID | Current | Change | Benefit | I | E | Risk |
|---|---|---|---|---|---|---|
| H1 | Content misfiled (W1) | Owner reclassifies essay → `writing`, logs → `progress` using existing migration script and redirects | Fills two empty sections, RSS, stats | H | M | Data migration; owner-gated; back up first |
| H2 | No motion system (W2) | Motion tokens + hover/press microinteractions (arrows, underlines, card image, buttons, status dot) | Site stops feeling static | H | S | Overdoing it; keep ≤480ms |
| H3 | Content appears abruptly | One-shot scroll reveal for cards/sections; hero entrance on load | Perceived polish | H | M | Hidden content if JS fails (mitigated by design below) |
| H4 | Hard cut between pages | Crossfade route transition with anchored header | Continuity | M | M | Next API specifics; has fallback |
| H5 | Lightbox and mobile menu snap (W8) | Dialog fade/scale; menu height+opacity transition; close on outside/blur | Finished feel on mobile | M | S | Menu a11y when closed |
| H6 | Passive TOC (W7) | Scrollspy highlight; collapsible `<details>` below 1024px; reading progress bar | Orientation in long reads | H | M | Layout shift if done wrong |
| H7 | Thin discovery (W9) | Clickable tags; shared tag/category/technology/subject filters on all three archives; previous/next on entries; related for projects | Makes the archive browsable | H | M | URL param handling |
| H8 | Progress is a list (W10) | Hours-per-month bar strip, subject totals, timeline rail on year groups | Delivers the "growth tracking" purpose | H | M | Sparse data (2 logs) must still look right |
| H9 | No per-entry indexing control (W12) | `seo.noindex` boolean: noindex meta, excluded from sitemap and feed | Privacy for personal logs | M | S | Schema addition (additive) |
| H10 | No copy on code (W14) | Copy button with "Copied" feedback | Standard reader convenience | M | S | None |
| H11 | No pending feedback (W13) | `next/form` for search, pending state on results, `loading.js` skeleton for entry routes | Responsiveness | M | S | None |

### Optional

| ID | Change | Benefit | I | E | Risk |
|---|---|---|---|---|---|
| O1 | `WebSite` + `Person` JSON-LD on home; `BreadcrumbList` on entries | Richer search results | L | S | None |
| O2 | Per-entry generated OG image (title + type) when no raster cover | Better link previews | M | M | Font/edge runtime quirks |
| O3 | Sanity webhook → `revalidateTag` route (tags already set in `lib/content.js`) | Instant publish instead of ≤60s | M | M | Needs secret + owner webhook setup |
| O4 | Search matches body text; `/` focuses search | Better recall | L | S | None |
| O5 | Feed includes progress/projects, or separate feeds | Subscribers see everything | L | S | Owner preference |
| O6 | CSP (report-only first) + Permissions-Policy | Hardening | L | M | Can break Studio; scope to `(site)` |
| O7 | Slim list queries (no `body`; precomputed reading time) | Smaller fetches as content grows | L | M | Touches data layer |
| O8 | "Currently" falls back to latest entry date when `updated` is older | No stale date | L | S | None |

Not recommended: animation libraries, light theme, comments, analytics, client-side search index, count-up numbers, parallax, cursor effects, splitting `globals.css`, removing Tailwind.

---

## 3. Phased roadmap

**Rules for the implementing agent**

- Before writing Next-specific code, read the matching guide in `node_modules/next/dist/docs/` (this Next version differs from older ones). Relevant: `01-app/02-guides/view-transitions.md`, `01-app/03-api-reference/02-components/form.md`, `01-app/03-api-reference/03-file-conventions/{loading,template}.md`, `.../01-metadata/`.
- No new runtime dependencies. All motion is CSS plus two small client components.
- Keep every existing class name, token, URL, and test selector (`.menu-toggle`, `.article-card`, `.image-trigger`, `.toc`, `nav[aria-label="On this page"]`, `#section-*`, "Find an essay or topic", "Search").
- Develop with `CONTENT_PREVIEW=1` (fixtures cover every layout); also check once against real content.
- After each phase: `npm run check`, then `npm run test:browser` with and without `TEST_PREVIEW=1`. One commit per phase.
- Motion budget: opacity and transform only; durations 160/280/480ms; nothing loops except the status dot; no animation delays first paint of the hero `h1`.

### Phase 0 — Baseline and verification (E1, E10)

- **Goal:** known-good starting point with recorded results.
- **Files:** `VERIFICATION.md`, `README.md` (versions only). Possibly `tests/browser.mjs` if a check is wrong for current behavior.
- **Approach:** `npm ci` if needed → `npm run check` → `npx playwright install chromium` → `npm run build && npm run start` then `npm run test:browser`; repeat with `CONTENT_PREVIEW=1` and `TEST_PREVIEW=1`. Run Lighthouse (mobile) on `/`, `/writing/reading-specimen`, `/progress`; record LCP/CLS/TBT and axe output. Fix any failures before Phase 1. Check ≥1280px by eye (sticky TOC column).
- **Dependencies:** none.
- **Regression risk:** none (no feature code).
- **Acceptance:** check and browser tests green in both modes; VERIFICATION.md lists what ran, with date and numbers; README versions match `package.json`.

### Phase 1 — Correctness and small fixes (E2–E9, H9)

- **Goal:** remove confirmed defects.
- **Files / approach:**
  - `app/(site)/page.js`: `metadata` title → `{ absolute: \`${site.name} — A personal notebook\` }` (keep `pageMetadata` for the rest; set OG/Twitter title to the same string). Build the section list as an array, filter out sections that should not render, and number by index (`String(i + 1).padStart(2, "0")`). Featured stays unnumbered-safe: if absent, Writing becomes 01.
  - `app/(site)/{writing,projects,progress,about}/page.js`: keep eyebrow text, remove the leading "01 /"–"04 /" numerals (they cannot agree with a dynamic homepage). Example: `The publication`.
  - `components/ArticleCard.jsx`, `ProjectCard.jsx`, `ProgressCard.jsx`, `EntryPage.jsx`: wrap each `<ul className="tags">` in a length check.
  - `components/ArticleRenderer.jsx` `getHeadings`: accept `h1`, `h2`, `h3`; map `h1` → level `h2`. Add a unit test in `tests/content.test.mjs` (move `getHeadings` to `lib/utils.mjs` so it is testable without React; re-export from `ArticleRenderer`).
  - `components/EntryPage.jsx`: `formatDate(entry.month || entry.publishedAt, Boolean(entry.month))` for progress.
  - `app/(site)/error.js`: accept `error`, `useEffect(() => console.error(error), [error])`, add `<Link className="text-link" href="/">`.
  - `app/(site)/globals.css`: raise `.updated`, `.hero-foot`, `.site-footer p/small`, `.progress-stamp small`, `.toc h2`, `.stats dt`, `.currently dt`, `.progress-facts span`, `figcaption` to ≥0.6875rem; `.tags` 0.72rem; `.meta`, `.eyebrow` 0.72rem.
  - `sanity/schema/shared.js`: `published` description → "Hides the entry from this website only. It is still readable through the public Sanity API; keep private material as a draft." Add `{ name: "noindex", title: "Hide from search engines, sitemap and feed", type: "boolean", initialValue: false }` to `seo`.
  - `lib/metadata.js` `entryMetadata`: if `d.seo?.noindex`, set `robots: { index: false, follow: false }`. `app/sitemap.js`, `app/feed.xml/route.js`: filter out `seo.noindex`. `README.md`: short "Privacy" paragraph.
- **Dependencies:** Phase 0.
- **Regression risk:** `tests/browser.mjs` asserts one `h1` per page and specific labels: unaffected. `http-smoke.mjs` asserts `id="home"`, `id="projects"`: keep those ids.
- **Acceptance:** home `<title>` contains "YN"; homepage numbers are contiguous from 01 with and without featured content; no empty `ul.tags` in HTML of any route; a body using only `h1` blocks with ≥4 headings shows a TOC; computed font-size ≥11px for all text at 375px; a fixture with `seo.noindex: true` emits noindex and is absent from sitemap/feed (unit test on the filter).

### Phase 2 — Motion foundation and microinteractions (H2, H5)

- **Goal:** tactile feedback everywhere, CSS only.
- **Files:** `app/(site)/globals.css`, `components/Navbar.jsx`, `components/ImageLightbox.jsx` (CSS hooks only).
- **Approach:**
  - Tokens in `:root`: `--ease-out: cubic-bezier(.22,.61,.36,1); --dur-1: 160ms; --dur-2: 280ms; --dur-3: 480ms;` Keep `--ease` as is.
  - Put all new motion in one block at the end of the file, before the reduced-motion query, wrapped in `@media (prefers-reduced-motion: no-preference) { … }`. The existing reduce block stays as a second safety net.
  - Arrows: wrap is already `<span aria-hidden>`. `.text-link span, .button span, .card-title span, .back-link` get `display:inline-block; transition: transform var(--dur-1) var(--ease-out)`. On hover/focus-visible of the parent (for cards: `article:hover .card-title span`): `→` translateX(3px); `↗` translate(2px,-2px); `←` (back-link, wrap the arrow in a span) translateX(-3px).
  - Nav links: replace the static `::after` with an underline on every link, `transform: scaleX(0); transform-origin: left; transition: transform var(--dur-2) var(--ease-out)`; `scaleX(1)` on hover/focus-visible and for `[aria-current]`. Desktop only (>40rem).
  - Prose links: `text-decoration-color` transition from `color-mix(in srgb, var(--amber) 50%, transparent)` to solid amber.
  - Cards: `.project-preview img, .article-preview img { transition: transform var(--dur-3) var(--ease-out) }`; on card hover/focus-within `transform: scale(1.02)` (containers already `overflow:hidden`). No lift, no shadow. Border-color transition 160ms on `.project-card, .featured-article`.
  - `.article-card h2/h3` color transition 160ms (currently instant). `.progress-card`: title color to amber on hover, same as article cards.
  - Buttons and filter chips: `:active { transform: translateY(1px) }`.
  - Status dot: `@keyframes pulse` ring via `box-shadow: 0 0 0 0 → 0 0 0 6px` amber at 40% → 0% alpha, 2.4s ease-out infinite.
  - Lightbox: `.image-dialog { opacity:0; transform: scale(.98); transition: opacity var(--dur-2), transform var(--dur-2) var(--ease-out), overlay var(--dur-2) allow-discrete, display var(--dur-2) allow-discrete; }` `.image-dialog[open] { opacity:1; transform:none }` `@starting-style { .image-dialog[open] { opacity:0; transform:scale(.98) } }`; same for `::backdrop` opacity. Browsers without `@starting-style` open instantly (current behavior). `.image-enlarge` chip: opacity .0 → 1 on trigger hover/focus-visible at ≥48rem with `(hover:hover)`; always visible on touch.
  - Mobile menu (≤40rem): in `Navbar.jsx` wrap the `<ul>` in `<div className="nav-panel">` (move `id="main-navigation"` and `is-open` to the wrapper; keep `.nav-links` on the `ul`). CSS: `.nav-panel { display:grid; grid-template-rows:0fr; visibility:hidden; opacity:0; flex-basis:100%; transition: grid-template-rows var(--dur-2) var(--ease-out), opacity var(--dur-1), visibility 0s var(--dur-2); } .nav-panel.is-open { grid-template-rows:1fr; visibility:visible; opacity:1; transition-delay:0s; } .nav-panel > ul { min-height:0; overflow:hidden; }` At >40rem `.nav-panel { display:contents }`. `visibility:hidden` keeps closed links out of tab order. Add `onBlur` on the header: if `!e.currentTarget.contains(e.relatedTarget)` close. Add a `pointerdown` listener on `document` while open to close on outside tap. Keep "Menu +" / "Close −" text and Escape handling.
- **Dependencies:** Phase 1.
- **Regression risk:** browser test clicks `.menu-toggle`, checks `aria-expanded`, Escape focus return, link click inside "Main navigation": keep all. Verify the lightbox focus-trap test still passes with transitions (dialog must be focusable immediately; do not delay `showModal`).
- **Acceptance:** each listed element shows its hover/focus state at 1280px and has a sensible touch state at 375px; menu opens/closes with a height transition and closed links are not tabbable; with `prefers-reduced-motion: reduce` emulated, `document.getAnimations().length === 0` and all states change instantly; no layout shift from hover effects; browser tests green.

### Phase 3 — Entrance, scroll reveal, page transitions (H3, H4)

- **Goal:** content arrives rather than appears; navigation feels continuous.
- **Files:** new `components/RevealObserver.jsx` (client), `app/(site)/layout.js`, `globals.css`, card components and section wrappers (attribute only), `components/HeroSection.jsx`, optionally `next.config.js` / `app/(site)/template.js`.
- **Approach:**
  - **Hero entrance (CSS only, on load):** `@keyframes rise { from { opacity:0; transform: translateY(10px) } }`. Apply `animation: rise var(--dur-3) var(--ease-out) both` with delays: eyebrow 0ms, `.hero-subtitle` 80ms, `.hero-description` 140ms, `.actions` 200ms, `.currently` 260ms. The `h1` (LCP element) gets **transform only, no opacity**: `@keyframes rise-solid { from { transform: translateY(10px) } }`, 0ms delay. Same pattern, lighter, for `.page-heading` and `.entry-header` children (eyebrow, summary/meta only; `h1` transform only).
  - **Scroll reveal:** server markup adds `data-reveal` (and optional `style={{ "--i": n }}` for stagger, n ≤ 3) to: `.article-card`, `.project-card`, `.progress-card`, `.section-heading`, `.stats > div`, `.about-strip`, `.empty-note`, `.empty-state`, `.related`. `RevealObserver` (≈30 lines, rendered once in the layout, re-runs on `usePathname()` change):
    1. If `matchMedia("(prefers-reduced-motion: reduce)").matches` → return.
    2. For each `[data-reveal]:not([data-reveal="in"])`: if `getBoundingClientRect().top < innerHeight * 0.9` leave it alone (already visible: never hide painted content); else set `data-reveal="pending"` and observe.
    3. `IntersectionObserver({ rootMargin: "0px 0px -8% 0px", threshold: 0.1 })`: on intersect set `data-reveal="in"`, unobserve.
    CSS: `[data-reveal="pending"] { opacity:0; transform: translateY(14px); } [data-reveal="in"] { opacity:1; transform:none; transition: opacity var(--dur-3) var(--ease-out), transform var(--dur-3) var(--ease-out); transition-delay: calc(var(--i, 0) * 60ms); }`. Without JS nothing is ever hidden. In `@media print` force `[data-reveal] { opacity:1 !important; transform:none !important }`.
  - **Route transition:** follow `view-transitions.md` in the bundled docs for the simplest same-route-group crossfade (≈200ms opacity on the main content), give the header `viewTransitionName: "site-header"` with its animation suppressed as the guide shows, and include the guide's reduced-motion CSS. If that requires a flag that destabilizes the build or tests, fall back to `app/(site)/template.js` rendering `<div className="page-enter">{children}</div>` with `@keyframes page-in { from { opacity:.0; transform: translateY(6px) } }` at 240ms, applied to `.container`-level content **excluding** the hero and page `h1` (so LCP is not delayed). Do not ship both.
- **Dependencies:** Phase 2 tokens.
- **Regression risk:** LCP (measure before/after; must not regress by >50ms); CLS must stay 0 (transform/opacity only); browser test reads `.article-card` count right after navigation (elements exist even when pending — fine) and takes full-page screenshots (cards below the fold may be captured mid-pending; acceptable, or scroll before capture). Anchor jumps (`/writing/x#section-y`) must still land on visible content: reveal is not applied inside `.prose`.
- **Acceptance:** on first load the hero settles within 800ms and `h1` is opaque at first paint; scrolling the homepage reveals each card once, never re-hides; with JS disabled all content is visible; reduced motion: no animation, no hidden content; navigating between sections crossfades while the header stays put; Lighthouse LCP/CLS within tolerance of Phase 0.

### Phase 4 — Reading experience (H6, H10, H11)

- **Goal:** long entries are easy to navigate.
- **Files:** new `components/Toc.jsx` (client), new `components/CopyButton.jsx` (client), `components/EntryPage.jsx`, `components/CodeBlock.jsx`, `globals.css`, new `app/(site)/{writing,projects,progress}/[slug]/loading.js`, `app/(site)/writing/page.js`.
- **Approach:**
  - **Toc:** move the TOC markup from `EntryPage` into `Toc.jsx` (props: `headings`). Render `<aside className="toc"><details><summary>On this page <span>({n})</span></summary><nav aria-label="On this page"><ol>…</ol></nav></details></aside>`; keep the visually-styled `h2` text inside the summary for desktop. On mount set `details.open = matchMedia("(min-width: 64.01rem)").matches` and update on change (SSR default closed: no mobile layout shift; on desktop the TOC is in its own grid column so opening does not move the article). At ≥64rem hide the summary marker and make it non-interactive via CSS. Scrollspy: one `IntersectionObserver` on the heading elements, `rootMargin: "-96px 0px -70% 0px"`; the last intersecting heading's link gets `aria-current="location"`. CSS: `.toc a { border-left: 2px solid transparent; padding-left: .75rem; transition: color var(--dur-1), border-color var(--dur-1) } .toc a[aria-current] { color: var(--amber); border-left-color: var(--amber) }`. On mobile, tapping a TOC link closes the details.
  - **Reading progress bar (CSS only):** in `EntryPage` add `<div className="read-progress" aria-hidden="true" />`. CSS: `position:fixed; top: var(--header-height); left:0; right:0; height:2px; background: var(--amber); transform-origin:left; transform: scaleX(0); z-index:19;` inside `@supports (animation-timeline: scroll())` and `prefers-reduced-motion: no-preference`: `animation: grow linear both; animation-timeline: scroll(root);` with `@keyframes grow { to { transform: scaleX(1) } }`. Unsupported browsers show nothing. Hide in print.
  - **Code copy:** `CodeBlock` always renders the `figcaption` bar (label falls back to "Code"); add `<CopyButton text={value.code} />` at the right. `CopyButton`: `navigator.clipboard.writeText`, label "Copy" → "Copied ✓" for 1600ms, `aria-live="polite"` on the label, hidden if `navigator.clipboard` is missing, hidden in print. Style as the existing mono 0.72rem text button; 44px hit area.
  - **Pending/loading:** `loading.js` for the three `[slug]` routes: skeleton matching `.entry-header` (three bars using `--surface-raised`, opacity pulse 1.2s, static under reduced motion). On `/writing` switch the form to `next/form` per the bundled doc and show a pending state (`aria-busy` + 60% opacity on the results list) using the documented hook; keep `role="search"`, the label, input id/name and button text.
- **Dependencies:** Phases 1–2.
- **Regression risk:** browser test clicks the TOC link "Follow the argument" inside `nav[aria-label="On this page"]` at 390px and expects `#section-arg` top ≥ 64: with the TOC collapsed on mobile the link is hidden → update the test to open the `<details>` first (deliberate test change; note it in the commit). `http-smoke` expects `aria-label="On this page"` in HTML: still present. Lightbox/code figure markup otherwise unchanged.
- **Acceptance:** at ≥1024px the current section is highlighted while scrolling and after anchor clicks; at 375px the TOC is one collapsed row that expands and closes on selection; progress bar tracks scroll in Chromium and is absent (not broken) elsewhere; copy puts exact code on the clipboard and announces "Copied"; search shows a pending state and still works with JS disabled; axe clean on entry pages.

### Phase 5 — Discovery (H7)

- **Goal:** every tag, topic and entry leads somewhere.
- **Files:** `lib/utils.mjs` (new `filterEntries`, `facetCounts`, `adjacentEntries`), `tests/content.test.mjs`, new `components/ArchiveFilters.jsx` (server), new `components/TagList.jsx` (server), new `components/EntryPager.jsx` (server), `app/(site)/{writing,projects,progress}/page.js`, card components, `components/EntryPage.jsx`, `globals.css`.
- **Approach:**
  - `filterEntries(entries, { q, category, tag })`: case-insensitive; `tag` matches `tags`, `technologies` or `subjects` depending on type; `q` matches title, summary, tags (body text optional, O4). Unit-test it.
  - `ArchiveFilters`: extract the existing search form + chip nav from `writing/page.js` unchanged in markup/classes; props `{ basePath, query, facets, active, label }`. Use it on all three archives: Writing (category chips + tag param), Projects (status chips; technology via tag param; search), Progress (subject chips; no search box until there are >12 entries). Hide the whole filter row when there is ≤1 facet value and ≤6 entries.
  - `TagList`: replaces the inline `<ul className="tags">`; each item links to `${basePath}?tag=${encodeURIComponent(t)}`. Inside cards the whole card is covered by `.card-title::after`; give tag links `position:relative; z-index:1` so they are clickable, with a 44px-tall hit area via padding and hover underline.
  - Active filter state: the existing `.archive-count` row shows "N entries · tagged #x" plus the existing "Clear filters ×" link. Keep `alternates.canonical` pointing at the unfiltered archive.
  - `EntryPager` at the end of `EntryPage` (before related): `adjacentEntries(list, slug)` over the same-type list sorted by date; two-column row "← Older: title" / "Newer: title →", mono label + serif title, stacked at ≤40rem. For progress use month labels ("October 2026").
  - Related for projects: up to 2 other projects sharing a technology, rendered with `ProjectCard` in `.project-grid`. Writing related stays as is.
- **Dependencies:** Phase 1 (non-empty tag lists), Phase 2 (hover styles).
- **Regression risk:** `/writing?q=shorter` test expects exactly one `.article-card` and the URL pattern `**/writing?q=shorter`: keep param names `q` and `category`. Card click target must still cover the card except the tags. Heading order inside the pager (use `h2` sr-only "More entries").
- **Acceptance:** clicking any tag on any card or entry lands on a filtered archive with correct count and a working clear link; filters combine with search; previous/next present on every entry with a neighbor and absent otherwise; unit tests cover filter and adjacency; no nested interactive elements (axe).

### Phase 6 — Progress and growth views (H8)

- **Goal:** the Progress section shows trajectory, not just a list.
- **Files:** `app/(site)/progress/page.js`, new `components/HoursChart.jsx` (server, no JS), `components/ProgressCard.jsx`, `globals.css`.
- **Approach:**
  - `HoursChart`: rendered only when ≥2 entries have `studyHours`. Last 12 months, oldest → newest, as a `<ol className="hours-chart">` of `<li>` bars: each bar a link to that month's entry, height = hours / max (CSS custom property `--h`), amber for the latest month and `--muted` for the rest, month initial below, hours as visually-hidden text plus `title`. Months without a log render an empty slot. Above it a one-line caption "Hours studied per month". At ≤40rem the chart keeps full width with narrower bars (no horizontal scroll). Bars grow with `transform: scaleY` from 0, `transform-origin: bottom`, `var(--dur-3)`, stagger 30ms, triggered by `data-reveal` from Phase 3.
  - Subject totals: under `.stats`, a compact list "Mathematics · 3 logs · 96 h" for the top 6 subjects (hours attributed to every subject listed on a log; label it "logged alongside"). Each links to `/progress?tag=subject`.
  - Timeline rail: `.progress-year` gets a left rule (`border-left: 1px solid var(--border)`) with a 7px amber-outlined dot per `.progress-card` aligned to the stamp; at ≤40rem the rail sits at the container edge with 1rem indent. Pure CSS.
  - Keep the three existing stat tiles; no count-up.
- **Dependencies:** Phase 3 (reveal), Phase 5 (subject filter). Most meaningful after H1 (real logs in `progress`).
- **Regression risk:** overflow at 320px; empty and single-entry states must look intentional (chart hidden, rail still fine).
- **Acceptance:** with fixtures extended to ≥3 months (add to `content/preview.json`), chart renders with correct relative heights, each bar is keyboard-reachable with an accessible name ("August 2026: 42 hours"), no overflow at 320px, page still correct with 0, 1 and 2 entries.

### Phase 7 — SEO, sharing and housekeeping (O1–O8, as chosen)

- **Goal:** finish the edges. Each item is independent; do only those the owner selects.
- **Files:** `app/(site)/page.js` (JSON-LD via existing `jsonLd` helper), `app/opengraph-image/route.js` or per-route `opengraph-image.js` (read the bundled metadata doc first), new `app/api/revalidate/route.js`, `next.config.js`, `lib/content.js`, `components/HeroSection.jsx`.
- **Acceptance per item:** JSON-LD validates; entry OG image shows the entry title; webhook with wrong secret returns 401 and a correct one revalidates the tagged type; CSP in report-only produces no violations on site pages and is not applied to `/studio`.

### Owner-gated track — content reclassification (H1)

Can run any time; code phases do not depend on it. The implementing agent prepares, the owner executes.

1. Owner: `npx sanity dataset export production backup.tar.gz` (keep it as the backup).
2. Agent: write a map file per `content/migration-map.example.json` (essay → `writing`, March/April logs → `progress` with `month`), run `scripts/migrate-content.mjs` on the exported NDJSON, hand the output and generated `legacy-routes.json` to the owner for review.
3. Owner: import the reviewed output, fill `studyHours`/`subjects`/`category` in Studio, unpublish the old project documents, commit `content/legacy-routes.json` (activates 301s from `/projects/...`).
4. Acceptance: `/writing` and `/progress` list the moved entries; old URLs 301 to new ones; RSS has items; no duplicates under Projects.

---

## 4. Completion checklist

- [ ] P0: check + browser tests green in both modes; Lighthouse baseline recorded; docs versions corrected
- [ ] P1: home title has site name; numbering contiguous; no empty tag lists; legacy-`h1` TOC; ≥11px text; month-only log date; error page logs + links home; privacy wording + `seo.noindex` honored in meta/sitemap/feed
- [ ] P2: motion tokens; arrow/underline/card/button states; status-dot pulse; lightbox and mobile-menu transitions; menu closes on outside tap/blur
- [ ] P3: hero entrance (h1 opaque at first paint); one-shot scroll reveal; route crossfade with anchored header; no-JS and reduced-motion show everything
- [ ] P4: scrollspy TOC, collapsible on mobile; reading progress bar; code copy; loading skeletons; pending search state
- [ ] P5: clickable tags; shared filters on all archives; previous/next; related projects; unit tests
- [ ] P6: hours chart; subject totals; timeline rail; correct at 0/1/2+ entries and 320px
- [ ] P7: selected optional items
- [ ] Content reclassified (owner)
- [ ] Every phase: `npm run check` and `npm run test:browser` (both modes) green; axe clean; no overflow at 320/375/768/1024/1440; reduced-motion pass; LCP/CLS not worse than baseline
- [ ] `git status` shows only intended files

## 5. Open questions

1. **Reclassification:** do you want the essay moved to Writing and the two study logs moved to Progress (with redirects from the old `/projects/...` URLs)? This is the single biggest improvement and needs you to run the Sanity export/import.
2. **Privacy:** are monthly study logs meant to be publicly indexed? If not, should new logs default to `noindex`? Is the Sanity dataset intentionally public?
3. **Contact:** GitHub URL and email for `content/site.json` (both empty now), or leave contact off the site?
4. **Section numerals:** OK to drop "01 /"–"04 /" from page eyebrows and keep dynamic numbers only on the homepage? Alternative: keep fixed numbers everywhere and renumber the homepage to match.
5. **Route transitions:** acceptable to use Next's view-transition support if the bundled guide requires an experimental flag, or prefer the plain CSS fallback?
6. **Optional items:** which of O1–O8 do you want (per-entry OG images, instant publish webhook, body-text search, combined feed, CSP, etc.)?
7. **Generated files:** `next dev` created `AGENTS.md` and `CLAUDE.md` during this audit. Commit them (Next re-creates them otherwise), add them to `.gitignore`, or delete?
8. **Fonts:** stay on system fonts (Arial/Georgia, as now), or is one self-hosted typeface for headings in scope later? Not planned here.
