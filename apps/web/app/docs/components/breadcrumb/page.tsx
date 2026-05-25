import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function breadcrumbDocPage() {
  const data = components.find(c => c.id === "breadcrumb")!;
  return <ComponentDocPage data={data} />;
}
