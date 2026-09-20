import { createClient } from "@sanity/client";
export const sanityClient = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19",
      useCdn: false,
      perspective: "published",
    })
  : null;
