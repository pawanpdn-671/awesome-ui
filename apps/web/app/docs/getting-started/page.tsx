import { CodeBlock } from "@/components/code-block";

export default function GettingStartedPage() {
  return (
    <div>
      <h1>Getting Started</h1>
      <p>
        Get up and running with AwesomeUI in minutes. Choose your framework and follow the setup guide.
      </p>

      <h2>Installation</h2>
      <p>
        Install AwesomeUI for your framework of choice using npm, yarn, pnpm, or bun.
      </p>

      <h3>React / Next.js</h3>
      <CodeBlock code={`npm install @awesomeui/react`} language="bash" />
      
      <p>Or with other package managers:</p>
      <CodeBlock code={`yarn add @awesomeui/react\npnpm add @awesomeui/react\nbun add @awesomeui/react`} language="bash" />

      <h3>Vue</h3>
      <CodeBlock code={`npm install @awesomeui/vue`} language="bash" />

      <h3>Angular</h3>
      <CodeBlock code={`npm install @awesomeui/angular`} language="bash" />

      <h3>Svelte</h3>
      <CodeBlock code={`npm install @awesomeui/svelte`} language="bash" />

      <h3>SolidJS</h3>
      <CodeBlock code={`npm install @awesomeui/solid`} language="bash" />

      <h3>React Native</h3>
      <CodeBlock code={`npm install @awesomeui/react-native`} language="bash" />

      <h2 id="quick-start">Quick Start</h2>
      <p>
        Once installed, import and use any component in your application:
      </p>

      <CodeBlock code={`import { Button, Card } from '@awesomeui/react'

function App() {
  return (
    <Card className="p-6 max-w-sm">
      <h2 className="text-lg font-semibold mb-2">
        Welcome to AwesomeUI
      </h2>
      <p className="text-surface-400 mb-4">
        Your cross-framework UI platform is ready.
      </p>
      <Button variant="primary">
        Get Started
      </Button>
    </Card>
  )
}`} language="tsx" />

      <h2 id="frameworks">Framework Setup</h2>
      <p>
        AwesomeUI works with every major framework out of the box. Each framework
        gets the same components with the same API, adapted to framework conventions.
      </p>

      <h3>Next.js App Router</h3>
      <p>For Next.js, AwesomeUI supports both Server and Client Components:</p>
      <CodeBlock code={`// app/page.tsx
import { Button, Card } from '@awesomeui/react'

export default function Home() {
  return (
    <Card>
      <Button variant="primary">
        Hello Next.js
      </Button>
    </Card>
  )
}`} language="tsx" />

      <h3>Vue 3 Composition API</h3>
      <CodeBlock code={`<template>
  <Card>
    <Button variant="primary">
      Hello Vue
    </Button>
  </Card>
</template>

<script setup lang="ts">
import { Button, Card } from '@awesomeui/vue'
</script>`} language="vue" />

      <h2>Using the CLI</h2>
      <p>
        The AwesomeUI CLI helps you initialize projects and add components quickly:
      </p>
      <CodeBlock code={`# Initialize AwesomeUI in your project
npx awesomeui init

# Add individual components
npx awesomeui add button
npx awesomeui add dialog
npx awesomeui add card

# List all available components
npx awesomeui list`} language="bash" />

      <h2>Next Steps</h2>
      <ul>
        <li>Explore the <a href="/docs/components">component library</a></li>
        <li>Learn about <a href="/docs/theming">theming and customization</a></li>
        <li>Check the <a href="/docs/api-reference">API reference</a></li>
        <li>Read the <a href="/docs/guides">guides</a> for best practices</li>
      </ul>
    </div>
  );
}
