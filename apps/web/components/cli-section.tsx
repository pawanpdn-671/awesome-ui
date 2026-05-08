"use client";

import { Badge } from "@/components/ui/badge";
import { TerminalBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Terminal, Download, Settings, List } from "lucide-react";
import Link from "next/link";

const workflows = [
  {
    title: "Initialize a project",
    icon: Download,
    commands: ["npx awesomeui init", "✔ Detecting project...", "✔ Framework: Next.js 15", "✔ Style: Tailwind CSS", "✔ TypeScript: enabled", "", "✔ Project initialized!"],
  },
  {
    title: "Add components",
    icon: Settings,
    commands: ["npx awesomeui add button", "npx awesomeui add dialog", "npx awesomeui add card", "npx awesomeui add form", "", "✔ All components added"],
  },
  {
    title: "List available components",
    icon: List,
    commands: ["npx awesomeui list", "", "Available components:", "  • button       Actions", "  • dialog       Overlay", "  • card         Layout", "  • form         Data Entry", "  • table        Data Display", "  • command      Navigation", "  • ... 20 more"],
  },
];

const frameworkSetup = [
  { name: "React", code: "npx awesomeui init --framework react", color: "#61DAFB" },
  { name: "Next.js", code: "npx awesomeui init --framework next", color: "#fff" },
  { name: "Vue", code: "npx awesomeui init --framework vue", color: "#4FC08D" },
  { name: "Angular", code: "npx awesomeui init --framework angular", color: "#DD0031" },
  { name: "Svelte", code: "npx awesomeui init --framework svelte", color: "#FF3E00" },
  { name: "Solid", code: "npx awesomeui init --framework solid", color: "#2C4F7C" },
];

export function CliSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-surface-950" />
      <div className="absolute inset-0 grid-bg-heavy" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary" className="text-sm px-4 py-1.5">
            <Terminal className="w-3.5 h-3.5 mr-1 inline" />
            CLI Powered
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
            Terminal-first <span className="text-gradient">workflow</span>.
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            Everything you need at your fingertips. Initialize, add components,
            and configure your project — all from the command line.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {workflows.map((w) => (
            <div key={w.title}>
              <div className="flex items-center gap-2 mb-3">
                <w.icon className="w-4 h-4 text-awesome-400" />
                <span className="text-sm font-medium text-surface-200">{w.title}</span>
              </div>
              <TerminalBlock commands={w.commands} />
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 border border-surface-700/50">
          <h3 className="text-lg font-semibold text-surface-100 mb-6 text-center">
            Framework-specific setup
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {frameworkSetup.map((fs) => (
              <div key={fs.name} className="bg-surface-950 rounded-xl p-4 border border-surface-800 hover:border-awesome-500/30 transition-all duration-300">
                <div className="text-xs font-semibold mb-2" style={{ color: fs.color }}>{fs.name}</div>
                <code className="text-sm text-surface-300 font-mono">{fs.code}</code>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/docs/cli">
              <Button variant="outline" size="md">
                View CLI Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
