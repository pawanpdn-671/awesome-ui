"use client";

import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { 
  Type, TreePine, Accessibility, Server, Palette, Zap, 
  Package, Puzzle 
} from "lucide-react";

const features = [
  { icon: Type, title: "TypeScript-First", desc: "Fully typed APIs with strict TypeScript support. Autocomplete works out of the box." },
  { icon: TreePine, title: "Tree Shakable", desc: "Import only what you need. Dead code elimination built in." },
  { icon: Accessibility, title: "Accessible", desc: "WAI-ARIA compliant components. Keyboard navigation. Screen reader support." },
  { icon: Server, title: "SSR + RSC", desc: "Server-side rendering and React Server Components support for Next.js." },
  { icon: Palette, title: "Theme Engine", desc: "CSS variables based theming. Customize every aspect of the design." },
  { icon: Zap, title: "Performance", desc: "Optimized bundles. Lazy loading. Minimal runtime overhead." },
  { icon: Package, title: "CLI Generators", desc: "Generate components, themes, and full project scaffolds from the CLI." },
  { icon: Puzzle, title: "Framework Adapters", desc: "Thin adapters for every major framework. Zero overhead." },
];

export function DxSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">Developer Experience</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            Built for <span className="text-gradient">developers</span>.
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            Every API, every tool, every detail is crafted to make you more productive
            and your code more maintainable.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-xl p-5 border border-surface-800/50 card-gradient-hover">
              <f.icon className="w-5 h-5 text-awesome-400 mb-3" />
              <h3 className="text-sm font-semibold text-surface-100 mb-1.5">{f.title}</h3>
              <p className="text-xs text-surface-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="glass rounded-xl p-6 border border-surface-700/50">
            <h3 className="text-lg font-semibold text-surface-100 mb-4">TypeScript Autocomplete</h3>
            <CodeBlock
              code={`import { Button } from '@awesomeui/react'

// Full autocomplete support
<Button
  variant="primary"     // "primary" | "secondary" | "ghost" | "outline" | "glow"
  size="md"             // "sm" | "md" | "lg"
  disabled={false}
  loading={false}
>
  Click Me
</Button>`}
              language="tsx"
            />
          </div>
          <div className="glass rounded-xl p-6 border border-surface-700/50">
            <h3 className="text-lg font-semibold text-surface-100 mb-4">Modular Imports</h3>
            <CodeBlock
              code={`// Import only what you need
import { Button } from '@awesomeui/react'
import { Dialog } from '@awesomeui/react'
import { Card, CardHeader, CardContent } from '@awesomeui/react'

// Tree-shaking eliminates unused code
// Final bundle: ~5kB per component`}
              language="tsx"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
