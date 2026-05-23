import { SectionBuilder } from "@/components/section-builder";
import { getStaticTextsServer } from "@/lib/db-texts";

export async function generateMetadata() {
  const { sectionBuilderMeta } = await getStaticTextsServer();
  return {
    title: sectionBuilderMeta.title,
    description: sectionBuilderMeta.description,
  };
}

export default async function SectionBuilderPage() {
  return <SectionBuilder />;
}
