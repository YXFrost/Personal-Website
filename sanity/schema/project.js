// sanity/schema/project.js
// ─────────────────────────────────────────────────────────────────
// Sanity schema for the "project" document type.
// ─────────────────────────────────────────────────────────────────

const project = {
  name: "project",
  title: "Project",
  type: "document",

  // Custom icon for the Studio sidebar (emoji fallback)
  icon: () => "🗂",

  fields: [
    // ── Core ──────────────────────────────────────────────────────
    {
      name: "title",
      title: "Title",
      type: "string",
      description: "The name of the project (e.g. 'Particle Simulation Engine')",
      validation: (Rule) => Rule.required().min(2).max(80),
    },

    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-safe identifier. Click 'Generate' to auto-fill from title.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },

    {
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      description: "A one-to-two sentence summary shown on the project card.",
      validation: (Rule) => Rule.required().max(200),
    },

    {
      name: "longDescription",
      title: "Long Description",
      type: "array",
      description: "Full rich-text description for the project detail page.",
      of:[
        { type: "block" },
        { 
          type: "image",
          title: "Inline Image",
          options: { hotspot: true }
        },
        {
          type: "code",
          title: "Code Block",
          options: {
            withFilename: true, // Allows you to display the file name (e.g., page.js)
          }
        }
      ],
    },

    // ── Media ─────────────────────────────────────────────────────
    {
      name: "image",
      title: "Cover Image",
      type: "image",
      description: "Main project thumbnail (recommended: 1200×800px).",
      options: {
        hotspot: true, // Allows focal-point cropping
      },
    },

    // ── Taxonomy ──────────────────────────────────────────────────
    {
      name: "tags",
      title: "Tags",
      type: "array",
      description: "Tech stack or categories (e.g. 'Next.js', 'Python', 'WebGL')",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },

    // ── Links ─────────────────────────────────────────────────────
    {
      name: "liveUrl",
      title: "Live URL",
      type: "url",
      description: "Link to the deployed project (optional).",
    },

    {
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      description: "Link to the source code repository (optional).",
    },
  ],

  // ── Studio preview ────────────────────────────────────────────
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
};

export default project;
