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
  getHeadings,
  isIndexable,
  filterEntries,
  facetCounts,
  adjacentEntries,
  hoursByMonth,
  subjectTotals,
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
test("legacy h1 sections appear in the table of contents as h2", () => {
  const block = (style, text, _key) => ({ _type: "block", style, _key, children: [{ text }] });
  const headings = getHeadings([
    block("h1", "Part one", "a"),
    block("normal", "Body text", "b"),
    block("h1", "Part two", "c"),
    block("h3", "Detail", "d"),
    block("h2", "Part three", "e"),
    block("h4", "Too deep", "f"),
    { _type: "code", code: "x" },
  ]);
  assert.deepEqual(headings, [
    { id: "section-a", title: "Part one", level: "h2" },
    { id: "section-c", title: "Part two", level: "h2" },
    { id: "section-d", title: "Detail", level: "h3" },
    { id: "section-e", title: "Part three", level: "h2" },
  ]);
});
test("entries marked noindex are excluded from sitemap and feed filters", () => {
  const entries = [
    { slug: "open" },
    { slug: "seo-empty", seo: {} },
    { slug: "hidden", seo: { noindex: true } },
    { slug: "explicit", seo: { noindex: false } },
  ];
  assert.deepEqual(
    entries.filter(isIndexable).map((d) => d.slug),
    ["open", "seo-empty", "explicit"],
  );
});
test("archive filters combine search, category and tag across entry types", () => {
  const docs = [
    { _type: "writing", slug: "a", title: "On Proofs", summary: "Induction", category: "Essay", tags: ["Mathematics", "Logic"] },
    { _type: "writing", slug: "b", title: "Margins", summary: "Short notes", category: "Note", tags: ["Reading"] },
    { _type: "project", slug: "c", title: "Site", summary: "Next.js", status: "Active", technologies: ["React", "CSS"], tags: [] },
    { _type: "progress", slug: "d", title: "May", summary: "Study", subjects: ["Mathematics"] },
  ];
  const slugs = (opts) => filterEntries(docs, opts).map((d) => d.slug);
  assert.deepEqual(slugs({}), ["a", "b", "c", "d"]);
  assert.deepEqual(slugs({ tag: "mathematics" }), ["a", "d"]);
  assert.deepEqual(slugs({ tag: "react" }), ["c"]);
  assert.deepEqual(slugs({ q: "LOGIC" }), ["a"]);
  assert.deepEqual(slugs({ q: "notes", category: "Note" }), ["b"]);
  assert.deepEqual(slugs({ q: "proofs", tag: "Reading" }), []);
  assert.deepEqual(slugs({ category: "Active", categoryField: "status" }), ["c"]);
  assert.deepEqual(facetCounts(["B", "A", "B", "", undefined, "C"]), [
    { value: "B", count: 2 },
    { value: "A", count: 1 },
    { value: "C", count: 1 },
  ]);
});
test("adjacent entries follow newest-first order and stop at the ends", () => {
  const list = [{ slug: "new" }, { slug: "mid" }, { slug: "old" }];
  assert.deepEqual(adjacentEntries(list, "mid"), { newer: list[0], older: list[2] });
  assert.deepEqual(adjacentEntries(list, "new"), { newer: null, older: list[1] });
  assert.deepEqual(adjacentEntries(list, "old"), { newer: list[1], older: null });
  assert.deepEqual(adjacentEntries(list, "missing"), { newer: null, older: null });
});
test("hours chart covers the twelve months up to the newest log", () => {
  const log = (month, studyHours, subjects = []) => ({ month, studyHours, subjects, slug: month });
  assert.deepEqual(hoursByMonth([]), []);
  assert.deepEqual(hoursByMonth([log("2026-08-01", 42)]), []);
  assert.deepEqual(hoursByMonth([log("2026-08-01", 42), { month: "2026-07-01", slug: "x" }]), []);
  const months = hoursByMonth([log("2026-08-01", 42), log("2026-06-01", 18), log("2025-12-01", 24), log("2024-01-01", 99)]);
  assert.equal(months.length, 12);
  assert.equal(months[0].key, "2025-09");
  assert.equal(months.at(-1).key, "2026-08");
  assert.equal(months.at(-1).label, "August 2026");
  assert.equal(months.at(-1).initial, "A");
  assert.deepEqual(months.map((m) => m.hours), [null, null, null, 24, null, null, null, null, null, 18, null, 42]);
  const two = hoursByMonth([log("2026-08-01", 10), log("2026-08-15", 5)]);
  assert.equal(two.at(-1).hours, 15);
});
test("subject totals attribute a log's hours to each of its subjects", () => {
  const totals = subjectTotals([
    { subjects: ["Mathematics", "Literature"], studyHours: 42 },
    { subjects: ["Mathematics"], studyHours: 24 },
    { subjects: ["Physics", "Physics"] },
  ]);
  assert.deepEqual(totals, [
    { subject: "Mathematics", logs: 2, hours: 66 },
    { subject: "Literature", logs: 1, hours: 42 },
    { subject: "Physics", logs: 1, hours: 0 },
  ]);
});
