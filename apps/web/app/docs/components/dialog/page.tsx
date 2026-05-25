import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function dialogDocPage() {
  const data = components.find(c => c.id === "dialog")!;
  return <ComponentDocPage data={data} />;
}
