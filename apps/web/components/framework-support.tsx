"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/badge";
import { cn } from "@/lib/utils";
import { ReactIcon, NextjsIcon, VueIcon, AngularIcon, SvelteIcon, SolidIcon, ReactNativeIcon } from "@/components/framework-icons";
import { useTexts } from "@/components/text-provider";

const frameworkCode: Record<string, string> = {
  react: `import { Button, Card } from '@awesomeui/react'\n\nfunction Demo() {\n  return (\n    <Card>\n      <Button variant="primary">\n        Hello React\n      </Button>\n    </Card>\n  )\n}`,
  nextjs: `import { Button, Card } from '@awesomeui/react'\n\nexport default function Page() {
	const { frameworkSupport: t } = useTexts();\n  return (\n    <Card>\n      <Button variant="primary">\n        Hello Next.js\n      </Button>\n    </Card>\n  )\n}`,
  vue: `<template>\n  <Card>\n    <Button variant="primary">\n      Hello Vue\n    </Button>\n  </Card>\n</template>\n\n<script setup lang="ts">\nimport { Button, Card } from '@awesomeui/vue'\n</script>`,
  angular: `import { Component } from '@angular/core'\nimport { ButtonModule, CardModule } from '@awesomeui/angular'\n\n@Component({\n  template: \`\n    <aw-card>\n      <aw-button variant="primary">\n        Hello Angular\n      </aw-button>\n    </aw-card>\n  \`\n})\nexport class DemoComponent {}`,
  svelte: `<script lang="ts">\n  import { Button, Card } from '@awesomeui/svelte'\n</script>\n\n<Card>\n  <Button variant="primary">\n    Hello Svelte\n  </Button>\n</Card>`,
  solid: `import { Button, Card } from '@awesomeui/solid'\n\nfunction Demo() {\n  return (\n    <Card>\n      <Button variant="primary">\n        Hello Solid\n      </Button>\n    </Card>\n  )\n}`,
  "react-native": `import { Button, Card } from '@awesomeui/react-native'\n\nfunction Demo() {\n  return (\n    <Card>\n      <Button variant="primary">\n        Hello Mobile\n      </Button>\n    </Card>\n  )\n}`,
};

const frameworkIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  react: ReactIcon, nextjs: NextjsIcon, vue: VueIcon, angular: AngularIcon, svelte: SvelteIcon, solid: SolidIcon, "react-native": ReactNativeIcon,
};


export function FrameworkSupport() {
  const { frameworkSupport: t } = useTexts();
  const [active, setActive] = useState("react");
  const fw = t.frameworks.find((f: any) => f.id === active)!;
  const FwIcon = frameworkIcons[fw.id]!;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-awesome-500/5 rounded-full blur-[100px]" />

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

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-2">
            {t.frameworks.map((f: any) => {
              const Icon = frameworkIcons[f.id]!;
              return (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border",
                  active === f.id
                    ? "bg-surface-800/80 border-awesome-500/30 shadow-lg shadow-awesome-500/5"
                    : "bg-surface-900/30 border-border/50 hover:bg-surface-800/50 hover:border-border"
                )}
              >
                  <Icon className="w-5 h-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-surface-100">{f.name}</div>
                  <div className="text-xs text-surface-500 truncate">{f.install}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  {f.ssr && <Badge variant="default" className="text-[10px] px-1.5 py-0">{t.labels.ssr}</Badge>}
                  {f.rsc && <Badge variant="primary" className="text-[10px] px-1.5 py-0">{t.labels.rsc}</Badge>}
                </div>
              </button>
            );
            })}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FwIcon className="w-6 h-6 shrink-0" />
                  <div>
                    <div className="text-lg font-semibold text-surface-100">{fw.name}</div>
                    <div className="text-xs text-surface-500">v{fw.version}</div>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">{t.labels.compatible}</Badge>
              </div>

              <div className="space-y-2 text-sm text-surface-400 mb-4">
                <p className="font-mono text-xs text-surface-500">{t.labels.install}</p>
                <div className="bg-surface-950 rounded-lg px-4 py-2.5 font-mono text-sm text-surface-200">{fw.install}</div>
              </div>

              <CodeBlock code={frameworkCode[fw.id]!} language={fw.id} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {t.stats.map((s: any, i: any) => {
                const colors = ["text-awesome-400", "text-emerald-400", "text-amber-400", "text-awesome-400"];
                return (
                <div key={s.label} className="glass rounded-lg p-4 text-center card-gradient-hover">
                  <div className={`text-2xl font-bold ${colors[i]}`}>{s.value}</div>
                  <div className="text-xs text-surface-500">{s.label}</div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
