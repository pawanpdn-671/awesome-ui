import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function tableDocPage() {
  const data = components.find(c => c.id === "table")!;
  return <ComponentDocPage data={data} />;
}
