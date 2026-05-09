import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function BadgeDocPage() {
  return <ComponentDocPage data={getComponent("badge")!} />;
}
