import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function badgeDocPage() {
  const data = components.find(c => c.id === "badge")!;
  return <ComponentDocPage data={data} />;
}
