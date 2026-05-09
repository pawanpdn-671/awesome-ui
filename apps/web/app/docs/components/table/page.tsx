import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function TableDocPage() {
  return <ComponentDocPage data={getComponent("table")!} />;
}
