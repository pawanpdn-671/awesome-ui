"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Figma, Puzzle, Box, BookOpen, Palette } from "lucide-react";
import Link from "next/link";
import { ecosystemSection as t } from "@/texts";

const ecosystemIcons = [Figma, Puzzle, Box, BookOpen, Palette, Figma];
const ecosystemColors = ["text-amber-400", "text-sky-400", "text-emerald-400", "text-rose-400", "text-violet-400", "text-awesome-400"];

export function EcosystemSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">{t.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            {t.heading}
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            {t.subheading}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.items.map((item, i) => {
            const Icon = ecosystemIcons[i]!;
            return (
            <div key={item.title} className="glass rounded-xl p-6 border border-surface-800/50 card-gradient-hover">
              <Icon className={`w-8 h-8 ${ecosystemColors[i]} mb-4`} />
              <h3 className="text-base font-semibold text-surface-100 mb-2">{item.title}</h3>
              <p className="text-sm text-surface-400">{item.desc}</p>
            </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/docs">
            <Button variant="outline" size="lg">
              {t.cta}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
