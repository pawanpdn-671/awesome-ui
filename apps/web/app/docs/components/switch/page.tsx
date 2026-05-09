import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function SwitchDocPage() {
  return <ComponentDocPage data={getComponent("switch")!} />;
}
