"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, Copy, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  neutralPalettes,
  accentPalettes,
  getThemeVars,
  generateCSSVariables,
  shiftAccentScale,
  accentShadeOptions,
  type Palette,
  type AccentShade,
} from "@/lib/color-palettes";

function ColorSwatch({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-5 h-5 rounded-full border border-border shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

function PaletteSelector({
  title,
  palettes,
  selected,
  onSelect,
}: {
  title: string;
  palettes: Palette[];
  selected: Palette;
  onSelect: (p: Palette) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-surface-300 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {palettes.map((p) => (
          <button
            key={p.name}
            onClick={() => onSelect(p)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all border",
              selected.name === p.name
                ? "bg-awesome-500/10 border-awesome-500/30 text-awesome-300"
                : "bg-surface-900 border-border text-surface-400 hover:border-border hover:text-surface-200"
            )}
          >
            <ColorSwatch color={p.colors[500]} />
            {p.label}
            {selected.name === p.name && (
              <Check className="w-3.5 h-3.5 ml-auto text-awesome-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-200 transition-colors"
    >
      {copied ? (
        <>
          <CheckCheck className="w-3.5 h-3.5" /> Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" /> Copy
        </>
      )}
    </button>
  );
}

function FormPreview() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-border text-surface-100 text-sm placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-awesome-500/30 focus:border-awesome-500/50 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-border text-surface-100 text-sm placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-awesome-500/30 focus:border-awesome-500/50 transition-all"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded border-2 border-awesome-500 bg-awesome-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm text-surface-300">Remember me</span>
      </div>
      <Button variant="primary" className="w-full">
        Sign In
      </Button>
    </div>
  );
}

function TablePreview() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3 px-3 text-surface-400 font-medium">Name</th>
          <th className="text-left py-3 px-3 text-surface-400 font-medium">Role</th>
          <th className="text-left py-3 px-3 text-surface-400 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: "John Doe", role: "Developer", status: "Active" as const },
          { name: "Jane Smith", role: "Designer", status: "Active" as const },
          { name: "Bob Johnson", role: "PM", status: "Away" as const },
        ].map((row) => (
          <tr key={row.name} className="border-b border-border/50 hover:bg-surface-800/30 transition-colors">
            <td className="py-3 px-3 text-surface-200">{row.name}</td>
            <td className="py-3 px-3 text-surface-400">{row.role}</td>
            <td className="py-3 px-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs",
                  row.status === "Active" ? "text-emerald-400" : "text-amber-400"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    row.status === "Active" ? "bg-emerald-400" : "bg-amber-400"
                  )}
                />
                {row.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CardPreview() {
  return (
    <div className="glass rounded-xl p-5 border border-border/50">
      <div className="w-full h-28 rounded-lg bg-gradient-to-br from-awesome-500/20 to-awesome-500/5 mb-4 flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-awesome-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-awesome-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <h3 className="text-base font-semibold text-surface-100 mb-1">Card Title</h3>
      <p className="text-sm text-surface-400 mb-4">
        Cards are versatile content containers used throughout the UI.
      </p>
      <Button variant="primary" size="sm" className="w-full">
        Learn More
      </Button>
    </div>
  );
}

function BadgesPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  );
}

function ButtonsPreview() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="glow">Glow</Button>
    </div>
  );
}

function PaletteCard({ palette }: { palette: Palette }) {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="px-3 py-2 bg-surface-900/50 border-b border-border">
        <h4 className="text-sm font-medium text-surface-200">{palette.label}</h4>
        <p className="text-[10px] text-surface-500 font-mono">{palette.name}</p>
      </div>
      <div className="p-3 space-y-0.5">
        {steps.map((s) => {
          const color = palette.colors[s];
          if (!color) return null;
          const isDark = s >= 400;
          return (
            <div
              key={s}
              className="flex items-center gap-3 rounded px-2 py-1 text-[11px] font-mono"
              style={{ backgroundColor: color }}
            >
              <span style={{ color: isDark ? "#fff" : "#000", opacity: 0.6 }} className="w-8 shrink-0">
                {s}
              </span>
              <span style={{ color: isDark ? "#fff" : "#000" }} className="font-medium">
                {color.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ThemingPlayground() {
  const [neutral, setNeutral] = useState<Palette>(neutralPalettes[0]!);
  const [accent, setAccent] = useState<Palette>(accentPalettes[0]!);
  const [primaryShade, setPrimaryShade] = useState<AccentShade>(500);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const shiftedAccent: Palette = {
    ...accent,
    colors: shiftAccentScale(accent, primaryShade),
  };

  const themeVars = getThemeVars(neutral, shiftedAccent, isLight);
  const cssVars = generateCSSVariables(neutral, shiftedAccent);
  const themeConfig = `// awesomeui.config.json
{
  "theme": {
    "base": "${neutral.name}",
    "accent": "${accent.name}",
    "shade": ${primaryShade}
  }
}`;

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <h1 className="text-3xl font-bold text-surface-100 tracking-tight">
            Theme Customizer
          </h1>
          <p className="mt-2 text-surface-400 max-w-2xl">
            Choose a neutral base and an accent color to preview how AwesomeUI
            components look. All colors are from{" "}
            <code className="text-awesome-400 text-sm font-mono">@awesomeui/tokens</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-6">
            <div className="glass rounded-xl p-5 border border-border/50 space-y-6">
              <PaletteSelector
                title="Neutral Base"
                palettes={neutralPalettes}
                selected={neutral}
                onSelect={setNeutral}
              />

              <div className="border-t border-border" />

              <PaletteSelector
                title="Accent Color"
                palettes={accentPalettes}
                selected={accent}
                onSelect={(p) => { setAccent(p); setPrimaryShade(500); }}
              />

              <div className="border-t border-border" />

              <div>
                <h3 className="text-sm font-medium text-surface-300 mb-3">
                  Primary Shade
                </h3>
                <p className="text-xs text-surface-500 mb-3">
                  Select which shade becomes the primary (500) accent color
                </p>
                <div className="flex gap-1">
                  {accentShadeOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setPrimaryShade(s)}
                      className={cn(
                        "flex-1 h-8 rounded text-[10px] font-mono font-medium transition-all",
                        primaryShade === s
                          ? "ring-2 ring-awesome-400 ring-offset-1 ring-offset-surface-900 scale-105"
                          : "hover:scale-105"
                      )}
                      style={{
                        backgroundColor: accent.shades?.[s] ?? accent.colors[500],
                        color: s >= 300 ? "#fff" : "#000",
                      }}
                      title={`Shade ${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-5 border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-surface-300">Configuration</h3>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg bg-surface-950 border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <span className="text-xs text-surface-500 font-mono">awesomeui.config.json</span>
                    <CopyButton value={themeConfig} />
                  </div>
                  <pre className="p-3 text-xs text-surface-300 font-mono overflow-x-auto">
                    <code>{themeConfig}</code>
                  </pre>
                </div>

                <div className="rounded-lg bg-surface-950 border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <span className="text-xs text-surface-500 font-mono">globals.css</span>
                    <CopyButton value={cssVars} />
                  </div>
                  <pre className="p-3 text-xs text-surface-300 font-mono overflow-x-auto max-h-60 overflow-y-auto">
                    <code>{cssVars}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-5 border border-border/50">
              <h3 className="text-sm font-medium text-surface-300 mb-3">
                Selected Palette
              </h3>
              <div className="space-y-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(
                  (step) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="text-xs text-surface-500 w-8 font-mono">
                        {step}
                      </span>
                      <div className="flex-1 flex gap-0.5">
                        {step === 500 && (
                          <>
                            <span
                              className="h-4 flex-1 rounded-l"
                              style={{
                                backgroundColor:
                                  neutral.colors[step as keyof typeof neutral.colors],
                              }}
                            />
                            <span
                              className="h-4 flex-1 rounded-r"
                              style={{
                                backgroundColor:
                                  shiftedAccent.colors[step as keyof typeof shiftedAccent.colors],
                              }}
                            />
                          </>
                        )}
                        {step !== 500 && (
                          <span
                            className="h-4 flex-1 rounded"
                            style={{
                              backgroundColor:
                                neutral.colors[step as keyof typeof neutral.colors],
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <Tabs defaultValue="components" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
              </TabsList>

              <TabsContent value="components">
                <div className="space-y-6" style={themeVars as React.CSSProperties}>
                  <section className="glass rounded-xl border border-border/50 overflow-hidden">
                    <div className="px-5 py-3 border-b border-border/50 bg-surface-900/50">
                      <h2 className="text-sm font-semibold text-surface-200">
                        Buttons
                      </h2>
                    </div>
                    <div className="p-5">
                      <ButtonsPreview />
                    </div>
                  </section>

                  <section className="glass rounded-xl border border-border/50 overflow-hidden">
                    <div className="px-5 py-3 border-b border-border/50 bg-surface-900/50">
                      <h2 className="text-sm font-semibold text-surface-200">
                        Badges
                      </h2>
                    </div>
                    <div className="p-5">
                      <BadgesPreview />
                    </div>
                  </section>

                  <section className="glass rounded-xl border border-border/50 overflow-hidden">
                    <div className="px-5 py-3 border-b border-border/50 bg-surface-900/50">
                      <h2 className="text-sm font-semibold text-surface-200">
                        Card
                      </h2>
                    </div>
                    <div className="p-5 max-w-xs">
                      <CardPreview />
                    </div>
                  </section>

                  <section className="glass rounded-xl border border-border/50 overflow-hidden">
                    <div className="px-5 py-3 border-b border-border/50 bg-surface-900/50">
                      <h2 className="text-sm font-semibold text-surface-200">
                        Form
                      </h2>
                    </div>
                    <div className="p-5 max-w-sm">
                      <FormPreview />
                    </div>
                  </section>

                  <section className="glass rounded-xl border border-border/50 overflow-hidden">
                    <div className="px-5 py-3 border-b border-border/50 bg-surface-900/50">
                      <h2 className="text-sm font-semibold text-surface-200">
                        Table
                      </h2>
                    </div>
                    <div className="p-5">
                      <TablePreview />
                    </div>
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="colors">
                <div className="space-y-4">
                  <div className="glass rounded-xl border border-border/50 overflow-hidden">
                    <div className="px-5 py-3 border-b border-border/50 bg-surface-900/50">
                      <h2 className="text-sm font-semibold text-surface-200">
                        All Package Colors
                      </h2>
                      <p className="text-xs text-surface-500 mt-0.5">
                        Full color palette reference from{" "}
                        <code className="text-awesome-400 font-mono">@awesomeui/tokens</code>
                      </p>
                    </div>
                    <div className="p-5 space-y-8">
                      <div>
                        <h3 className="text-xs font-medium text-surface-400 mb-3 uppercase tracking-wider">
                          Neutral
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {neutralPalettes.map((p) => (
                            <PaletteCard key={p.name} palette={p} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-surface-400 mb-3 uppercase tracking-wider">
                          Accent
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {accentPalettes.map((p) => (
                            <PaletteCard key={p.name} palette={p} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
