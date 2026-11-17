import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
const port = process.env.TEST_PORT || "3101";
const target = process.env.TEST_URL;
const base = target ? new URL(target).origin : `http://127.0.0.1:${port}`;
const server = target ? null : spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", port], { stdio: ["ignore", "pipe", "pipe"], env: process.env });
let logs = "";
server?.stdout.on("data", (data) => { logs += data; });
server?.stderr.on("data", (data) => { logs += data; });
try {
  let ready = false;
  for (let i = 0; i < (server ? 100 : 1); i++) {
    if (server && server.exitCode !== null) throw new Error(logs);
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
    await setTimeout(200);
  }
  assert.ok(ready, "Production server starts");
  const routes = ["/", "/about", "/writing", "/progress", "/projects", "/studio", "/sitemap.xml", "/robots.txt", "/feed.xml", "/opengraph-image"];
  const isPreview = process.env.TEST_PREVIEW === "1" || process.env.CONTENT_PREVIEW === "1";
  if (isPreview) routes.push("/projects/personal-website", "/writing/reading-specimen", "/writing/margin-notes", "/projects/gallery-specimen", "/progress/sample-month", "/projects/legacy-compatibility");
  for (const route of routes) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    console.log(`PASS ${route}`);
  }
  assert.equal((await fetch(base + "/writing/not-a-real-entry")).status, 404);
  const unknown = await fetch(base + "/unknown-portfolio-path");
  assert.equal(unknown.status, 404);
  assert.match(await unknown.text(), /Back to the notebook/);
  const home = await (await fetch(base)).text();
  assert.match(home, /width=device-width, initial-scale=1/);
  assert.ok(!home.includes("user-scalable=no"));
  assert.ok(!home.includes("maximum-scale=1"));
  assert.match(home, /id="home"/);
  assert.match(home, /id="projects"/);
  if (process.env.TEST_SITE_ORIGIN) {
    const expected = new URL(process.env.TEST_SITE_ORIGIN);
    for (const path of ["/", "/writing", "/projects", "/progress", "/about"]) {
      const html = await (await fetch(base + path)).text();
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      assert.ok(canonical, `Canonical is rendered for ${path}`);
      assert.equal(new URL(canonical).href, new URL(path, expected).href, path);
      assert.match(html, /name="robots" content="index, follow"/);
      assert.match(html, /type="application\/rss\+xml"/);
    }
    const robots = await (await fetch(base + "/robots.txt")).text();
    assert.match(robots, /Allow: \//);
    assert.ok(robots.includes(new URL("/sitemap.xml", expected).href));
    const sitemap = await (await fetch(base + "/sitemap.xml")).text();
    assert.ok(sitemap.includes(new URL("/writing", expected).href));
    const feed = await (await fetch(base + "/feed.xml")).text();
    assert.ok(feed.includes(new URL("/feed.xml", expected).href));
  }
  if (process.env.TEST_LEGACY_MOVES === "1") {
    const projects = await (await fetch(base + "/projects")).text();
    assert.ok(projects.includes("/projects/personal-website"));
    assert.equal((await fetch(base + "/projects/personal-website")).status, 200);
    const moves = JSON.parse(await readFile(new URL("../content/legacy-routes.json", import.meta.url), "utf8"));
    for (const move of moves.filter((entry) => entry.documentId)) {
      const response = await fetch(base + move.source, { redirect: "manual" });
      assert.equal(response.status, 308, move.source);
      assert.equal(new URL(response.headers.get("location"), base).pathname, move.destination);
      const detail = await fetch(base + move.destination);
      assert.equal(detail.status, 200, move.destination);
      if (move.images) {
        const html = await detail.text();
        for (const image of Object.values(move.images)) {
          assert.ok(html.includes(image.alt));
          assert.ok(html.includes(image.caption));
        }
      }
    }
    const writing = await (await fetch(base + "/writing")).text();
    assert.ok(writing.includes(moves.find((move) => move.destination.startsWith("/writing/")).destination));
  }
  if (isPreview) {
    const project = await (await fetch(base + "/projects/personal-website")).text();
    assert.match(project, /<dialog/);
    assert.match(project, /aria-haspopup="dialog"/);
    assert.match(project, /srcset=/i);
    const article = await (await fetch(base + "/writing/reading-specimen")).text();
    for (const pattern of [/<strong>/, /<em>/, /<blockquote>/, /<table>/, /class="katex/, /math\/katex.min.css/, /aria-label="On this page"/]) assert.match(article, pattern);
    assert.ok(!home.includes('/math/katex.min.css'), "Math CSS is not loaded globally");
    const legacy = await (await fetch(base + "/projects/legacy-compatibility")).text();
    assert.match(legacy, /<h5/);
    assert.match(legacy, /legacy-example.js/);
    assert.match(legacy, /Original underlined text/);
    assert.match(legacy, /https:\/\/example.com\/legacy-demo/);
    assert.ok(!/href="javascript:/i.test(legacy));
    assert.match(legacy, /token/);
    const feed = await (await fetch(base + "/feed.xml")).text();
    assert.ok(!feed.includes("<item>"), "Preview content excluded from RSS");
  }
  console.log("PASS HTTP, legacy content, rich-text, image markup and metadata smoke checks");
} finally { server?.kill("SIGTERM"); }
