import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function PaginationDocPage() {
  return <ComponentDocPage data={getComponent("pagination")!} />;
}
