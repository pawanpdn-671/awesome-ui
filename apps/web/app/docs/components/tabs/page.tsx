import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function TabsDocPage() {
  return <ComponentDocPage data={getComponent("tabs")!} />;
}
