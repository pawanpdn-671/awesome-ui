import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function SidebarDocPage() {
  return <ComponentDocPage data={getComponent("sidebar")!} />;
}
