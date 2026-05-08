import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { buttonDoc as t } from "@/texts";

export default function ButtonDocPage() {
  const s = t.sections;

  return (
    <div>
      <h1>
        {t.heading}
        <Badge variant="primary" className="ml-3 align-middle text-xs">{t.badge}</Badge>
      </h1>
      <p>{t.subheading}</p>

      <h2>{s.import.heading}</h2>
      <CodeBlock code={`import { Button } from '@awesomeui/react'`} language="tsx" />

      <h2>{s.variants.heading}</h2>
      <p>{s.variants.description}</p>
      <CodeBlock code={`<Button variant="primary">   ${s.variants.primary}</Button>
<Button variant="secondary"> ${s.variants.secondary}</Button>
<Button variant="outline">   ${s.variants.outline}</Button>
<Button variant="ghost">     ${s.variants.ghost}</Button>
<Button variant="glow">      ${s.variants.glow}</Button>`} language="tsx" />

      <h2>{s.sizes.heading}</h2>
      <CodeBlock code={`<Button size="sm"> ${s.sizes.small} </Button>
<Button size="md"> ${s.sizes.medium} </Button>
<Button size="lg"> ${s.sizes.large} </Button>`} language="tsx" />

      <h2>{s.states.heading}</h2>
      <CodeBlock code={`<Button disabled>        ${s.states.disabled}</Button>
<Button loading>         ${s.states.loading}</Button>
<Button loading={true}>  ${s.states.spinner}</Button>`} language="tsx" />

      <h2>{s.props.heading}</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              {s.props.tableHeaders.map((h) => (
                <th key={h} className="text-left py-3 px-3 text-surface-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.props.rows.map((row) => (
              <tr key={row.prop} className="border-b border-surface-800/50">
                <td className="py-3 px-3 text-awesome-300 font-mono text-xs">{row.prop}</td>
                <td className="py-3 px-3 text-surface-400 text-xs font-mono">{row.type}</td>
                <td className="py-3 px-3 text-surface-500 text-xs">{row.default}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{s.frameworkExamples.heading}</h2>
      <CodeBlock code={`// Vue
<template>
  <Button variant="primary" size="lg">${s.frameworkExamples.submit}</Button>
</template>

// Angular
<aw-button variant="primary" size="lg">${s.frameworkExamples.submit}</aw-button>

// Svelte
<Button variant="primary" size="lg">${s.frameworkExamples.submit}</Button>`} language="tsx" />
    </div>
  );
}
