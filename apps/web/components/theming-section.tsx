"use client";

import { useState } from "react";
import { Badge } from "@/components/badge";
import { CodeBlock } from "@/components/code-block";
import { Check } from "lucide-react";
import { useTexts } from "@/components/text-provider";

const themeCode = `/* AwesomeUI Design Tokens */
:root {
  /* Colors */
  --awesome-50: #eef2ff;
  --awesome-500: #6366f1;
  --awesome-900: #312e81;

  /* Surfaces */
  --surface-50: #f8fafc;
  --surface-900: #0f172a;
  --surface-950: #020617;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --spacing-4: 1rem;
  --spacing-8: 2rem;

  /* Radius */
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
}`;

export function ThemingSection() {
	const { themingSection: t } = useTexts();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(themeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-surface-950" />
      <div className="absolute inset-0 grid-bg-heavy" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">{t.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            {t.heading.part1} <span className="text-gradient">{t.heading.part2}</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            {t.subheading}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {t.tokens.map((tk: any) => (
                <div key={tk.category} className="glass rounded-xl p-4 border border-border/50 card-gradient-hover">
                  <h4 className="text-xs font-semibold text-awesome-400 uppercase tracking-wider mb-2">{tk.category}</h4>
                  <ul className="space-y-1">
                    {tk.items.map((item: any) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-surface-400">
                        <Check className="w-3 h-3 text-emerald-400/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl p-5 border border-border/50">
              <h4 className="text-sm font-semibold text-surface-100 mb-3">{t.livePreview.heading}</h4>
              <div className="flex flex-wrap gap-3 mb-4">
                {t.livePreview.colors.map(({ color, label }: any) => (
                  <button
                    key={color}
                    aria-label={label}
                    className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {t.livePreview.radii.map((r: any) => (
                  <span key={r} className="px-3 py-1.5 bg-surface-800 rounded text-xs text-surface-300 border border-border" style={{ borderRadius: r === "sm" ? "0.25rem" : r === "md" ? "0.375rem" : r === "lg" ? "0.5rem" : r === "xl" ? "0.75rem" : "1rem" }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-surface-200">{t.cssVariables.heading}</h3>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-300 transition-colors">
                  {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> {t.cssVariables.copied}</> : t.cssVariables.copy}
                </button>
              </div>
              <CodeBlock code={themeCode} language="css" />
            </div>

            <div className="mt-6 glass rounded-xl p-5 border border-border/50">
              <h4 className="text-sm font-semibold text-surface-100 mb-2">{t.darkMode.heading}</h4>
              <p className="text-xs text-surface-400">
                {t.darkMode.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
