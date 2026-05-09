"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { type ComponentDoc } from "@/texts/component-data";
import { Eye, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  primitive: "Primitives",
  form: "Forms",
  "data-display": "Data Display",
  layout: "Layout",
  feedback: "Feedback",
  navigation: "Navigation",
  overlay: "Overlays",
};

interface ComponentDocPageProps {
  data: ComponentDoc;
}

export function ComponentDocPage({ data }: ComponentDocPageProps) {
  const categoryLabel = categoryLabels[data.category] ?? data.category;
  const exampleEntries = Object.entries(data.examples);
  const [previewMode, setPreviewMode] = useState<"preview" | "code">("preview");

  return (
    <div>
      <h1>
        {data.name}
        <Badge variant="primary" className="ml-3 align-middle text-xs">
          {categoryLabel}
        </Badge>
      </h1>
      <p>{data.description}</p>

      <h2>Preview</h2>
      <div className="not-prose glass rounded-xl border border-surface-700/50 overflow-hidden">
        <div className="bg-surface-950/50 px-4 py-2 border-b border-surface-700/50 flex items-center justify-between">
          <span className="text-xs text-surface-500 font-mono">
            {previewMode === "preview" ? "Live Preview" : "View Code"}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-surface-700 overflow-hidden">
              <button
                onClick={() => setPreviewMode("preview")}
                className={cn(
                  "p-1.5 transition-colors",
                  previewMode === "preview"
                    ? "bg-surface-700 text-surface-100"
                    : "text-surface-500 hover:text-surface-300"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewMode("code")}
                className={cn(
                  "p-1.5 transition-colors",
                  previewMode === "code"
                    ? "bg-surface-700 text-surface-100"
                    : "text-surface-500 hover:text-surface-300"
                )}
              >
                <Code2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        {previewMode === "preview" ? (
          <div className="p-4">{data.preview}</div>
        ) : (
          data.previewCode && (
            <div className="border-t border-surface-700/50">
              <CodeBlock code={data.previewCode} language="tsx" />
            </div>
          )
        )}
      </div>

      <h2>Import</h2>
      <CodeBlock code={data.imports} language="tsx" />

      <h2>Props</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Prop</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Type</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Default</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {data.props.map((prop) => (
              <tr key={prop.name} className="border-b border-surface-800/50">
                <td className="py-3 px-3 text-awesome-300 font-mono text-xs">{prop.name}</td>
                <td className="py-3 px-3 text-surface-400 text-xs font-mono">{prop.type}</td>
                <td className="py-3 px-3 text-surface-500 text-xs">{prop.default}</td>
                <td className="py-3 px-3 text-surface-400 text-xs">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.slots.length > 0 && (
        <>
          <h2>Slots</h2>
          <div className="overflow-x-auto not-prose">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-800">
                  <th className="text-left py-3 px-3 text-surface-400 font-medium">Slot</th>
                  <th className="text-left py-3 px-3 text-surface-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {data.slots.map((slot) => (
                  <tr key={slot.name} className="border-b border-surface-800/50">
                    <td className="py-3 px-3 text-awesome-300 font-mono text-xs">{slot.name}</td>
                    <td className="py-3 px-3 text-surface-400 text-xs">{slot.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2>Examples</h2>
      {exampleEntries.map(([framework, code]) => (
        <div key={framework}>
          <h3 className="capitalize">{framework}</h3>
          <CodeBlock code={code} language="tsx" />
        </div>
      ))}
    </div>
  );
}