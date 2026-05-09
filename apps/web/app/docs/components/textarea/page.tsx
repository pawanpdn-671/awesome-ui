import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function TextareaDocPage() {
  return <ComponentDocPage data={getComponent("textarea")!} />;
}
