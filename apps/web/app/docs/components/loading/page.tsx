import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function loadingDocPage() {
  const data = components.find(c => c.id === "loading")!;
  return <ComponentDocPage data={data} />;
}
