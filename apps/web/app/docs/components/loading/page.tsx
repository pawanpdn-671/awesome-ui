import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponentFromDb } from "@/lib/db-texts";
import { notFound } from "next/navigation";

export default async function LoadingDocPage() {
  const data = await getComponentFromDb("loading");
  if (!data) return notFound();
  return <ComponentDocPage data={data} />;
}
