# Verification

Phase 0 baseline, 16 November 2026, branch `website-redesign`. Windows 10, Node 24.14.1, Next.js 16.3.5, React 19.3.0, Sanity 6.15.0, Playwright Chromium 140 (headless).

"Real content" means the Sanity dataset configured in `.env.local` (read-only queries). "Preview" means `CONTENT_PREVIEW=1` fixtures.

## Passed

- `npm run check`: ESLint clean, 8/8 unit tests, production build (real content: 15 routes, 3 project detail pages).
- `npm run build` with `CONTENT_PREVIEW=1`.
- `npm run test:browser`, real content: 36 layouts (6 routes × 320/390/768/1024/1440/1920, no horizontal overflow, no broken images, one `h1`), 6 axe audits (WCAG 2.0/2.1 A/AA + best practice) with 0 violations, 15 reflow checks, skip link, image-dialog focus containment and Escape focus return, mobile menu, 404 for missing entries, no console errors/warnings.
- `TEST_PREVIEW=1 npm run test:browser` against a preview build: 66 layouts, 11 axe audits with 0 violations, 20 reflow checks, search, rich text (bold, emphasis, nested lists, KaTeX, scrolling code and table), TOC anchor offset, preview noindex, feed has no fixture items. Intermittent: through `npm run test:browser` about half of the runs passed. It passed every time against an already-running server. See "Known issue" below.
- Desktop TOC column at 1440px is present beside the article (full-page screenshot `test-results/preview/article-desktop.png`).

## Performance baseline (not Lighthouse)

Measured with Playwright on `next start`, preview build, 390×844 at DPR 2, 4× CPU throttling, no network throttling, localhost. LCP and CLS are from the `PerformanceObserver` API. These are lab numbers for before/after comparison, not field data.

| Route | FCP | LCP | LCP element | CLS |
|---|---|---|---|---|
| `/` | 256 ms | 256 ms | hero `h1` | 0 |
| `/writing/reading-specimen` | 644 ms | 644 ms | `p.entry-summary` | 0 |
| `/progress` | 176 ms | 176 ms | `p` | 0 |

## Test changes made in Phase 0

- `tests/browser.mjs` no longer hardcodes `/projects/personal-website`, which exists only in the local JSON fallback and returns 404 on real content. It now uses the first project linked from `/projects` that has an enlargeable image (override with `TEST_PROJECT=/projects/<slug>`).
- The image-dialog focus check required focus to stay on an element inside the dialog for three Tabs. The dialog has one control, and Chromium moves focus to the browser UI when you tab past the last control of a native modal dialog (page `activeElement` becomes `body`). The check now asserts that focus starts in the dialog and never lands on page content outside it.

## Known issue: intermittent stall in preview browser runs

On this machine, with a freshly started `next start` serving the preview build, the browser test sometimes times out (30 s) waiting for `load` on a project page at 390 or 768 px. Findings:

- The pending request is a `/_next/image` optimization of `/images/personal-website.png` (or, when waiting for network idle, RSC prefetches of `/` and `/projects`).
- When that happens, the server still answers other routes in milliseconds, and the same URLs answer in about 2 ms from curl, both cold and with concurrent or aborted requests. Limiting libvips to one thread (`VIPS_CONCURRENCY=1`) did not help.
- Preview content makes no network calls, and no site code does render-time I/O. The stall did not occur against a warm server or in real-content mode.

The root cause is not identified. It sits between Chromium and the local Next 16.3.5 server, not in site code. Production on Vercel uses a different image service and was not tested.

## Phase 1 checks (16 November 2026)

- `npm run check`: 10/10 unit tests (new: legacy `h1` headings in the TOC, `seo.noindex` filter).
- Real content: browser suite passed (36 layouts, 6 axe audits, 0 violations). Home title is "YN — A personal notebook". Home sections are numbered 01–03 with no featured entry (01–04 in preview, which has one). No empty `ul.tags` on any route. The Crime and Punishment essay now shows a TOC. No visible text under 11px at 375px on the routes checked.
- Preview: the full browser suite passed once, against a manually started server. Runs through `npm run test:browser` hit the known stall. A server-side request log showed Next receiving a request (an RSC prefetch) and never answering it.
- Not exercised: the error page (no way to trigger it without adding test code) and a real `seo.noindex: true` document (covered by the unit test only; no dataset writes).

## Phases 2–6 checks (16 November 2026)

Each phase ended with `npm run check` and the browser suite against real content and against preview content (on a manually started server and through `npm run test:browser`), all passing. Phase-specific checks were run with throwaway Playwright scripts that were not committed:

- Phase 2: hover and focus states at 1280px (arrows, nav underline, card image zoom); no layout shift on hover. At 375px, closed menu links are not tabbable, and the menu animates open and closes on an outside tap or when focus leaves it. With reduced motion, `document.getAnimations()` returns 0 animations.
- Phase 3: the hero `h1` is opaque at first paint and the entrance ends at 740 ms. Scroll reveal runs once and never re-hides. Nothing is hidden without JS or with reduced motion. Navigation runs a view transition while the header stays still. LCP did not regress (`/` about 250 ms; reading specimen about 340 ms, now the `h1`); CLS 0.
- Phase 4: scrollspy follows scrolling and anchor clicks. The desktop TOC stays sticky. At 375px the TOC is collapsed and closes after a link is chosen. The progress bar tracks scroll. Copy writes the exact code (Windows returns CRLF line endings on read). Search shows aria-busy while pending and works without JS.
- Phase 5: every tag on every preview route lands on a filtered archive with the right count, the tag in each result and a working clear link. Search keeps an active tag. Previous/next links appear only when a neighbor exists, and related projects show up only when a project shares a technology. Clicking a card's text still opens the entry.
- Phase 6: chart bar heights are proportional to hours, each bar is reachable by keyboard with names like "August 2026: 42 hours", and nothing overflows at 320px. Real content (0 progress logs) shows only the empty state. The 0/1/2-log chart cases are covered by unit tests.

Test changes since Phase 0: wait for the image dialog fade-out before asserting it is gone; open the collapsed TOC before clicking it at 390px; wait for finite time-based animations before each axe audit.

## Not verified

- Lighthouse (not installed) and TBT. Real-device Core Web Vitals.
- Native browser zoom (`TEST_NATIVE_ZOOM=1` not run); reflow is checked with equivalent viewports.
- Sticky behavior of the desktop TOC while scrolling (screenshot only).
- Screen readers, real touch devices, Firefox and Safari.
- Sanity Studio, login and editing; dataset ACL; Vercel settings; the deployed site.
- `tests/http-smoke.mjs` (not part of `check`; it still hardcodes `/projects/personal-website` and only matches local or preview content).
