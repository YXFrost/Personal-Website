export const imageFields = [
  {
    name: "alt",
    title: "Alternative text",
    type: "string",
    description:
      "Describe meaningful visual information. Required for new images.",
    validation: (Rule) => Rule.required().warning(),
  },
  { name: "caption", type: "string", title: "Caption" },
];
export const image = (name) => ({
  name,
  title: name === "image" ? "Legacy cover image" : "Cover image",
  type: "image",
  options: { hotspot: true },
  fields: imageFields,
});
export const strings = (name, title) => ({
  name,
  title,
  type: "array",
  of: [{ type: "string" }],
  options: { layout: "tags" },
});
export const core = [
  { name: "title", type: "string", validation: (Rule) => Rule.required() },
  {
    name: "slug",
    type: "slug",
    options: { source: "title", maxLength: 96 },
    validation: (Rule) =>
      Rule.required().custom((value) =>
        !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
          ? true
          : "Use lowercase letters, numbers, and single hyphens.",
      ).warning(),
  },
  { name: "summary", type: "text", rows: 3 },
  {
    name: "published",
    title: "Visible on website",
    type: "boolean",
    initialValue: true,
    description:
      "Uncheck to hide a published document. Sanity drafts are always excluded.",
  },
  {
    name: "publishedAt",
    title: "Publication date",
    type: "datetime",
    description: "Future dates are excluded until publication time.",
  },
  { name: "updatedAt", title: "Significant update date", type: "datetime" },
  { name: "featured", type: "boolean", initialValue: false },
  image("coverImage"),
  strings("tags", "Tags"),
];
export const seo = {
  name: "seo",
  title: "Search and sharing",
  type: "object",
  fields: [
    { name: "title", type: "string" },
    { name: "description", type: "text", rows: 3 },
    image("image"),
  ],
};
export const references = {
  name: "references",
  type: "array",
  of: [
    {
      type: "object",
      name: "referenceLink",
      fields: [
        {
          name: "title",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "url",
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        },
        { name: "note", type: "string" },
      ],
    },
  ],
};
export const body = (name = "body") => ({
  name,
  title: name === "longDescription" ? "Legacy write-up" : "Body",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Heading 5", value: "h5" },
        { title: "Heading 6", value: "h6" },
        { title: "Legacy heading 1", value: "h1" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Strike", value: "strike-through" },
          { title: "Underline", value: "underline" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ["https", "http", "mailto"],
                  }),
              },
            ],
          },
        ],
      },
      of: [{ type: "inlineMath" }],
    },
    { type: "image", options: { hotspot: true }, fields: imageFields },
    { type: "code", options: { withFilename: true } },
    { type: "table" },
    { type: "math" },
  ],
});
export const richTypes = [
  {
    name: "math",
    type: "object",
    title: "Display mathematics",
    fields: [
      {
        name: "latex",
        type: "text",
        rows: 3,
        description: "LaTeX expression without $ delimiters.",
        validation: (Rule) => Rule.required(),
      },
    ],
    preview: { select: { title: "latex" } },
  },
  {
    name: "inlineMath",
    type: "object",
    title: "Inline mathematics",
    fields: [
      { name: "latex", type: "string", validation: (Rule) => Rule.required() },
    ],
    preview: { select: { title: "latex" } },
  },
  {
    name: "table",
    type: "object",
    title: "Table",
    fields: [
      {
        name: "caption",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "rows",
        type: "array",
        description: "First row is the column header.",
        of: [
          {
            type: "object",
            name: "tableRow",
            fields: [
              { name: "cells", type: "array", of: [{ type: "string" }] },
            ],
          },
        ],
      },
    ],
  },
];
export const preview = {
  select: { title: "title", subtitle: "summary", media: "coverImage" },
};
