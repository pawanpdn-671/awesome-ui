import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function toastDocPage() {
  const data = components.find(c => c.id === "toast")!;
  return <ComponentDocPage data={data} />;
}
