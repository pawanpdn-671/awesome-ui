import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function DropdownMenuDocPage() {
  return <ComponentDocPage data={getComponent("dropdown-menu")!} />;
}
