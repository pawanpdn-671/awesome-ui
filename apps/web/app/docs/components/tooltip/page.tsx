import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponentFromDb } from "@/lib/db-texts";
import { notFound } from "next/navigation";

export default async function TooltipDocPage() {
  const data = await getComponentFromDb("tooltip");
  if (!data) return notFound();
  return <ComponentDocPage data={data} />;
}
