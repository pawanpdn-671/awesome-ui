"use client";

import Link from "next/link";
import { ArrowRight, Github, Sparkles, Layers, Code2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeBlock, TerminalBlock } from "@/components/code-block";

const metrics = [
  { value: "7", label: "Frameworks", icon: Layers },
  { value: "26+", label: "Components", icon: Code2 },
  { value: "Zero", label: "Lock-in", icon: Zap },
  { value: "100%", label: "TypeScript", icon: Sparkles },
];

const floatingFrameworks = [
  { name: "React", color: "#61DAFB", x: "-20%", y: "15%", delay: "0s" },
  { name: "Vue", color: "#4FC08D", x: "85%", y: "10%", delay: "0.5s" },
  { name: "Angular", color: "#DD0031", x: "90%", y: "60%", delay: "1s" },
  { name: "Svelte", color: "#FF3E00", x: "-15%", y: "70%", delay: "1.5s" },
  { name: "SolidJS", color: "#2C4F7C", x: "50%", y: "-5%", delay: "2s" },
  { name: "React Native", color: "#61DAFB", x: "5%", y: "85%", delay: "2.5s" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-awesome-500/10 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[100px]" />

      {floatingFrameworks.map((fw) => (
        <div
          key={fw.name}
          className="absolute hidden lg:block text-xs font-bold tracking-widest uppercase animate-float"
          style={{ left: fw.x, top: fw.y, color: fw.color, animationDelay: fw.delay, opacity: 0.3 }}
        >
          {fw.name}
        </div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-2 animate-fade-in">
              <Badge variant="primary" className="text-sm px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                v0.1.0 — Public Alpha
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="text-gradient-hero">Universal UI</span>
                <br />
                <span className="text-surface-100">for every framework.</span>
              </h1>
              <p className="text-lg sm:text-xl text-surface-400 max-w-xl leading-relaxed">
                One design system. Unified APIs. Beautiful defaults.
                <br />
                Use the same components across{" "}
                <span className="text-surface-200 font-medium">
                  React, Next.js, Vue, Angular, Svelte, SolidJS, and React Native
                </span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/docs/getting-started">
                <Button variant="glow" size="lg" className="gap-2 text-base">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/components">
                <Button variant="outline" size="lg" className="text-base">
                  Browse Components
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="text-base gap-2">
                  <Github className="w-4 h-4" /> GitHub
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {metrics.map((m) => (
                <div key={m.label} className="glass rounded-xl p-4 card-gradient-hover">
                  <m.icon className="w-4 h-4 text-awesome-400 mb-2" />
                  <div className="text-2xl font-bold text-surface-100">{m.value}</div>
                  <div className="text-xs text-surface-500">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <TerminalBlock
              commands={[
                "npx awesomeui init",
                "✔ Framework detected: Next.js",
                "✔ Style system: Tailwind CSS",
                "✔ TypeScript: enabled",
                "✔ Components generated: 26",
                "",
                "Success! AwesomeUI is ready.",
                "Run `npx awesomeui add` to add components.",
              ]}
            />

            <CodeBlock
              code={`import { Button, Card } from '@awesomeui/react'

function App() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Welcome to AwesomeUI
      </h2>
      <Button variant="primary">
        Get Started
      </Button>
    </Card>
  )
}`}
              language="tsx"
            />

            <div className="grid grid-cols-4 gap-2">
              {["React", "Vue", "Angular", "Svelte"].map((fw) => (
                <div key={fw} className="glass rounded-lg px-3 py-2 text-center text-xs font-medium text-surface-400 card-gradient-hover">
                  {fw}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
