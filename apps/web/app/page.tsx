import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FrameworkSupport } from "@/components/framework-support";
import { ApiPhilosophy } from "@/components/api-philosophy";
import { ComponentShowcase } from "@/components/component-showcase";
import { CrossPlatform } from "@/components/cross-platform";
import { DxSection } from "@/components/dx-section";
import { CliSection } from "@/components/cli-section";
import { ArchitectureSection } from "@/components/architecture-section";
import { ThemingSection } from "@/components/theming-section";
import { EcosystemSection } from "@/components/ecosystem-section";
import { ComparisonSection } from "@/components/comparison-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FrameworkSupport />
        <ApiPhilosophy />
        <ComponentShowcase />
        <CrossPlatform />
        <DxSection />
        <CliSection />
        <ArchitectureSection />
        <ThemingSection />
        <EcosystemSection />
        <ComparisonSection />
      </main>
      <Footer />
    </>
  );
}
