import { CodeBlock } from "@/components/code-block";

export default function ApiReferencePage() {
  return (
    <div>
      <h1>API Reference</h1>
      <p>
        Complete API documentation for AwesomeUI packages. Every component, hook, and utility
        follows the same API philosophy across all frameworks.
      </p>

      <h2 id="common-props">Common Props</h2>
      <p>
        All AwesomeUI components share a consistent set of props for styling, behavior,
        and accessibility:
      </p>

      <CodeBlock code={`// Common props available on all components
interface AwesomeUIProps {
  // Styling
  className?: string
  style?: React.CSSProperties
  variant?: string
  size?: 'sm' | 'md' | 'lg'

  // State
  disabled?: boolean
  loading?: boolean

  // Accessibility
  ariaLabel?: string
  ariaDescribedby?: string

  // Data Attributes
  dataTestid?: string
}`} language="tsx" />

      <h2 id="component-api">Component API</h2>
      <p>
        Every component in AwesomeUI follows a predictable API pattern:
      </p>

      <ul>
        <li><strong>Compound components</strong> for complex UI (Dialog, Tabs, Command)</li>
        <li><strong>Controlled and uncontrolled</strong> state management</li>
        <li><strong>Ref forwarding</strong> for direct DOM access</li>
        <li><strong>Event handlers</strong> follow framework conventions (onClick, @click)</li>
      </ul>

      <h2 id="types">TypeScript Types</h2>
      <p>
        AwesomeUI is fully typed. All components export their props interfaces:
      </p>

      <CodeBlock code={`import type { ButtonProps, CardProps, DialogProps } from '@awesomeui/react'

// Full autocomplete support
const props: ButtonProps = {
  variant: 'primary',
  size: 'lg',
  disabled: false,
}`} language="tsx" />

      <h2 id="theming-api">Theming API</h2>
      <p>
        Customize themes using CSS variables. Every design token is exposed as a CSS custom property:
      </p>

      <CodeBlock code={`/* Override theme tokens */
:root {
  --awesome-500: #7c3aed;
  --radius-xl: 1rem;
  --font-sans: 'Inter', system-ui, sans-serif;
}

/* Dark mode overrides */
.dark {
  --surface-900: #0c0a09;
  --surface-950: #000000;
}`} language="css" />

      <h2 id="events">Event Handling</h2>
      <p>
        Events follow each framework&apos;s conventions while maintaining consistent behavior:
      </p>

      <CodeBlock code={`// React — onClick
<Button onClick={() => console.log('clicked')} />

// Vue — @click
<Button @click="handleClick" />

// Angular — (click)
<aw-button (click)="handleClick()">
  Click
</aw-button>

// Svelte — on:click
<Button on:click={handleClick}>
  Click
</Button>`} language="tsx" />

      <h2>Package Reference</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Package</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Description</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Version</th>
            </tr>
          </thead>
          <tbody>
            {[
              { pkg: "@awesomeui/core", desc: "Core IR schema and types", ver: "0.1.0" },
              { pkg: "@awesomeui/react", desc: "React components", ver: "0.1.0" },
              { pkg: "@awesomeui/next", desc: "Next.js adapter", ver: "0.1.0" },
              { pkg: "@awesomeui/vue", desc: "Vue components", ver: "0.1.0" },
              { pkg: "@awesomeui/angular", desc: "Angular components", ver: "0.1.0" },
              { pkg: "@awesomeui/svelte", desc: "Svelte components", ver: "0.1.0" },
              { pkg: "@awesomeui/solid", desc: "SolidJS components", ver: "0.1.0" },
              { pkg: "@awesomeui/react-native", desc: "React Native components", ver: "0.1.0" },
              { pkg: "@awesomeui/tokens", desc: "Design tokens", ver: "0.1.0" },
              { pkg: "@awesomeui/themes", desc: "Theming system", ver: "0.1.0" },
              { pkg: "@awesomeui/cli", desc: "CLI tooling", ver: "0.1.0" },
            ].map((row) => (
              <tr key={row.pkg} className="border-b border-surface-800/50">
                <td className="py-3 px-3 text-awesome-300 font-mono text-xs">{row.pkg}</td>
                <td className="py-3 px-3 text-surface-400 text-xs">{row.desc}</td>
                <td className="py-3 px-3 text-surface-500 text-xs">{row.ver}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
