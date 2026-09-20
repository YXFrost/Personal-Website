import EntryPage from "@/components/EntryPage";
import { getEntries } from "@/lib/content";
import { entryMetadata } from "@/lib/metadata";
export const revalidate = 60;
export async function generateStaticParams() {
  return (await getEntries("project")).map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return entryMetadata("project", slug);
}
export default async function Page({ params }) {
  const { slug } = await params;
  return <EntryPage type="project" slug={slug} />;
}
