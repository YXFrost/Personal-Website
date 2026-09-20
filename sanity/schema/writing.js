import { core, body, seo, references, preview } from "./shared";
const writing = {
  name: "writing",
  title: "Writing",
  type: "document",
  fields: [
    ...core,
    {
      name: "category",
      type: "string",
      description: "For example: Literature, Mathematics, Physics, Philosophy.",
    },
    body(),
    references,
    seo,
  ],
  preview,
};

export default writing;
