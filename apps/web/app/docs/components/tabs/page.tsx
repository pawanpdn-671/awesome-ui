import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function tabsDocPage() {
  const data = components.find(c => c.id === "tabs")!;
  return <ComponentDocPage data={data} />;
}
