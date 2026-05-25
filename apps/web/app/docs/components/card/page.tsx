import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function cardDocPage() {
  const data = components.find(c => c.id === "card")!;
  return <ComponentDocPage data={data} />;
}
