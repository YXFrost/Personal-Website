# Website UX, UI, and animation audit

## 1. Overall assessment

**The saved redesign is ready for a focused usability pass. The public site is still serving the older version.** I verified that the live homepage sends readers to an empty Writing archive and advertises `localhost` as its canonical URL. The saved build uses Inter, opens the latest essay directly, and puts the study logs under Progress. Deploying it would resolve several of the most visible problems. [Public site](https://monthlyupdate.vercel.app/)

The saved version feels like a coherent personal publication. Inter gives the interface a clearer hierarchy, Georgia suits the essays, and the charcoal and amber palette gives it a recognizable identity. The main weaknesses now are how long it takes to reach the actual reading on mobile and how the entrance and scroll animations affect keyboard navigation.

## 2. Detailed design audit

| Page or section | What I found and why it matters | Recommended change | Priority |
|---|---|---|---|
| **Public Home, Writing, and 404** | The primary CTA opens an empty Writing archive. At 320 px, a permitted 150-character search query widens the live page to **978 px**. An unknown path shows a bare 404 without a recovery link. I verified the corresponding fixes in the saved build. | Deploy the saved version after the keyboard fix below. Smoke-test the homepage CTA, long search, legacy redirects, 404 recovery, and production canonical URLs. | **High** |
| **Home and shared scroll animation** | In the saved build, rapid Tab presses reached “All projects” and several study-log links while their parent elements were still at **`opacity: 0`**. Smooth scrolling also took time to catch up with focus. Users can lose track of where they are. | Keep interactive content visible from first render. If scroll reveals remain, bypass them immediately on `:focus-within` and let keyboard focus and skip links scroll into view without animation. Test rapid Tab and Shift+Tab at 390 and 1440 px. [RevealObserver](D:/website/my-portfolio/components/RevealObserver.jsx:14) · [WCAG Focus Visible](https://www.w3.org/TR/WCAG22/#focus-visible) | **High** |
| **Essay and study-log details** | At 390 × 844 in the saved build, the essay’s cover occupies **558 px** and pushes its contents list to **y=1155** and its body to **y=1273**. Both study-log bodies begin around **y=883**. The mobile contents link scrolls correctly and closes, but focus lands on `body`. | Put the mobile contents disclosure below the title and summary. Move the full cover into the article or use a compact cover thumbnail beside the metadata. On a contents selection, focus the destination heading and preserve its URL fragment. Keep the native image dialog. Escape and focus restoration worked. [Mobile essay](C:/Users/WINDOWS/.codex/visualizations/2026/11/16/01a1e54e-baee-7823-9833-74b34308a39f/motion-local-essay.png) · [Entry layout](D:/website/my-portfolio/components/EntryPage.jsx:132) · [GOV.UK contents-list pattern](https://components.publishing.service.gov.uk/component-guide/contents_list) | **High** |
| **Writing archive** | The saved archive puts a full search form above its only essay. During a simulated one-second search delay, the results dimmed and `aria-busy` changed, but the button still read “Search” and the previous count remained on screen. | Lead with the essay while the archive is small. When search is useful, show “Searching…” in the same-width button and announce the updated count when results arrive. Keep the working Clear behavior, which returned focus to the input. [SearchSubmit](D:/website/my-portfolio/components/SearchSubmit.jsx:5) · [Nielsen’s visibility of system status](https://www.nngroup.com/articles/ten-usability-heuristics/) | **Medium** |
| **Progress archive** | At 390 × 844, the saved page shows totals, a subject breakdown, and subject filters before the first log title at **y=989**. Both subjects point to the same two logs, so the repeated options add little at this size. | Put the latest logs immediately after the introduction. Use one compact subject filter when it meaningfully changes the list. Put the overview below the logs and use the same Inter styling for subject links as for archive filters. [Mobile Progress](C:/Users/WINDOWS/.codex/visualizations/2026/11/16/01a1e54e-baee-7823-9833-74b34308a39f/motion-local-progress.png) | **Medium** |
| **Projects** | The saved archive is empty after the essay and logs were reclassified. The navigation still promises a portfolio section, but a visitor evaluating the author’s work reaches an empty state. | Publish one genuine case study, such as the notebook itself. Lead with the problem, the author’s role, and the result. Let the screenshot support that explanation. | **Medium** |
| **Home motion and About** | The saved hero uses a **480 ms** entrance with delays up to **260 ms**, an indefinite status pulse, and a mouse-following glow. None of those effects communicates a change in state. On About, the heading and introduction are less specific than the biography below them. These are editorial and motion judgments. | Make the hero CTA fully visible on first paint and leave the status dot static. Keep the grid and consider a stationary glow. Use brief motion for controls that respond to an action. Give About one concrete sentence about the author’s current work and link it to a representative entry. [HeroGlow](D:/website/my-portfolio/components/HeroGlow.jsx:19) · [About](D:/website/my-portfolio/app/(site)/about/page.js:9) | **Low** |

## 3. Ratings

These are expert-review scores for the versions I could inspect.

| Area | Public | Saved | Basis |
|---|---:|---:|---|
| UX | 5/10 | 7/10 | The saved build gives readers real destinations. Mobile discovery still takes too much scrolling. |
| UI | 6/10 | 8/10 | The typography and visual identity are clearer. Archive layouts need to reflect how little content they currently hold. |
| Animations | 6/10 | 6/10 | The live motion is restrained. The saved build has useful dialog and control feedback, but decorative reveals interfere with focus. |
| Responsiveness | 6/10 | 8/10 | Default layouts held at the tested widths. The saved build fixes long-query reflow. |
| Accessibility | 6/10 | 7/10 | Skip link, mobile menu Escape, dialog focus restoration, and reduced motion worked. The saved build still has the keyboard reveal defect. |
| Performance, sampled | 8/10 | 7/10 | Both samples were stable. The saved essay’s cover was its largest visible element and is the strongest optimization candidate. |
| Consistency | 6/10 | 8/10 | The saved build has a more coherent type system and branded recovery page. |
| Overall quality | 6/10 | 7/10 | The saved version has a solid foundation. Release and simplify the reading paths before adding more visual effects. |

I ran **72 route-width checks** across 320, 390, 768, and 1440 px and **10 axe scans**. Axe reported zero violations in the sampled default states and flagged some contrast checks for manual review. Under one throttled mobile run per route, LCP was **0.80–2.03 s public** and **1.49–1.99 s local**. Sampled CLS stayed below **0.003**. **Not assessed** were field Core Web Vitals, screen-reader output, Safari and Firefox, physical touch devices, and authenticated Studio. [Browser evidence](C:/Users/WINDOWS/.codex/visualizations/2026/11/16/01a1e54e-baee-7823-9833-74b34308a39f/motion-audit-evidence.json) · [Keyboard and public load evidence](C:/Users/WINDOWS/.codex/visualizations/2026/11/16/01a1e54e-baee-7823-9833-74b34308a39f/motion-targeted-evidence.json) · [Web Vitals](https://web.dev/articles/vitals)

## 4. Prioritized improvement plan

1. **Essential · High impact · Low effort.** Remove the focus-dependent reveal problem and ship the saved build with a production smoke test.
2. **Essential · High impact · Medium effort.** Bring the contents and opening text forward on mobile. Verify heading focus after a jump and remeasure the essay once the cover moves.
3. **Next · Medium impact · Low to medium effort.** Lead Writing and Progress with their entries, improve search feedback, and publish one credible project case study.
4. **Optional · Low effort.** Remove the continuous pulse, simplify the hero entrance, and refine the About introduction.

## 5. Final recommendation

Put the work first. On mobile, give readers a visible entry to open on the archive and an immediate way to start reading or jump to a section on the detail page. Keep short hover, pressed, and dialog transitions where they explain an interaction. Start around **120–160 ms for control feedback** and **180–220 ms for dialogs**, with the existing reduced-motion behavior preserved. The notebook’s typography and palette already provide enough character to carry the design.

This was a read-only audit.
