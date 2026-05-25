import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function checkboxDocPage() {
  const data = components.find(c => c.id === "checkbox")!;
  return <ComponentDocPage data={data} />;
}
