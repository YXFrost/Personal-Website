import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
const port = process.env.TEST_PORT || "3101";
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", port], { stdio: ["ignore", "pipe", "pipe"], env: process.env });
let logs = "";
server.stdout.on("data", (data) => { logs += data; });
server.stderr.on("data", (data) => { logs += data; });
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(logs);
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
    await setTimeout(200);
  }
  assert.ok(ready, "Production server starts");
  const routes = ["/", "/about", "/writing", "/progress", "/projects", "/projects/personal-website", "/studio", "/sitemap.xml", "/robots.txt", "/feed.xml", "/opengraph-image"];
  const isPreview = process.env.CONTENT_PREVIEW === "1";
  if (isPreview) routes.push("/writing/reading-specimen", "/writing/margin-notes", "/projects/gallery-specimen", "/progress/sample-month", "/projects/legacy-compatibility");
  for (const route of routes) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    console.log(`PASS ${route}`);
  }
  assert.equal((await fetch(base + "/writing/not-a-real-entry")).status, 404);
  const home = await (await fetch(base)).text();
  assert.match(home, /width=device-width, initial-scale=1/);
  assert.ok(!home.includes("user-scalable=no"));
  assert.ok(!home.includes("maximum-scale=1"));
  assert.match(home, /id="home"/);
  assert.match(home, /id="projects"/);
  const project = await (await fetch(base + "/projects/personal-website")).text();
  assert.match(project, /<dialog/);
  assert.match(project, /aria-haspopup="dialog"/);
  assert.match(project, /srcset=/i);
  if (isPreview) {
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
} finally { server.kill("SIGTERM"); }
