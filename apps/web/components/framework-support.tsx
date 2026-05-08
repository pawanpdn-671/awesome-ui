"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReactIcon, NextjsIcon, VueIcon, AngularIcon, SvelteIcon, SolidIcon, ReactNativeIcon } from "@/components/framework-icons";

const frameworks = [
  {
    id: "react", name: "React", icon: ReactIcon, color: "#61DAFB",
    install: "npm install @awesomeui/react",
    version: "18.x / 19.x", ssr: true, rsc: true,
    code: `import { Button, Card } from '@awesomeui/react'

function Demo() {
  return (
    <Card>
      <Button variant="primary">
        Hello React
      </Button>
    </Card>
  )
}`,
  },
  {
    id: "nextjs", name: "Next.js", icon: NextjsIcon, color: "#fff",
    install: "npm install @awesomeui/react",
    version: "14.x / 15.x", ssr: true, rsc: true,
    code: `import { Button, Card } from '@awesomeui/react'

export default function Page() {
  return (
    <Card>
      <Button variant="primary">
        Hello Next.js
      </Button>
    </Card>
  )
}`,
  },
  {
    id: "vue", name: "Vue", icon: VueIcon, color: "#4FC08D",
    install: "npm install @awesomeui/vue",
    version: "3.x", ssr: true, rsc: false,
    code: `<template>
  <Card>
    <Button variant="primary">
      Hello Vue
    </Button>
  </Card>
</template>

<script setup lang="ts">
import { Button, Card } from '@awesomeui/vue'
</script>`,
  },
  {
    id: "angular", name: "Angular", icon: AngularIcon, color: "#DD0031",
    install: "npm install @awesomeui/angular",
    version: "17.x / 18.x", ssr: true, rsc: false,
    code: `import { Component } from '@angular/core'
import { ButtonModule, CardModule } from '@awesomeui/angular'

@Component({
  template: \`
    <aw-card>
      <aw-button variant="primary">
        Hello Angular
      </aw-button>
    </aw-card>
  \`
})
export class DemoComponent {}`,
  },
  {
    id: "svelte", name: "Svelte", icon: SvelteIcon, color: "#FF3E00",
    install: "npm install @awesomeui/svelte",
    version: "5.x", ssr: true, rsc: false,
    code: `<script lang="ts">
  import { Button, Card } from '@awesomeui/svelte'
</script>

<Card>
  <Button variant="primary">
    Hello Svelte
  </Button>
</Card>`,
  },
  {
    id: "solid", name: "SolidJS", icon: SolidIcon, color: "#2C4F7C",
    install: "npm install @awesomeui/solid",
    version: "1.x", ssr: true, rsc: false,
    code: `import { Button, Card } from '@awesomeui/solid'

function Demo() {
  return (
    <Card>
      <Button variant="primary">
        Hello Solid
      </Button>
    </Card>
  )
}`,
  },
  {
    id: "react-native", name: "React Native", icon: ReactNativeIcon, color: "#61DAFB",
    install: "npm install @awesomeui/react-native",
    version: "0.76+", ssr: false, rsc: false,
    code: `import { Button, Card } from '@awesomeui/react-native'

function Demo() {
  return (
    <Card>
      <Button variant="primary">
        Hello Mobile
      </Button>
    </Card>
  )
}`,
  },
];

export function FrameworkSupport() {
  const [active, setActive] = useState("react");
  const fw = frameworks.find((f) => f.id === active)!;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-awesome-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">Multi-Framework</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            Your framework. <span className="text-gradient">Our components.</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            Every AwesomeUI component is available for every major framework.
            Same API. Same design. Same developer experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-2">
            {frameworks.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border",
                  active === f.id
                    ? "bg-surface-800/80 border-awesome-500/30 shadow-lg shadow-awesome-500/5"
                    : "bg-surface-900/30 border-surface-800/50 hover:bg-surface-800/50 hover:border-surface-700"
                )}
              >
                <f.icon className="w-5 h-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: f.color }}>{f.name}</div>
                  <div className="text-xs text-surface-500 truncate">{f.install}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  {f.ssr && <Badge variant="default" className="text-[10px] px-1.5 py-0">SSR</Badge>}
                  {f.rsc && <Badge variant="primary" className="text-[10px] px-1.5 py-0">RSC</Badge>}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-xl p-6 border border-surface-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <fw.icon className="w-6 h-6 shrink-0" />
                  <div>
                    <div className="text-lg font-semibold" style={{ color: fw.color }}>{fw.name}</div>
                    <div className="text-xs text-surface-500">v{fw.version}</div>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">✓ Compatible</Badge>
              </div>

              <div className="space-y-2 text-sm text-surface-400 mb-4">
                <p className="font-mono text-xs text-surface-500">Install</p>
                <div className="bg-surface-950 rounded-lg px-4 py-2.5 font-mono text-sm text-surface-200">{fw.install}</div>
              </div>

              <CodeBlock code={fw.code} language={fw.id} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: "26+", label: "Components", color: "text-awesome-400" },
                { value: "100%", label: "TypeScript", color: "text-emerald-400" },
                { value: "Zero", label: "Lock-in", color: "text-amber-400" },
                { value: "~5kB", label: "Per Component", color: "text-awesome-400" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-lg p-4 text-center card-gradient-hover">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-surface-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
