import EntryPage from "@/components/EntryPage";
import { getEntries } from "@/lib/content";
import { entryMetadata } from "@/lib/metadata";
export const revalidate = 60;
export async function generateStaticParams() {
  return (await getEntries("progress")).map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return entryMetadata("progress", slug);
}
export default async function Page({ params }) {
  const { slug } = await params;
  return <EntryPage type="progress" slug={slug} />;
}
