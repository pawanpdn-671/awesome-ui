"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowDown, Box, Layers, Palette, Accessibility, Zap, Cpu } from "lucide-react";
import { architectureSection as t } from "@/texts";

const layerIcons = [Cpu, Layers, Palette, Accessibility, Zap, Box];
const layerColors = [
  "from-awesome-400 to-awesome-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-sky-400 to-sky-600",
];

export function ArchitectureSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-awesome-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">{t.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            {t.heading.part1}{" "}
            <span className="text-gradient">{t.heading.part2}</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            {t.subheading}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-awesome-500 via-violet-500 to-awesome-500 opacity-30" />

            <div className="space-y-8">
              {t.layers.map((layer, i) => {
                const LayerIcon = layerIcons[i]!;
                return (
                <div key={layer.title} className="relative flex gap-6 items-start group">
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${layerColors[i]} p-0.5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full rounded-[14px] bg-surface-950 flex items-center justify-center">
                        <LayerIcon className="w-7 h-7 text-surface-100" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 glass rounded-xl p-5 border border-surface-800/50 card-gradient-hover -mt-1">
                    <h3 className="text-lg font-semibold text-surface-100 mb-1">{layer.title}</h3>
                    <p className="text-sm text-surface-400">{layer.desc}</p>
                  </div>
                  {i < t.layers.length - 1 && (
                    <div className="absolute left-8 -bottom-4 z-10">
                      <ArrowDown className="w-4 h-4 text-awesome-400 animate-bounce" />
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 glass rounded-2xl p-8 border border-surface-700/50 text-center">
          <h3 className="text-xl font-semibold text-surface-100 mb-4">{t.howItWorks.heading}</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {t.howItWorks.steps.map((step) => (
            <div key={step.number} className="bg-surface-950 rounded-xl p-5 border border-surface-800">
              <div className="text-2xl font-bold text-awesome-400 mb-2">{step.number}</div>
              <h4 className="text-sm font-semibold text-surface-100 mb-1">{step.title}</h4>
              <p className="text-xs text-surface-400">{step.desc}</p>
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
