import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function dropdownUmenuDocPage() {
  const data = components.find(c => c.id === "dropdown-menu")!;
  return <ComponentDocPage data={data} />;
}
