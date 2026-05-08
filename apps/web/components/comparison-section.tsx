"use client";

import { Badge } from "@/components/ui/badge";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { comparisonSection as t } from "@/texts";

type FeatureValue = boolean | "partial" | string;

interface Feature {
  name: string;
  awesomeui: FeatureValue;
  mui: FeatureValue;
  chakra: FeatureValue;
  antd: FeatureValue;
  mantine: FeatureValue;
  shadcn: FeatureValue;
  [key: string]: FeatureValue;
}

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
          <Badge variant="primary" className="text-sm px-4 py-1.5">{t.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            {t.heading}
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            {t.subheading}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-4 px-4 text-surface-400 font-medium w-44">{t.featureHeader}</th>
                {t.headers.map((h) => (
                  <th key={h.key} className={cn("py-4 px-4 text-center font-semibold", h.highlight ? "text-awesome-300" : "text-surface-400")}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.features.map((feat: Feature, i: number) => (
                <tr key={feat.name} className={cn("border-b border-surface-800/50 transition-colors hover:bg-surface-900/30", i % 2 === 0 ? "bg-surface-900/10" : "")}>
                  <td className="py-3.5 px-4 text-surface-200 font-medium text-left">{feat.name}</td>
                  {t.headers.map((h) => (
                    <td key={h.key} className={cn("py-3.5 px-4", h.highlight ? "bg-awesome-500/5" : "")}>
                      {renderCell(feat[h.key])}
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
