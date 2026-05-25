import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function selectDocPage() {
  const data = components.find(c => c.id === "select")!;
  return <ComponentDocPage data={data} />;
}
