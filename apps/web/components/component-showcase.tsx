"use client";

import { useState, useMemo } from "react";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { codeExamples, frameworks } from "@/lib/utils";
import { Eye, Code2, ArrowRight } from "lucide-react";
import { useTexts } from "@/components/text-provider";
import Link from "next/link";

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: React.ReactNode;
}

export function ComponentShowcase() {
	const { componentShowcase: t } = useTexts();
  const [activeComponent, setActiveComponent] = useState("button");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFramework, setActiveFramework] = useState("react");
  const [previewMode, setPreviewMode] = useState<"preview" | "code">("preview");

  const componentsList: Component[] = useMemo(() => [
    {
      id: "button", name: t.components[0]!.name, description: t.components[0]!.description, category: t.components[0]!.category,
      preview: (
        <div className="flex flex-wrap gap-3 items-center justify-center py-8">
          <button className="px-5 py-2.5 rounded-lg bg-awesome-500 text-white text-sm font-medium hover:bg-awesome-600 transition-all shadow-lg shadow-awesome-500/20">{t.preview.button.primary}</button>
          <button className="px-5 py-2.5 rounded-lg bg-surface-800 text-surface-100 text-sm font-medium hover:bg-surface-700 border border-border transition-all">{t.preview.button.secondary}</button>
          <button className="px-5 py-2.5 rounded-lg text-surface-300 text-sm font-medium hover:text-surface-100 hover:bg-surface-800 transition-all">{t.preview.button.ghost}</button>
        </div>
      ),
    },
    {
      id: "dialog", name: t.components[1]!.name, description: t.components[1]!.description, category: t.components[1]!.category,
      preview: (
        <div className="flex items-center justify-center py-8">
          <div className="glass rounded-xl p-6 max-w-sm w-full border border-border/50">
            <h3 className="text-lg font-semibold text-surface-100 mb-2">{t.preview.dialog.title}</h3>
            <p className="text-sm text-surface-400 mb-5">{t.preview.dialog.description}</p>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 rounded-lg bg-surface-800 text-surface-300 text-sm font-medium hover:bg-surface-700 border border-border transition-all">{t.preview.dialog.cancel}</button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-awesome-500 text-white text-sm font-medium hover:bg-awesome-600 transition-all">{t.preview.dialog.confirm}</button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "form", name: t.components[2]!.name, description: t.components[2]!.description, category: t.components[2]!.category,
      preview: (
        <div className="py-8 px-4">
          <div className="space-y-4 max-w-sm mx-auto">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">{t.preview.form.email}</label>
              <input type="email" placeholder={t.preview.form.emailPlaceholder} className="w-full px-3.5 py-2.5 rounded-lg bg-surface-800 border border-border text-surface-100 text-sm placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-awesome-500/30 focus:border-awesome-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">{t.preview.form.password}</label>
              <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-lg bg-surface-800 border border-border text-surface-100 text-sm placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-awesome-500/30 focus:border-awesome-500/50 transition-all" />
            </div>
            <button className="w-full px-4 py-2.5 rounded-lg bg-awesome-500 text-white text-sm font-medium hover:bg-awesome-600 transition-all shadow-lg shadow-awesome-500/20">{t.preview.form.signIn}</button>
          </div>
        </div>
      ),
    },
    {
      id: "command", name: t.components[3]!.name, description: t.components[3]!.description, category: t.components[3]!.category,
      preview: (
        <div className="py-8 px-4 flex items-center justify-center">
          <div className="glass rounded-xl border border-border/50 overflow-hidden max-w-sm w-full">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <svg className="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input placeholder={t.preview.command.searchPlaceholder} className="bg-transparent text-sm text-surface-100 placeholder:text-surface-500 flex-1 focus:outline-none" />
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-800 text-surface-500 font-mono">{t.preview.command.shortcut}</span>
            </div>
            <div className="p-2 space-y-0.5">
              {t.preview.command.items.map((item: string) => (
                <div key={item} className="px-3 py-2 rounded-lg text-sm text-surface-300 hover:bg-surface-800 hover:text-surface-100 cursor-pointer transition-colors">{item}</div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "card", name: t.components[4]!.name, description: t.components[4]!.description, category: t.components[4]!.category,
      preview: (
        <div className="py-8 px-4 flex items-center justify-center">
          <div className="glass rounded-xl p-6 max-w-sm w-full border border-border/50 card-gradient-hover">
            <div className="w-full h-32 rounded-lg bg-gradient-to-br from-awesome-500/20 to-violet-500/20 mb-4 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-awesome-500/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-awesome-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-surface-100 mb-2">{t.preview.card.title}</h3>
            <p className="text-sm text-surface-400 mb-4">{t.preview.card.description}</p>
            <button className="w-full px-4 py-2 rounded-lg bg-awesome-500 text-white text-sm font-medium hover:bg-awesome-600 transition-all">{t.preview.card.cta}</button>
          </div>
        </div>
      ),
    },
    {
      id: "table", name: t.components[5]!.name, description: t.components[5]!.description, category: t.components[5]!.category,
      preview: (
        <div className="py-8 px-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {t.preview.table.headers.map((h: string) => (
                  <th key={h} className="text-left py-3 px-3 text-surface-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.preview.table.rows.map((row: any) => (
                <tr key={row.name} className="border-b border-border/50 hover:bg-surface-800/30 transition-colors">
                  <td className="py-3 px-3 text-surface-200">{row.name}</td>
                  <td className="py-3 px-3 text-surface-400">{row.role}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
  ], [t]);

  const filtered = activeCategory === "All" ? componentsList : componentsList.filter((c) => c.category === activeCategory);
  const current = componentsList.find((c) => c.id === activeComponent) || componentsList[0]!;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-awesome-500/5 rounded-full blur-[100px]" />

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

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {t.categories.map((cat: any) => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setActiveComponent(filtered[0]?.id || ""); }}
              className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200", activeCategory === cat ? "bg-awesome-500/20 text-awesome-300 border border-awesome-500/30" : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 border border-transparent")}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1 space-y-1">
            {filtered.map((comp) => (
              <button key={comp.id} onClick={() => setActiveComponent(comp.id)}
                className={cn("w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200", activeComponent === comp.id ? "bg-surface-800 text-surface-100 font-medium border border-border" : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/30")}>
                {comp.name}
              </button>
            ))}
            <div className="pt-3 border-t border-border/50 mt-3">
              <Link href="/docs/components">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-surface-500 hover:text-surface-200 text-xs">
                  {t.cta} <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="glass rounded-xl border border-border/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-900/50">
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-surface-100">{current.name}</span>
                  <Badge variant="default" className="text-[10px]">{current.category}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    <button onClick={() => setPreviewMode("preview")} className={cn("p-1.5 transition-colors", previewMode === "preview" ? "bg-surface-700 text-surface-100" : "text-surface-400 hover:text-surface-200")}>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setPreviewMode("code")} className={cn("p-1.5 transition-colors", previewMode === "code" ? "bg-surface-700 text-surface-100" : "text-surface-400 hover:text-surface-200")}>
                      <Code2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {previewMode === "preview" ? (
                <div className="bg-surface-950/50">{current.preview}</div>
              ) : (
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {frameworks.map((fw) => (
                      <button key={fw.id} onClick={() => setActiveFramework(fw.id)}
                        className={cn("px-2.5 py-1 rounded text-xs font-medium transition-all", activeFramework === fw.id ? "bg-awesome-500/20 text-awesome-300" : "text-surface-400 hover:text-surface-200")}>
                        {fw.name}
                      </button>
                    ))}
                  </div>
                  <CodeBlock code={codeExamples[current.id]?.[activeFramework] || codeExamples[current.id]?.react || "// Coming soon"} language={activeFramework} />
                </div>
              )}
            </div>
            <p className="text-sm text-surface-500 mt-3">{current.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
