import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponentFromDb } from "@/lib/db-texts";
import { notFound } from "next/navigation";

export default async function CheckboxDocPage() {
  const data = await getComponentFromDb("checkbox");
  if (!data) return notFound();
  return <ComponentDocPage data={data} />;
}
