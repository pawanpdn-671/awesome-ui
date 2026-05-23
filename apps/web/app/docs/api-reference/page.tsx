import { CodeBlock } from "@/components/code-block";
import { DocHeader } from "@/components/doc-header";
import { getStaticTextsServer } from "@/lib/db-texts";

export default async function ApiReferencePage() {
	const { apiReference: t } = await getStaticTextsServer();
  return (
    <div>
      <DocHeader heading={t.heading} subheading={t.subheading} />

      <h2 id="common-props">{t.sections.commonProps.heading}</h2>
      <p>{t.sections.commonProps.description}</p>

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

      <h2 id="component-api">{t.sections.componentApi.heading}</h2>
      <p>{t.sections.componentApi.description}</p>

      <ul>
        {t.sections.componentApi.items.map((item: any) => (
          <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>

      <h2 id="types">{t.sections.types.heading}</h2>
      <p>{t.sections.types.description}</p>

      <CodeBlock code={`import type { ButtonProps, CardProps, DialogProps } from '@awesomeui/react'

// Full autocomplete support
const props: ButtonProps = {
  variant: 'primary',
  size: 'lg',
  disabled: false,
}`} language="tsx" />

      <h2 id="theming-api">{t.sections.themingApi.heading}</h2>
      <p>{t.sections.themingApi.description}</p>

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

      <h2 id="events">{t.sections.events.heading}</h2>
      <p>{t.sections.events.description}</p>

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

      <h2>{t.sections.packageRef.heading}</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              {t.sections.packageRef.tableHeaders.map((h: any) => (
                <th key={h} className="text-left py-3 px-3 text-surface-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.sections.packageRef.packages.map((row: any) => (
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
