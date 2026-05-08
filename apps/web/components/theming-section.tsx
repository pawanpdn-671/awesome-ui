"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { Check } from "lucide-react";

const tokens = [
  { category: "Colors", items: ["Primary", "Surface", "Success", "Warning", "Danger", "Muted"] },
  { category: "Typography", items: ["Font Family", "Font Sizes", "Font Weights", "Line Heights"] },
  { category: "Spacing", items: ["4px scale", "8px scale", "16px scale", "32px scale"] },
  { category: "Radius", items: ["None", "Small", "Medium", "Large", "Full"] },
  { category: "Shadows", items: ["Small", "Medium", "Large", "XL", "Glow"] },
  { category: "Animation", items: ["Duration", "Easing", "Keyframes", "Transitions"] },
];

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
          <Badge variant="primary" className="text-sm px-4 py-1.5">Theming System</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            Your brand. <span className="text-gradient">Your theme.</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            Comprehensive design tokens and CSS variables give you complete control
            over every aspect of the visual design.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tokens.map((t) => (
                <div key={t.category} className="glass rounded-xl p-4 border border-surface-800/50 card-gradient-hover">
                  <h4 className="text-xs font-semibold text-awesome-400 uppercase tracking-wider mb-2">{t.category}</h4>
                  <ul className="space-y-1">
                    {t.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-surface-400">
                        <Check className="w-3 h-3 text-emerald-400/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl p-5 border border-surface-700/50">
              <h4 className="text-sm font-semibold text-surface-100 mb-3">Live Preview</h4>
              <div className="flex flex-wrap gap-3 mb-4">
                {[{ color: "#6366f1", label: "Indigo" }, { color: "#10b981", label: "Emerald" }, { color: "#f59e0b", label: "Amber" }, { color: "#ef4444", label: "Red" }, { color: "#8b5cf6", label: "Purple" }].map(({ color, label }) => (
                  <button
                    key={color}
                    aria-label={label}
                    className="w-8 h-8 rounded-full border-2 border-surface-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["sm", "md", "lg", "xl", "2xl"].map((r) => (
                  <span key={r} className="px-3 py-1.5 bg-surface-800 rounded text-xs text-surface-300 border border-surface-700" style={{ borderRadius: r === "sm" ? "0.25rem" : r === "md" ? "0.375rem" : r === "lg" ? "0.5rem" : r === "xl" ? "0.75rem" : "1rem" }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-surface-200">CSS Variables</h3>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-300 transition-colors">
                  {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : "Copy"}
                </button>
              </div>
              <CodeBlock code={themeCode} language="css" />
            </div>

            <div className="mt-6 glass rounded-xl p-5 border border-surface-700/50">
              <h4 className="text-sm font-semibold text-surface-100 mb-2">Dark Mode Ready</h4>
              <p className="text-xs text-surface-400">
                All components ship with dark mode support built in. Toggle between
                light and dark themes with a single CSS class on the HTML element.
                Design tokens automatically adapt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
