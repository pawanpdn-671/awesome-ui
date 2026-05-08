"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowDown, Box, Layers, Palette, Accessibility, Zap, Cpu } from "lucide-react";

const layers = [
  { icon: Cpu, title: "Core IR", desc: "Framework-agnostic Intermediate Representation defines every component as structured JSON.", color: "from-awesome-400 to-awesome-600" },
  { icon: Layers, title: "Framework Adapters", desc: "Thin adapters translate IR to React, Vue, Angular, Svelte, SolidJS, and React Native.", color: "from-violet-400 to-violet-600" },
  { icon: Palette, title: "Design Tokens", desc: "Shared design tokens drive consistent styling across every framework and platform.", color: "from-emerald-400 to-emerald-600" },
  { icon: Accessibility, title: "Accessibility Engine", desc: "Built-in WAI-ARIA patterns, keyboard navigation, and screen reader support.", color: "from-amber-400 to-amber-600" },
  { icon: Zap, title: "Rendering Layer", desc: "Optimized rendering with SSR, RSC, and streaming support for maximum performance.", color: "from-rose-400 to-rose-600" },
  { icon: Box, title: "CLI & Tooling", desc: "Code generation, scaffolding, theming CLI, and project initialization tools.", color: "from-sky-400 to-sky-600" },
];

export function ArchitectureSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-awesome-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">Architecture</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            Built different.{" "}
            <span className="text-gradient">Engineered better.</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            AwesomeUI uses a groundbreaking IR-based architecture that decouples
            component definitions from framework-specific rendering.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-awesome-500 via-violet-500 to-awesome-500 opacity-30" />

            <div className="space-y-8">
              {layers.map((layer, i) => (
                <div key={layer.title} className="relative flex gap-6 items-start group">
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${layer.color} p-0.5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full rounded-2xl bg-surface-950 flex items-center justify-center">
                        <layer.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 glass rounded-xl p-5 border border-surface-800/50 card-gradient-hover -mt-1">
                    <h3 className="text-lg font-semibold text-surface-100 mb-1">{layer.title}</h3>
                    <p className="text-sm text-surface-400">{layer.desc}</p>
                  </div>
                  {i < layers.length - 1 && (
                    <div className="absolute left-8 -bottom-4 z-10">
                      <ArrowDown className="w-4 h-4 text-awesome-400 animate-bounce" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 glass rounded-2xl p-8 border border-surface-700/50 text-center">
          <h3 className="text-xl font-semibold text-surface-100 mb-4">How it works</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="bg-surface-950 rounded-xl p-5 border border-surface-800">
              <div className="text-2xl font-bold text-awesome-400 mb-2">1</div>
              <h4 className="text-sm font-semibold text-surface-100 mb-1">Define in IR</h4>
              <p className="text-xs text-surface-400">Components are defined in a framework-agnostic JSON format using our IR schema.</p>
            </div>
            <div className="bg-surface-950 rounded-xl p-5 border border-surface-800">
              <div className="text-2xl font-bold text-awesome-400 mb-2">2</div>
              <h4 className="text-sm font-semibold text-surface-100 mb-1">Transpile</h4>
              <p className="text-xs text-surface-400">Framework adapters transpile IR to native React, Vue, Angular, or Svelte components.</p>
            </div>
            <div className="bg-surface-950 rounded-xl p-5 border border-surface-800">
              <div className="text-2xl font-bold text-awesome-400 mb-2">3</div>
              <h4 className="text-sm font-semibold text-surface-100 mb-1">Render</h4>
              <p className="text-xs text-surface-400">Native components render with shared design tokens, theming, and accessibility built in.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
