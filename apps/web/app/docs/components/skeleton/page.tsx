import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function SkeletonDocPage() {
  return <ComponentDocPage data={getComponent("skeleton")!} />;
}
