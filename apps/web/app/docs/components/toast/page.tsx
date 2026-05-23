import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponentFromDb } from "@/lib/db-texts";
import { notFound } from "next/navigation";

export default async function ToastDocPage() {
  const data = await getComponentFromDb("toast");
  if (!data) return notFound();
  return <ComponentDocPage data={data} />;
}
