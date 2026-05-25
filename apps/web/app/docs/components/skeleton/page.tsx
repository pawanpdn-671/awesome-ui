import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function skeletonDocPage() {
  const data = components.find(c => c.id === "skeleton")!;
  return <ComponentDocPage data={data} />;
}
