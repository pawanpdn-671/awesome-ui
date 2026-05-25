import { ComponentDocPage } from "@/components/component-doc-page";
import { components } from "@/texts/component-data";

export default function avatarDocPage() {
  const data = components.find(c => c.id === "avatar")!;
  return <ComponentDocPage data={data} />;
}
