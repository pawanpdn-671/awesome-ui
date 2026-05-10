import { CodeBlock } from "@/components/code-block";
import { DocHeader } from "@/components/doc-header";
import { gettingStarted as t } from "@/texts";

export default function GettingStartedPage() {
  const s = t.sections;

  return (
    <div>
      <DocHeader heading={t.heading} subheading={t.subheading} />

      <h2>{s.installation.heading}</h2>
      <p>{s.installation.description}</p>

      {s.installation.frameworks.map((fw) => (
        <div key={fw.name}>
          <h3>{fw.name}</h3>
          <CodeBlock code={fw.command} language="bash" />
        </div>
      ))}

      <p>{s.installation.orWithOther}</p>
      <CodeBlock code={`yarn add @awesomeui/react\npnpm add @awesomeui/react\nbun add @awesomeui/react`} language="bash" />

      <h2 id="quick-start">{s.quickStart.heading}</h2>
      <p>{s.quickStart.description}</p>

      <CodeBlock code={`import { Button, Card } from '@awesomeui/react'

function App() {
  return (
    <Card className="p-6 max-w-sm">
      <h2 className="text-lg font-semibold mb-2">
        ${s.quickStart.welcome}
      </h2>
      <p className="text-surface-400 mb-4">
        ${s.quickStart.ready}
      </p>
      <Button variant="primary">
        ${s.quickStart.cta}
      </Button>
    </Card>
  )
}`} language="tsx" />

      <h2 id="frameworks">{s.frameworkSetup.heading}</h2>
      <p>{s.frameworkSetup.description}</p>

      <h3>{s.frameworkSetup.nextjs.heading}</h3>
      <p>{s.frameworkSetup.nextjs.description}</p>
      <CodeBlock code={`// app/page.tsx
import { Button, Card } from '@awesomeui/react'

export default function Home() {
  return (
    <Card>
      <Button variant="primary">
        ${s.frameworkSetup.nextjs.hello}
      </Button>
    </Card>
  )
}`} language="tsx" />

      <h3>{s.frameworkSetup.vue.heading}</h3>
      <CodeBlock code={`<template>
  <Card>
    <Button variant="primary">
      ${s.frameworkSetup.vue.hello}
    </Button>
  </Card>
</template>

<script setup lang="ts">
import { Button, Card } from '@awesomeui/vue'
</script>`} language="vue" />

      <h2>{s.cli.heading}</h2>
      <p>{s.cli.description}</p>
      <CodeBlock code={`# Initialize AwesomeUI in your project
npx awesomeui init

# Add individual components
npx awesomeui add button
npx awesomeui add dialog
npx awesomeui add card

# List all available components
npx awesomeui list`} language="bash" />

      <h2>{s.nextSteps.heading}</h2>
      <ul>
        {s.nextSteps.links.map((link) => (
          <li key={link.href}>
            {link.prefix}<a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
