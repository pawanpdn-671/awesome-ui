import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function SelectDocPage() {
  return <ComponentDocPage data={getComponent("select")!} />;
}
