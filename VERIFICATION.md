# Verification of the reconciled version

Checked 20 September 2026. These results concern this combined project, not the older redesign's previous Lighthouse or browser scores.

## Passed

- Installation with the reconciled dependency manifest; `npm ci --dry-run` accepts the synchronized lockfile.
- ESLint: no errors or warnings in the final source.
- Eight automated content tests: legacy field mapping and URLs, publishing rules, safe links, stable heading anchors, XML/JSON escaping, reading estimates, local content integrity, and offline migration preserving originals.
- Production build on Next.js 16.2.1 / React 19.2.4, using Node 24.19.0.
- Production build with labeled layout specimens enabled.
- HTTP smoke checks for homepage, About, Writing, Progress, Projects, local project detail, Studio's unconfigured state, sitemap, robots, RSS and social image.
- Extra specimen routes: long-form article, shorter article, gallery project, monthly progress, original-schema project.
- Server-rendered rich text: bold, emphasis, quotes, tables, mathematics, TOC, legacy h5/underline, code filename and syntax highlighting, captions and old demo URL. Unsafe JavaScript links do not render as links.
- Responsive image markup includes dimensions and srcset. Native-zoom-restricting viewport settings are absent. Homepage anchors /#home and /#projects are present.
- Image-enlarge buttons and modal-dialog markup render. Browser interaction is still to be verified below.
- Math stylesheet is absent from homepage markup and present on math articles; preview fixtures excluded from RSS.
- Missing article returns actual HTTP 404 rather than a streamed 200.
- Security response headers are present.
- Sanity schema extraction compiles the document models; code plugin registered once and filename field retained. This was local schema extraction, not a CMS write.

## Not verified here — check before production

- Live Sanity data, login, editing, publishing, CDN image retrieval and exact existing project slugs: your actual project ID/dataset/content were not provided. Synthetic old-schema fixtures were used instead.
- Fresh visual checks at 320/390/768/1024/1440/1920px; no-overflow checks; native browser zoom at 80/100/125/150/200%; keyboard navigation; lightbox focus behavior; axe accessibility; browser console output; Lighthouse and real Core Web Vitals. Browser automation was attempted but Chromium launch was blocked by runtime process/socket permissions. Earlier redesign scores are not claimed for this reconciliation.
- The Windows PowerShell installer was reviewed but could not be executed on this Linux environment (PowerShell unavailable). It defaults to a non-mutating preview, requires a clean non-main Git branch and backs up replaced source. Read its plan before applying it.
- GitHub/Vercel deployment: nothing has been pushed, merged or deployed.

## Known non-fatal dependency notices

The inherited Sanity CLI tree reports an @sanity/telemetry peer-version warning. Installation, Next build and Sanity schema extraction complete. Browserslist reports an aging browser dataset. No forced dependency upgrades were applied. A runtime-specific npm http-proxy configuration notice is from this environment, not application code.

## Before merging

Follow START-HERE.md: verify real CMS content locally, use the preview branch, check mobile and browser zoom, verify Studio and links, then merge only after review. Existing content is NOT automatically reclassified or rewritten.
