import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponentFromDb } from "@/lib/db-texts";
import { notFound } from "next/navigation";

export default async function DialogDocPage() {
  const data = await getComponentFromDb("dialog");
  if (!data) return notFound();
  return <ComponentDocPage data={data} />;
}
