"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/badge";
import { TerminalBlock } from "@/components/terminal-block";
import { Button } from "@/components/button";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { useTexts } from "@/components/text-provider";

const WORKFLOW_COUNT = 3;
const RESTART_DELAY = 5000;

export function CliSection() {
	const { cliSection: t } = useTexts();
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  const advance = useCallback(() => {
    setStep((s) => (s + 1 >= WORKFLOW_COUNT ? -1 : s + 1));
  }, []);

  useEffect(() => {
    if (step === -1) {
      const timer = setTimeout(() => {
        setStep(0);
        setCycle((c) => c + 1);
      }, RESTART_DELAY);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-surface-950" />
      <div className="absolute inset-0 grid-bg-heavy" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">
            <Terminal className="w-3.5 h-3.5 mr-1 inline" />
            {t.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            {t.heading}
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            {t.subheading}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {t.workflows.map((w: any, i: any) => {
            const effectiveStep = step === -1 ? WORKFLOW_COUNT - 1 : step;
            const active = effectiveStep === i;
            return (
            <div key={i} className="transition-all duration-500">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${active ? "bg-emerald-400 shadow-lg shadow-emerald-500/30" : "bg-surface-600"}`} />
                <span className={`text-sm font-medium transition-colors duration-300 ${active ? "text-surface-100" : "text-surface-400"}`}>{w.title}</span>
              </div>
              <TerminalBlock
                commands={[...w.commands]}
                autoPlay={active && step !== -1}
                onComplete={advance}
                resetKey={cycle}
              />
            </div>
            );
          })}
        </div>

        <div className="glass rounded-2xl p-8 border border-border/50">
          <h3 className="text-lg font-semibold text-surface-100 mb-6 text-center">
            {t.frameworkSetup.heading}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.frameworkSetup.frameworks.map((fs: any) => (
              <div key={fs.name} className="bg-surface-950 rounded-xl p-4 border border-border hover:border-awesome-500/30 transition-all duration-300">
                <div className="text-xs font-semibold mb-2 text-surface-200">{fs.name}</div>
                <code className="text-sm text-surface-300 font-mono">{fs.code}</code>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/docs/cli">
              <Button variant="outline" size="md">
                {t.cta}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
