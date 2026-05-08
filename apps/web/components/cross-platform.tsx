"use client";

import { Badge } from "@/components/ui/badge";
import { Smartphone, Monitor, Tablet, Check } from "lucide-react";

const platforms = [
  {
    name: "Web", icon: Monitor,
    desc: "React, Vue, Angular, Svelte, SolidJS",
    features: ["SSR support", "RSC compatible", "Responsive", "SEO optimized"],
  },
  {
    name: "Mobile", icon: Smartphone,
    desc: "React Native — iOS & Android",
    features: ["Native gestures", "Platform adaptive", "Shared logic", "Same API"],
  },
  {
    name: "Desktop", icon: Tablet,
    desc: "Electron, Tauri, or any webview",
    features: ["Keyboard shortcuts", "Window management", "System menus", "Tray icons"],
  },
];

export function CrossPlatform() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-surface-950" />
      <div className="absolute inset-0 grid-bg" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">Cross-Platform</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            One codebase.{" "}
            <span className="text-gradient">Every platform.</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            Build once and deploy to web, mobile, and desktop. AwesomeUI adapts
            to each platform while maintaining consistent APIs and design.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {platforms.map((p) => (
            <div key={p.name} className="glass rounded-2xl p-8 border border-surface-700/50 card-gradient-hover">
              <div className="w-12 h-12 rounded-xl bg-awesome-500/20 flex items-center justify-center mb-5">
                <p.icon className="w-6 h-6 text-awesome-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-100 mb-2">{p.name}</h3>
              <p className="text-sm text-surface-400 mb-6">{p.desc}</p>
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-surface-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 glass rounded-2xl p-8 lg:p-12 border border-surface-700/50 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-surface-100 mb-4">
                Same component. Everywhere.
              </h3>
              <p className="text-surface-400 mb-6">
                Write your UI once using AwesomeUI&apos;s universal API and watch it render
                natively on every platform. The same Button component works across web
                browsers, mobile devices, and desktop applications.
              </p>
              <div className="flex flex-wrap gap-2">
                {["React", "Vue", "Angular", "Svelte", "Solid", "RN"].map((fw) => (
                  <span key={fw} className="px-3 py-1 rounded-full bg-surface-800 text-surface-400 text-xs font-medium">
                    {fw}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-xl p-4 border border-surface-700/50 max-w-sm mx-auto">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-surface-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  <span className="text-xs text-surface-500 ml-2">Preview</span>
                </div>
                <div className="flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-awesome-400 to-awesome-600 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-white font-bold">A</span>
                    </div>
                    <div className="text-surface-100 font-semibold mb-1">AwesomeUI</div>
                    <div className="text-xs text-surface-500 mb-4">Running on all platforms</div>
                    <div className="flex gap-2 justify-center">
                      <span className="px-2 py-1 rounded bg-awesome-500/20 text-awesome-300 text-xs">Web</span>
                      <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs">Mobile</span>
                      <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-xs">Desktop</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
