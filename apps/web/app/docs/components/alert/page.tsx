import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function alertDocPage() {
  const data = components.find(c => c.id === "alert")!;
  return <ComponentDocPage data={data} />;
}
