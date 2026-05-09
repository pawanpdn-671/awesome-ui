import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function MenubarDocPage() {
  return <ComponentDocPage data={getComponent("menubar")!} />;
}
