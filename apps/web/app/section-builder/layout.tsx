import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SectionBuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
