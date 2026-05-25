import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function switchDocPage() {
  const data = components.find(c => c.id === "switch")!;
  return <ComponentDocPage data={data} />;
}
