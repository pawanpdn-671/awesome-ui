"use client";

import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useTexts } from "@/components/text-provider";

const frameworkTags = ["React", "Vue", "Angular", "Svelte", "Solid", "RN"];

const codeExamples = [
  { label: "React", color: "bg-awesome-400", code: `import { Button } from '@awesomeui/react'\n\n<Button variant="primary" size="lg">\n  Submit\n</Button>` },
  { label: "Vue", color: "bg-emerald-400", code: `import { Button } from '@awesomeui/vue'\n\n<Button variant="primary" size="lg">\n  Submit\n</Button>` },
  { label: "Svelte", color: "bg-orange-400", code: `import { Button } from '@awesomeui/svelte'\n\n<Button variant="primary" size="lg">\n  Submit\n</Button>` },
  { label: "Angular", color: "bg-sky-400", code: `import { ButtonModule } from '@awesomeui/angular'\n\n<aw-button variant="primary" size="lg">\n  Submit\n</aw-button>` },
];

export function ApiPhilosophy() {
	const { apiPhilosophy: t } = useTexts();
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
          <div className="space-y-4">
            {t.tenets.map((tenet: any) => (
              <div key={tenet.title} className="glass rounded-xl p-5 card-gradient-hover border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-awesome-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-awesome-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-surface-100">{tenet.title}</h3>
                    <p className="text-sm text-surface-400 mt-1">{tenet.desc}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {frameworkTags.map((fw) => (
                        <span key={fw} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-800 text-surface-500 font-medium">{fw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {codeExamples.map((ex) => (
              <div key={ex.label} className="glass rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${ex.color}`} />
                  <span className="text-xs font-medium text-surface-400">{ex.label}</span>
                </div>
                <CodeBlock code={ex.code} language="tsx" className="border-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
