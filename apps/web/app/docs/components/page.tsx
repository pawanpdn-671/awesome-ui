import { CodeBlock } from "@/components/code-block";

export default function ComponentsDocsPage() {
  return (
    <div>
      <h1>Components</h1>
      <p>
        AwesomeUI provides a comprehensive library of production-ready components.
        Every component works identically across all supported frameworks.
      </p>

      <h2>Available Components</h2>
      <p>
        Our component library includes 26+ components across 7 categories:
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-6 mb-8 not-prose">
        {[
          { cat: "Actions", items: ["Button", "Dropdown Menu", "Menubar"] },
          { cat: "Overlay", items: ["Dialog", "Toast", "Tooltip"] },
          { cat: "Data Entry", items: ["Input", "Select", "Checkbox", "Switch", "Textarea", "OTP Input"] },
          { cat: "Data Display", items: ["Table", "Badge", "Avatar", "Card", "Progress", "Skeleton"] },
          { cat: "Navigation", items: ["Tabs", "Breadcrumb", "Pagination", "Sidebar", "Command Menu"] },
          { cat: "Layout", items: ["Card", "Accordion", "Accordion Item", "Sidebar"] },
          { cat: "Feedback", items: ["Alert", "Loading", "Toast", "Progress"] },
        ].map((group) => (
          <div key={group.cat} className="glass rounded-xl p-5 border border-surface-800/50">
            <h3 className="text-sm font-semibold text-awesome-400 mb-2">{group.cat}</h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-surface-400">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2>Import Pattern</h2>
      <p>
        All components are importable directly from the framework package:
      </p>

      <CodeBlock code={`// React / Next.js
import { Button, Dialog, Card, Input } from '@awesomeui/react'

// Vue
import { Button, Dialog, Card, Input } from '@awesomeui/vue'

// Angular
import { ButtonModule, DialogModule, CardModule } from '@awesomeui/angular'

// Svelte
import { Button, Dialog, Card, Input } from '@awesomeui/svelte'

// SolidJS
import { Button, Dialog, Card, Input } from '@awesomeui/solid`} language="tsx" />

      <h2>Button Component</h2>
      <p>Buttons are used to trigger actions. Available in multiple variants and sizes.</p>

      <CodeBlock code={`import { Button } from '@awesomeui/react'

function Example() {
  return (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="glow">Glow</Button>
    </div>
  )
}`} language="tsx" />

      <h3>Props</h3>
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
            {[
              { prop: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "glow"', default: '"primary"', desc: "Visual style variant" },
              { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Button size" },
              { prop: "disabled", type: "boolean", default: "false", desc: "Disables the button" },
              { prop: "loading", type: "boolean", default: "false", desc: "Shows loading state" },
              { prop: "children", type: "ReactNode", default: "-", desc: "Button content" },
            ].map((row) => (
              <tr key={row.prop} className="border-b border-surface-800/50">
                <td className="py-3 px-3 text-awesome-300 font-mono text-xs">{row.prop}</td>
                <td className="py-3 px-3 text-surface-400 text-xs font-mono">{row.type}</td>
                <td className="py-3 px-3 text-surface-500 text-xs">{row.default}</td>
                <td className="py-3 px-3 text-surface-400 text-xs">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Dialog Component</h2>
      <p>Modal dialogs with overlay, focus trap, and keyboard dismissal.</p>

      <CodeBlock code={`import { Dialog, DialogTrigger, DialogContent } from '@awesomeui/react'

function Example() {
  return (
    <Dialog>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-semibold mb-4">Dialog Title</h2>
        <p className="text-surface-400 mb-6">
          This is a dialog with focus trap and ESC to close.
        </p>
        <Button variant="primary">Confirm</Button>
      </DialogContent>
    </Dialog>
  )
}`} language="tsx" />

      <h2>Next Steps</h2>
      <ul>
        <li>Visit the <a href="/components">interactive component showcase</a></li>
        <li>Learn about <a href="/docs/theming">theming and customization</a></li>
        <li>Check the <a href="/docs/api-reference">full API reference</a></li>
      </ul>
    </div>
  );
}
