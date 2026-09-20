import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
const base = process.env.TEST_URL || "http://localhost:3000";
const preview = process.env.TEST_PREVIEW === "1";
const output = process.env.TEST_OUTPUT || "test-results";
mkdirSync(output, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "yn-browser-"));
const extension = resolve("tests/zoom-extension");
const nativeZoom = process.env.TEST_NATIVE_ZOOM === "1";
const engine = nativeZoom ? null : await chromium.launch({ headless: true });
const browser = nativeZoom
  ? await chromium.launchPersistentContext(profile, {
      channel: "chromium",
      ignoreDefaultArgs: ["--disable-extensions"],
      headless: true,
      viewport: { width: 1440, height: 1000 },
      args: [
        `--disable-extensions-except=${extension}`,
        `--load-extension=${extension}`,
      ],
    })
  : await engine.newContext({ viewport: { width: 1440, height: 1000 } });
const page = browser.pages()[0] || (await browser.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") errors.push(m.text());
});
const routes = [
  "/",
  "/writing",
  "/projects",
  "/projects/personal-website",
  "/progress",
  "/about",
  ...(preview
    ? [
        "/writing/reading-specimen",
        "/writing/margin-notes",
        "/progress/sample-month",
        "/projects/gallery-specimen",
        "/projects/legacy-compatibility",
      ]
    : []),
];
const results = {
  preview,
  zoomMode: nativeZoom
    ? "native"
    : "equivalent viewport reflow (not native zoom)",
  layouts: [],
  accessibility: [],
  zoom: [],
};
async function layout(label) {
  const result = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    brokenImages: [...document.images]
      .filter((i) => i.complete && !i.naturalWidth)
      .map((i) => i.src),
    headings: document.querySelectorAll("h1").length,
  }));
  assert.ok(
    result.scroll <= result.width + 1,
    `${label}: overflow ${result.scroll} > ${result.width}`,
  );
  assert.deepEqual(result.brokenImages, [], `${label}: images`);
  assert.equal(result.headings, 1, `${label}: h1 count`);
  return result;
}
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: "load" });
      assert.equal(response.status(), 200, route);
      results.layouts.push({
        route,
        width,
        ...(await layout(`${route} ${width}`)),
      });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load" });
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
      .analyze();
    results.accessibility.push({
      route,
      violations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
  }
  assert.ok(
    results.accessibility.every((r) => r.violations.length === 0),
    JSON.stringify(
      results.accessibility.filter((r) => r.violations.length),
      null,
      2,
    ),
  );
  await page.goto(base + "/");
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").textContent(), "Skip to content");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(":focus").getAttribute("id"), "main-content");
  await page.goto(base + "/projects/personal-website");
  const imageTrigger = page.getByRole("button", { name: /^Enlarge image/ }).first();
  await imageTrigger.focus();
  await page.keyboard.press("Enter");
  assert.ok(await page.getByRole("dialog").isVisible());
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Tab");
    assert.ok(await page.locator(":focus").evaluate((node) => Boolean(node.closest("dialog"))));
  }
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.ok(await imageTrigger.evaluate((node) => node === document.activeElement));
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden");
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.locator(".menu-toggle");
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Escape");
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  assert.ok(await toggle.evaluate((e) => e === document.activeElement));
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Writing", exact: true })
    .click();
  await page.waitForURL("**/writing");
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  if (preview) {
    await page.getByLabel("Find an essay or topic").fill("shorter");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page.waitForURL("**/writing?q=shorter");
    assert.equal(await page.locator(".article-card").count(), 1);
    await page.goto(base + "/writing/reading-specimen", { waitUntil: "load" });
    assert.equal(await page.locator(".prose strong").count(), 1);
    assert.ok(await page.locator(".prose em").count());
    assert.ok(await page.locator(".prose ul ul").count());
    assert.ok((await page.locator(".katex").count()) >= 2);
    assert.ok(
      await page.locator("pre").evaluate((e) => e.scrollWidth > e.clientWidth),
    );
    assert.ok(
      await page
        .locator(".table-scroll")
        .evaluate((e) => e.scrollWidth > e.clientWidth),
    );
    await page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("link", { name: "Follow the argument" })
      .click();
    await page.waitForTimeout(400);
    assert.ok(
      await page
        .locator("#section-arg")
        .evaluate((e) => e.getBoundingClientRect().top >= 64),
    );
    assert.equal(
      await page.locator('meta[name="robots"]').getAttribute("content"),
      "noindex, nofollow",
    );
  }
  const feed = await (await page.request.get(base + "/feed.xml")).text();
  if (preview) assert.ok(!feed.includes("<item>"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Native browser zoom via Chrome's tabs API. No CSS zoom or viewport substitution.
  if (nativeZoom) {
    const worker =
      browser.serviceWorkers()[0] ||
      (await browser.waitForEvent("serviceworker", { timeout: 10000 }));
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const factor of [0.8, 1, 1.25, 1.5, 2]) {
      await worker.evaluate(
        async ({ base, factor }) => {
          const tabs = await chrome.tabs.query({});
          const tab = tabs.find((t) => t.url?.startsWith(base));
          await chrome.tabs.setZoom(tab.id, factor);
        },
        { base, factor },
      );
      for (const route of [
        "/",
        "/writing",
        "/projects/personal-website",
        ...(preview ? ["/writing/reading-specimen"] : []),
      ]) {
        await page.goto(base + route, { waitUntil: "load" });
        const actual = await worker.evaluate(async (base) => {
          const tabs = await chrome.tabs.query({});
          return chrome.tabs.getZoom(
            tabs.find((t) => t.url?.startsWith(base)).id,
          );
        }, base);
        assert.ok(
          Math.abs(actual - factor) < 0.01,
          "Native zoom did not apply",
        );
        results.zoom.push({
          factor,
          actual,
          route,
          ...(await layout(`${route} at ${factor * 100}% zoom`)),
        });
      }
    }
    await worker.evaluate(async (base) => {
      const tabs = await chrome.tabs.query({});
      await chrome.tabs.setZoom(
        tabs.find((t) => t.url?.startsWith(base)).id,
        1,
      );
    }, base);
  } else {
    for (const factor of [0.8, 1, 1.25, 1.5, 2]) {
      await page.setViewportSize({
        width: Math.round(1440 / factor),
        height: Math.round(1000 / factor),
      });
      for (const route of [
        "/",
        "/writing",
        "/projects/personal-website",
        ...(preview ? ["/writing/reading-specimen"] : []),
      ]) {
        await page.goto(base + route, { waitUntil: "load" });
        results.zoom.push({
          factor,
          route,
          ...(await layout(`${route} at equivalent ${factor * 100}% reflow`)),
        });
      }
    }
  }
  for (const [width, height, name, route] of [
    [1440, 1000, "home-desktop", "/"],
    [390, 844, "home-mobile", "/"],
    [1440, 1000, "project-desktop", "/projects/personal-website"],
    ...(preview
      ? [
          [1440, 1000, "article-desktop", "/writing/reading-specimen"],
          [390, 844, "article-mobile", "/writing/reading-specimen"],
        ]
      : []),
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(base + route, { waitUntil: "load" });
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
  }
  // An actual missing slug must return 404, not an empty article with HTTP 200.
  const missing = await page.request.get(base + "/writing/not-a-real-entry");
  assert.equal(missing.status(), 404);
  assert.deepEqual(
    errors,
    [],
    `Browser console errors/warnings: ${errors.join("\n")}`,
  );
  results.status = "passed";
  console.log(
    `Passed ${results.layouts.length} layouts, ${results.accessibility.length} accessibility audits, ${results.zoom.length} zoom/reflow checks, keyboard/menu/search/rich-text checks.`,
  );
} finally {
  writeFileSync(
    `${output}/browser-results.json`,
    JSON.stringify({ ...results, errors }, null, 2),
  );
  await browser.close();
  await engine?.close();
  rmSync(profile, { recursive: true, force: true });
}
