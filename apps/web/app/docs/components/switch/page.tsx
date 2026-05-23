import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponentFromDb } from "@/lib/db-texts";
import { notFound } from "next/navigation";

export default async function SwitchDocPage() {
  const data = await getComponentFromDb("switch");
  if (!data) return notFound();
  return <ComponentDocPage data={data} />;
}
