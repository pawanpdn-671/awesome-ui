import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";

export default function ButtonDocPage() {
  return (
    <div>
      <h1>
        Button
        <Badge variant="primary" className="ml-3 align-middle text-xs">Actions</Badge>
      </h1>
      <p>
        Buttons trigger actions. Available in multiple variants, sizes, and states.
        Consistent API across all frameworks.
      </p>

      <h2>Import</h2>
      <CodeBlock code={`import { Button } from '@awesomeui/react'`} language="tsx" />

      <h2>Variants</h2>
      <p>Five visual variants to match different levels of emphasis:</p>
      <CodeBlock code={`<Button variant="primary">   Primary action</Button>
<Button variant="secondary"> Secondary action</Button>
<Button variant="outline">   Outlined action</Button>
<Button variant="ghost">     Subtle action</Button>
<Button variant="glow">      Emphasized action</Button>`} language="tsx" />

      <h2>Sizes</h2>
      <CodeBlock code={`<Button size="sm"> Small </Button>
<Button size="md"> Medium </Button>
<Button size="lg"> Large </Button>`} language="tsx" />

      <h2>States</h2>
      <CodeBlock code={`<Button disabled>        Disabled</Button>
<Button loading>         Loading state</Button>
<Button loading={true}>  With spinner</Button>`} language="tsx" />

      <h2>Props</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Prop</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Type</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Default</th>
            </tr>
          </thead>
          <tbody>
            {[
              { prop: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "glow"', default: '"primary"' },
              { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
              { prop: "disabled", type: "boolean", default: "false" },
              { prop: "loading", type: "boolean", default: "false" },
              { prop: "type", type: '"button" | "submit" | "reset"', default: '"button"' },
            ].map((row) => (
              <tr key={row.prop} className="border-b border-surface-800/50">
                <td className="py-3 px-3 text-awesome-300 font-mono text-xs">{row.prop}</td>
                <td className="py-3 px-3 text-surface-400 text-xs font-mono">{row.type}</td>
                <td className="py-3 px-3 text-surface-500 text-xs">{row.default}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Framework Examples</h2>
      <CodeBlock code={`// Vue
<template>
  <Button variant="primary" size="lg">Submit</Button>
</template>

// Angular
<aw-button variant="primary" size="lg">Submit</aw-button>

// Svelte
<Button variant="primary" size="lg">Submit</Button>`} language="tsx" />
    </div>
  );
}
