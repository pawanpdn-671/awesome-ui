import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponentFromDb } from "@/lib/db-texts";
import { notFound } from "next/navigation";

export default async function BadgeDocPage() {
  const data = await getComponentFromDb("badge");
  if (!data) return notFound();
  return <ComponentDocPage data={data} />;
}
