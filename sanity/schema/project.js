import {
  core,
  strings,
  body,
  image,
  imageFields,
  seo,
  references,
  preview,
} from "./shared";
const project = {
  name: "project",
  title: "Projects",
  type: "document",
  fields: [
    ...core,
    strings("technologies", "Technologies"),
    {
      name: "status",
      type: "string",
      options: { list: ["In progress", "Complete", "Archived"] },
    },
    {
      name: "githubUrl",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    },
    {
      name: "demoUrl",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    },
    {
      name: "gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: imageFields }],
    },
    body(),
    references,
    seo,
    {
      name: "description",
      title: "Legacy short description",
      type: "text",
      description:
        "Still displayed when Summary is empty. Existing data is preserved.",
    },
    body("longDescription"),
    image("image"),
    { name: "liveUrl", title: "Legacy demo URL", type: "url" },
  ],
  preview,
};

export default project;
