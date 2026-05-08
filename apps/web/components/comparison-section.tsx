"use client";

import { Badge } from "@/components/ui/badge";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  name: string;
  awesomeui: boolean | "partial" | string;
  mui: boolean | string;
  chakra: boolean | string;
  antd: boolean | string;
  mantine: boolean | string;
  shadcn: boolean | "partial" | string;
}

const features: Feature[] = [
  { name: "Cross-Framework", awesomeui: true, mui: "React only", chakra: "React only", antd: "React only", mantine: "React only", shadcn: "React only" },
  { name: "React Native", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: "Partial" },
  { name: "Vue Support", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: false },
  { name: "Angular Support", awesomeui: true, mui: false, chakra: false, antd: "Angular ver.", mantine: false, shadcn: false },
  { name: "Svelte Support", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: false },
  { name: "SolidJS Support", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: false },
  { name: "Unified API", awesomeui: true, mui: true, chakra: true, antd: true, mantine: true, shadcn: true },
  { name: "TypeScript", awesomeui: true, mui: true, chakra: true, antd: true, mantine: true, shadcn: true },
  { name: "Tree Shakable", awesomeui: true, mui: "Partial", chakra: true, antd: "Partial", mantine: true, shadcn: true },
  { name: "SSR Support", awesomeui: true, mui: true, chakra: true, antd: true, mantine: true, shadcn: true },
  { name: "RSC Support", awesomeui: true, mui: "Partial", chakra: false, antd: false, mantine: false, shadcn: true },
  { name: "CLI Generators", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: true },
  { name: "Theming Engine", awesomeui: true, mui: true, chakra: true, antd: true, mantine: true, shadcn: "CSS vars" },
  { name: "Accessibility", awesomeui: true, mui: true, chakra: true, antd: "Partial", mantine: true, shadcn: true },
  { name: "Bundle Size", awesomeui: "~5kB/comp", mui: "~50kB+", chakra: "~30kB+", antd: "~100kB+", mantine: "~40kB+", shadcn: "~3kB/comp" },
];

const headers = [
  { key: "awesomeui", label: "AwesomeUI", highlight: true },
  { key: "mui", label: "Material UI", highlight: false },
  { key: "chakra", label: "Chakra UI", highlight: false },
  { key: "antd", label: "Ant Design", highlight: false },
  { key: "mantine", label: "Mantine", highlight: false },
  { key: "shadcn", label: "shadcn/ui", highlight: false },
];

export function ComparisonSection() {
  const renderCell = (value: boolean | "partial" | string) => {
    if (typeof value === "boolean") {
      return value ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-surface-600 mx-auto" />;
    }
    if (value === "Partial") {
      return <Minus className="w-4 h-4 text-amber-400 mx-auto" />;
    }
    return <span className="text-xs text-surface-400 text-center block">{value}</span>;
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-surface-950" />
      <div className="absolute inset-0 grid-bg" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">Comparison</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            Why <span className="text-gradient">AwesomeUI</span>?
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            The only truly cross-framework UI platform. No other library comes close.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-4 px-4 text-surface-400 font-medium w-44">Feature</th>
                {headers.map((h) => (
                  <th key={h.key} className={cn("py-4 px-4 text-center font-semibold", h.highlight ? "text-awesome-300" : "text-surface-400")}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feat, i) => (
                <tr key={feat.name} className={cn("border-b border-surface-800/50 transition-colors hover:bg-surface-900/30", i % 2 === 0 ? "bg-surface-900/10" : "")}>
                  <td className="py-3.5 px-4 text-surface-200 font-medium text-left">{feat.name}</td>
                  {headers.map((h) => (
                    <td key={h.key} className={cn("py-3.5 px-4", h.highlight ? "bg-awesome-500/5" : "")}>
                      {renderCell(feat[h.key as keyof Feature])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
