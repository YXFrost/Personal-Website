import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  normalize,
  isPublished,
  readingTime,
  headingId,
  safeUrl,
  escapeXml,
  jsonLd,
  entryPath,
} from "../lib/utils.mjs";
test("legacy project records retain their URLs, write-up, images and links", () => {
  const old = {
    _type: "project",
    slug: { current: "old-project" },
    description: "Summary",
    longDescription: [
      { _type: "block", children: [{ text: "A legacy paragraph" }] },
    ],
    image: { asset: { _ref: "old" } },
    tags: ["Python"],
    liveUrl: "https://example.com",
    _createdAt: "2025-01-01",
  };
  const doc = normalize(old);
  assert.equal(entryPath(doc), "/projects/old-project");
  assert.equal(doc.summary, "Summary");
  assert.equal(doc.body, old.longDescription);
  assert.equal(doc.coverImage, old.image);
  assert.deepEqual(doc.technologies, ["Python"]);
  assert.equal(doc.demoUrl, old.liveUrl);
});
test("unpublished, draft and future entries are excluded", () => {
  const now = new Date("2026-01-01").getTime();
  assert.equal(isPublished({ _id: "drafts.x" }, now), false);
  assert.equal(isPublished({ published: false }, now), false);
  assert.equal(isPublished({ publishedAt: "2027-01-01" }, now), false);
  assert.equal(isPublished({ publishedAt: "2025-01-01" }, now), true);
});
test("links reject executable and protocol-relative URLs", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.test",
    "/\\evil.test",
    " javaScript:alert(1)",
  ])
    assert.equal(safeUrl(value, { relative: true }), undefined);
  assert.equal(safeUrl("/writing", { relative: true }), "/writing");
  assert.equal(safeUrl("https://example.com"), "https://example.com");
});
test("heading IDs remain unique for duplicate titles and stable across edits", () => {
  const a = { _key: "first", children: [{ text: "Introduction" }] },
    b = { ...a, _key: "second" };
  assert.notEqual(headingId(a), headingId(b));
  assert.equal(
    headingId({ ...a, children: [{ text: "Changed" }] }),
    headingId(a),
  );
});
test("XML and structured data are escaped without changing their contents", () => {
  assert.equal(escapeXml("A & <B>"), "A &amp; &lt;B&gt;");
  const value = { name: "</script><script>alert(1)</script>" };
  assert.ok(!jsonLd(value).includes("<"));
  assert.deepEqual(JSON.parse(jsonLd(value)), value);
});
test("reading estimates count words and support absent bodies", () => {
  assert.equal(readingTime(), 1);
  assert.equal(readingTime([{ children: [{ text: "word ".repeat(441) }] }]), 3);
});
test("local content has unique slugs and valid public fields", () => {
  for (const file of ["writing", "projects", "progress", "preview"]) {
    const docs = JSON.parse(
      readFileSync(new URL(`../content/${file}.json`, import.meta.url)),
    );
    const seen = new Set();
    for (const raw of docs) {
      const d = normalize(raw);
      assert.ok(d.title);
      assert.match(d.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.ok(!seen.has(entryPath(d)));
      seen.add(entryPath(d));
      if (d.coverImage) assert.ok(d.coverImage.alt);
      if (d.publishedAt)
        assert.ok(!Number.isNaN(new Date(d.publishedAt).getTime()));
    }
  }
});

test('offline migration preserves originals and generates explicit URL redirects', async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const dir = mkdtempSync(join(tmpdir(), 'yn-migration-'));
  try {
    const original = {_id:'log-1',_type:'project',_rev:'revision',_createdAt:'2025-01-01',slug:{current:'january'},title:'January',description:'Study log',longDescription:[{_type:'block',_key:'one',children:[{text:'Original text'}]}],image:{asset:{_ref:'image-id'}}};
    const input = join(dir,'data.ndjson'), map = join(dir,'map.json'), out = join(dir,'out.ndjson');
    writeFileSync(input,JSON.stringify(original)+'\n');
    writeFileSync(map,JSON.stringify([{id:'log-1',type:'progress',month:'2025-01-01'}]));
    execFileSync(process.execPath,['scripts/migrate-content.mjs',input,map,out]);
    assert.deepEqual(JSON.parse(readFileSync(input)),original);
    const migrated = JSON.parse(readFileSync(out));
    assert.equal(migrated._id,'progress.log-1');assert.equal(migrated._type,'progress');assert.deepEqual(migrated.body,original.longDescription);assert.deepEqual(migrated.coverImage,original.image);
    assert.deepEqual(JSON.parse(readFileSync(join(dir,'legacy-routes.json'))),[{source:'/projects/january',destination:'/progress/january'}]);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
