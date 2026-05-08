"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Figma, Puzzle, Box, BookOpen, Palette } from "lucide-react";
import Link from "next/link";

const ecosystem = [
  { icon: Figma, title: "Figma Kit", desc: "Full component library for Figma. Design with the same components you build with.", color: "text-amber-400" },
  { icon: Puzzle, title: "VSCode Extension", desc: "Snippets, autocomplete, and live previews directly in your editor.", color: "text-sky-400" },
  { icon: Box, title: "Starter Kits", desc: "Pre-configured project templates for every framework. Zero setup.", color: "text-emerald-400" },
  { icon: BookOpen, title: "Storybook", desc: "Explore and test components in isolation with our Storybook integration.", color: "text-rose-400" },
  { icon: Palette, title: "Theme Generator", desc: "Visual theme editor to create and preview custom design tokens.", color: "text-violet-400" },
  { icon: Figma, title: "Icon Library", desc: "1,200+ icons optimized for all frameworks. Consistent and customizable.", color: "text-awesome-400" },
];

export function EcosystemSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">Ecosystem</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            Everything you <span className="text-gradient">need</span>.
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            A growing ecosystem of tools, integrations, and resources to accelerate your workflow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ecosystem.map((item) => (
            <div key={item.title} className="glass rounded-xl p-6 border border-surface-800/50 card-gradient-hover">
              <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
              <h3 className="text-base font-semibold text-surface-100 mb-2">{item.title}</h3>
              <p className="text-sm text-surface-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/docs">
            <Button variant="outline" size="lg">
              Explore the Ecosystem
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
