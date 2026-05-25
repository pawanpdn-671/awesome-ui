import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function inputDocPage() {
  const data = components.find(c => c.id === "input")!;
  return <ComponentDocPage data={data} />;
}
