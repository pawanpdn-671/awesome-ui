import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function ToastDocPage() {
  return <ComponentDocPage data={getComponent("toast")!} />;
}
