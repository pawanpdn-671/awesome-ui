import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function progressDocPage() {
  const data = components.find(c => c.id === "progress")!;
  return <ComponentDocPage data={data} />;
}
