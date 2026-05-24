"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  Code2,
  Eye,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  FileCode,
  Package,
  RefreshCw,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/code-block";
import { useTexts } from "@/components/text-provider";
import { builderPalettes, defaultPaletteId } from "@/lib/builder-palettes";
import { JsxPreview } from "./jsx-parser";
import { PromptForm } from "./prompt-form";
import type { Mode, Result } from "./types";

const ACCENT_COLOR_RE = /\b(bg|text|border|from|to|via|ring|hover:bg|focus:bg|active:bg|hover:text|focus:text|hover:border|focus:border|outline|placeholder|divide|accent|caret|fill|stroke)-([a-z]+)-(\d+)\b/g;

/** Normalises hardcoded accent colours (bg-blue-500 → bg-awesome-500) in
 *  generated code so the palette CSS variables control the actual colour. */
function normalizeThemeColors(code: string): string {
  return code.replace(ACCENT_COLOR_RE, (match, prefix, color, shade) => {
    if (color === "surface" || color === "awesome") return match;
    if (shade === "500") return `${prefix}-awesome-500`;
    if (shade === "600" && prefix.endsWith("bg")) return `${prefix}-awesome-600`;
    if (shade === "400" && prefix === "text") return `${prefix}-awesome-400`;
    return `${prefix}-awesome-500`;
  });
}

export function SectionBuilder() {
  const { sectionBuilderUI: t, suggestionPrompts } = useTexts();
  const [mode, setMode] = useState<Mode>("generate");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [previewPalette, setPreviewPalette] = useState<string>(defaultPaletteId);
  const [previewBg, setPreviewBg] = useState<"dark" | "light">("dark");

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch("/api/section-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", prompt: prompt.trim(), palette: defaultPaletteId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setResult({
        code: normalizeThemeColors(data.code || ""),
        title: data.title || "Generated Section",
        description: data.description || "",
        componentsUsed: Array.isArray(data.componentsUsed) ? data.componentsUsed : [],
      });
      setPreviewPalette(defaultPaletteId);
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!prompt.trim() || !result || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/section-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "improve",
          prompt: prompt.trim(),
          existingCode: result.code,
          palette: defaultPaletteId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setResult({
        code: normalizeThemeColors(data.code || result.code),
        title: data.title || result.title,
        description: data.description || result.description,
        componentsUsed: Array.isArray(data.componentsUsed) ? data.componentsUsed : result.componentsUsed,
      });
      setPreviewPalette(defaultPaletteId);
      setPrompt("");
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecolor = (paletteId: string) => {
    setPreviewPalette(paletteId);
    if (!result) return;
    setResult({ ...result, code: normalizeThemeColors(result.code) });
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleNewSection = () => {
    setMode("generate");
    setPrompt("");
    setResult(null);
    setError("");
    setCopied(false);
    setActiveTab("preview");
    setPreviewPalette(defaultPaletteId);
  };

  return (
    <div className="max-w-4xl py-10 mx-auto space-y-8">
      {!result ? (
        <PromptForm
          mode={mode}
          onModeChange={setMode}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={handleGenerate}
          loading={loading}
          error={error}
          suggestions={suggestionPrompts}
          onSuggestionClick={(p) => setPrompt(p)}
        />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-awesome-500 to-awesome-600 flex items-center justify-center shadow-lg shadow-awesome-500/20">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-100">{result.title}</h2>
                {result.description && (
                  <p className="text-sm text-surface-500 mt-1">{result.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                copied
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                  : "border-surface-700 text-surface-300 hover:border-surface-600 hover:text-surface-100",
              )}>
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> {t.results.copied}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> {t.results.copyCode}
                </>
              )}
            </button>
          </div>

          {/* Palette picker + components */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Palette className="w-3.5 h-3.5 text-surface-500 shrink-0" />
              <span className="text-xs text-surface-500">{t.results.recolorLabel}</span>
              {builderPalettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleRecolor(p.id)}
                  disabled={loading}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded-md border transition-all",
                    (previewPalette ?? defaultPaletteId) === p.id
                      ? "border-awesome-500/40 bg-awesome-500/10 text-awesome-400"
                      : "border-surface-700 text-surface-500 hover:border-surface-500 hover:text-surface-200",
                    loading && "opacity-50 cursor-not-allowed",
                  )}
                  title={p.description}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.previewColor }} />
                  {p.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              {loading ? (
                <div className="flex items-center gap-1.5 text-xs text-surface-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t.generateButton.loading}
                </div>
              ) : result.componentsUsed?.length > 0 ? (
                <>
                  <Package className="w-3.5 h-3.5 text-surface-500" />
                  <span className="text-xs text-surface-500">{t.results.componentsLabel}</span>
                  {result.componentsUsed.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 text-xs font-mono bg-awesome-500/10 text-awesome-400 rounded-md border border-awesome-500/20">
                      {c}
                    </span>
                  ))}
                </>
              ) : null}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-rose-300">{t.errorFallback}</p>
                <p className="text-xs text-rose-500/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Preview / Code tabs */}
          <div className="bg-surface-900 rounded-2xl border border-surface-800 overflow-hidden">
            <div className="flex items-center border-b border-surface-800">
              <button
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2",
                  activeTab === "preview"
                    ? "border-awesome-500 text-surface-100"
                    : "border-transparent text-surface-400 hover:text-surface-200",
                )}>
                <Eye className="w-4 h-4" />
                {t.results.previewTab}
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2",
                  activeTab === "code"
                    ? "border-awesome-500 text-surface-100"
                    : "border-transparent text-surface-400 hover:text-surface-200",
                )}>
                <Code2 className="w-4 h-4" />
                {t.results.codeTab}
              </button>
              <button
                onClick={() => setPreviewBg(previewBg === "dark" ? "light" : "dark")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-3 text-xs transition-all",
                  previewBg === "light"
                    ? "text-amber-400 hover:text-amber-300"
                    : "text-surface-500 hover:text-surface-300",
                )}
                title={`Switch to ${previewBg === "dark" ? "light" : "dark"} preview background`}>
                {previewBg === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1" />
              {activeTab === "code" && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-3 text-xs text-surface-400 hover:text-surface-200 transition-all">
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" /> {t.results.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> {t.results.copyCode}
                    </>
                  )}
                </button>
              )}
            </div>

            {activeTab === "preview" ? (
              <div className="max-h-150 overflow-y-auto">
                <JsxPreview
                  code={result.code}
                  previewPaletteId={previewPalette}
                  previewMode={previewBg}
                />
              </div>
            ) : (
              <div className="max-h-150 overflow-y-auto">
                <CodeBlock code={result.code} language="tsx" showLineNumbers />
              </div>
            )}
          </div>

          {/* Improve input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-surface-500" />
              <p className="text-sm font-medium text-surface-300">{t.results.improve.title}</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.results.improve.placeholder}
                className="flex-1 px-4 py-2.5 bg-surface-900 border border-surface-800 rounded-xl text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-awesome-500/50 focus:ring-1 focus:ring-awesome-500/20 transition-all"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) handleImprove();
                }}
              />
              <button
                onClick={handleImprove}
                disabled={loading || !prompt.trim()}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  loading || !prompt.trim()
                    ? "bg-surface-800 text-surface-500 cursor-not-allowed"
                    : "bg-awesome-500 text-white hover:bg-awesome-600 shadow-lg shadow-awesome-500/20 active:scale-95",
                )}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {t.results.improve.btn}
              </button>
            </div>
          </div>

          {/* How to use */}
          <div className="p-4 rounded-xl bg-awesome-500/5 border border-awesome-500/10">
            <div className="flex items-start gap-3">
              <FileCode className="w-5 h-5 text-awesome-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-surface-200 mb-1">{t.results.howToUse.title}</h3>
                <p className="text-xs text-surface-400 leading-relaxed">{t.results.howToUse.body}</p>
                <p className="text-xs text-surface-500 mt-1">
                  Tip: The code uses themeable tokens like{" "}
                  <code className="bg-surface-800 px-1 rounded">bg-awesome-500</code> - these will automatically use
                  your app's configured accent colors.
                </p>
              </div>
            </div>
          </div>

          {/* New section */}
          <div className="text-center pt-4">
            <button
              onClick={handleNewSection}
              disabled={loading}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl border transition-all mx-auto",
                loading
                  ? "border-surface-800/50 text-surface-500 cursor-not-allowed"
                  : "border-surface-700 text-surface-300 hover:border-surface-600 hover:bg-surface-800/30 hover:text-surface-100",
              )}>
              <Sparkles className="w-4 h-4" />
              {t.results.newSection}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
