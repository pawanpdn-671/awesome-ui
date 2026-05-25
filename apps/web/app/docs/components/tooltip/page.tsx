import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function tooltipDocPage() {
  const data = components.find(c => c.id === "tooltip")!;
  return <ComponentDocPage data={data} />;
}
