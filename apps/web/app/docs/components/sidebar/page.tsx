import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function sidebarDocPage() {
  const data = components.find(c => c.id === "sidebar")!;
  return <ComponentDocPage data={data} />;
}
