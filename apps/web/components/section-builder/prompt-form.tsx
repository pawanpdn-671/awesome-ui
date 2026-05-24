"use client";

import { useCallback } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTexts } from "@/components/text-provider";
import type { Mode, SuggestionPrompt } from "./types";

interface PromptFormProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
  suggestions: SuggestionPrompt[];
  onSuggestionClick: (prompt: string) => void;
}

export function PromptForm({
  mode,
  onModeChange,
  prompt,
  onPromptChange,
  onSubmit,
  loading,
  error,
  suggestions,
  onSuggestionClick,
}: PromptFormProps) {
  const { sectionBuilderUI: t } = useTexts();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        onSubmit();
      }
    },
    [onSubmit],
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-awesome-500/10 text-awesome-400 text-xs font-medium border border-awesome-500/20">
          <Sparkles className="w-3 h-3" />
          {t.badge}
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-surface-100">
            {t.heading.line1} <span className="text-awesome-400">{t.heading.line2}</span>
          </h1>
          <p className="text-surface-400 max-w-2xl mx-auto">{t.description}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onModeChange("generate")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all",
              mode === "generate"
                ? "border-awesome-500/40 bg-awesome-500/10 text-awesome-400"
                : "border-surface-700 text-surface-400 hover:border-surface-600 hover:text-surface-200",
            )}>
            <Sparkles className="w-4 h-4" />
            {t.modes.generate.label}
          </button>
        </div>

        <div className="relative">
          {/* @ts-ignore - textarea is a valid child of div */}
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={mode === "generate" ? t.modes.generate.textareaPlaceholder : t.modes.improve.textareaPlaceholder}
            className="w-full h-32 px-4 py-3 bg-surface-900 border border-surface-800 rounded-xl text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-awesome-500/50 focus:ring-1 focus:ring-awesome-500/20 resize-none transition-all"
            disabled={loading}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={onSubmit}
              disabled={loading || !prompt.trim()}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all",
                loading || !prompt.trim()
                  ? "bg-surface-800 text-surface-500 cursor-not-allowed"
                  : "bg-awesome-500 text-white hover:bg-awesome-600 shadow-lg shadow-awesome-500/20 active:scale-95",
              )}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {t.generateButton.loading}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />{" "}
                  {mode === "generate" ? t.generateButton.idle : t.generateButton.improve}
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-rose-300">{t.errorFallback}</p>
              <p className="text-xs text-rose-500/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">
            {t.modes.generate.suggestionsTitle}
          </p>
          <div className="grid gap-2">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => onSuggestionClick(s.prompt)}
                disabled={loading}
                className={cn(
                  "flex items-center justify-between p-3 text-left rounded-xl border transition-all group",
                  loading
                    ? "border-surface-800/50 opacity-50 cursor-not-allowed"
                    : "border-surface-800 hover:border-surface-700 bg-surface-900/50 hover:bg-surface-800/30",
                )}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-surface-200">{s.label}</p>
                    <p className="text-xs text-surface-500">{s.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
