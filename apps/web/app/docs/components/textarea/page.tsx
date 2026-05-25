import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function textareaDocPage() {
  const data = components.find(c => c.id === "textarea")!;
  return <ComponentDocPage data={data} />;
}
