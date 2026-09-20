import { core, body, strings, seo, preview } from "./shared";
const progress = {
  name: "progress",
  title: "Progress",
  type: "document",
  fields: [
    ...core,
    {
      name: "month",
      title: "Month represented",
      type: "date",
      description: "Use the first day of the month for a monthly log.",
    },
    { name: "studyHours", type: "number", validation: (Rule) => Rule.min(0) },
    strings("subjects", "Subjects"),
    strings("milestones", "Milestones"),
    strings("highlights", "Highlights"),
    strings("difficulties", "Difficulties"),
    strings("reflections", "Reflections"),
    strings("nextSteps", "Next steps"),
    body(),
    seo,
  ],
  preview,
};

export default progress;
