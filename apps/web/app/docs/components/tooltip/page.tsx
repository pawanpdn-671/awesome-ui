import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function TooltipDocPage() {
  return <ComponentDocPage data={getComponent("tooltip")!} />;
}
