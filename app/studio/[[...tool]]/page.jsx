import Studio from "@/components/Studio";
import Link from "next/link";
export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return <main style={{ padding: "2rem", fontFamily: "system-ui" }}><h1>Connect your Sanity project</h1><p>Keep your existing NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET values in .env.local, then restart the development server.</p><Link href="/">Return to website</Link></main>;
  }
  return <Studio />;
}
