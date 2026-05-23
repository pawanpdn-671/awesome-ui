import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponentFromDb } from "@/lib/db-texts";
import { notFound } from "next/navigation";

export default async function DropdownMenuDocPage() {
  const data = await getComponentFromDb("dropdown-menu");
  if (!data) return notFound();
  return <ComponentDocPage data={data} />;
}
