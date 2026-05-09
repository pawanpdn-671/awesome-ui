import { ComponentDocPage } from "@/components/component-doc-page";
import { getComponent } from "@/texts/component-data";

export default function AvatarDocPage() {
  return <ComponentDocPage data={getComponent("avatar")!} />;
}
