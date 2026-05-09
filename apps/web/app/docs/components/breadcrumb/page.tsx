import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function BreadcrumbDocPage() {
  return <ComponentDocPage data={getComponent("breadcrumb")!} />;
}
