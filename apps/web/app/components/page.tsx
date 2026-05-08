import { Header } from "@/components/header";
import { ComponentShowcase } from "@/components/component-showcase";
import { Footer } from "@/components/footer";
import { componentsPage as t } from "@/texts";

export default function ComponentsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-surface-100 mb-4">
            {t.heading}
          </h1>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            {t.subheading}
          </p>
        </div>
        <ComponentShowcase />
      </main>
      <Footer />
    </>
  );
}
