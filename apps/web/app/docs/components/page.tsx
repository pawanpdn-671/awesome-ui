import { CodeBlock } from "@/components/code-block";
import { DocHeader } from "@/components/doc-header";
import { componentsDocs as t } from "@/texts";

export default function ComponentsDocsPage() {
  return (
    <div>
      <DocHeader heading={t.heading} subheading={t.subheading} />

      <h2>{t.importPattern.heading}</h2>
      <p>{t.importPattern.description}</p>

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

      <h2>{t.button.heading}</h2>
      <p>{t.button.description}</p>

      <CodeBlock code={`import { Button } from '@awesomeui/react'

function Example() {
  return (
    <div className="flex gap-4">
      <Button variant="primary">${t.button.variants.primary}</Button>
      <Button variant="secondary">${t.button.variants.secondary}</Button>
      <Button variant="outline">${t.button.variants.outline}</Button>
      <Button variant="ghost">${t.button.variants.ghost}</Button>
      <Button variant="glow">${t.button.variants.glow}</Button>
    </div>
  )
}`} language="tsx" />

      <h3>{t.props.tableHeaders[0]}</h3>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              {t.props.tableHeaders.map((h) => (
                <th key={h} className="text-left py-3 px-3 text-surface-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.props.rows.map((row) => (
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

      <h2>{t.dialog.heading}</h2>
      <p>{t.dialog.description}</p>

      <CodeBlock code={`import { Dialog, DialogTrigger, DialogContent } from '@awesomeui/react'

function Example() {
  return (
    <Dialog>
      <DialogTrigger>${t.dialog.trigger}</DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-semibold mb-4">${t.dialog.title}</h2>
        <p className="text-surface-400 mb-6">
          ${t.dialog.body}
        </p>
        <Button variant="primary">${t.dialog.confirm}</Button>
      </DialogContent>
    </Dialog>
  )
}`} language="tsx" />

      <h2>{t.nextSteps.heading}</h2>
      <ul>
        {t.nextSteps.links.map((link) => (
          <li key={link.href}>
            {link.prefix}<a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
