import { CodeBlock } from "@/components/code-block";
import { TerminalBlock } from "@/components/terminal-block";
import { DocHeader } from "@/components/doc-header";
import { getStaticTextsServer } from "@/lib/db-texts";

export default async function CliDocsPage() {
	const { cliDocs: t } = await getStaticTextsServer();
  return (
    <div>
      <DocHeader heading={t.heading} subheading={t.subheading} />

      <h2 id="init">{t.sections.init.heading}</h2>
      <p>{t.sections.init.description}</p>

      <CodeBlock code={`npx awesomeui init [options]

Options:
  --framework, -f <name>    Target framework (react, vue, svelte, solid, angularjs, react-native)
  --style, -s <name>        Style adapter (tailwind, css, css-in-js, panda)
  --output, -o <path>       Output directory for components (default: ./src/components/ui)
  --no-typescript           Generate JavaScript instead of TypeScript (default: typescript on)
  --yes, -y                 Skip prompts and use defaults`} language="bash" />

      <h3>{t.sections.init.example.heading}</h3>
      <TerminalBlock commands={[...t.sections.init.example.commands]} autoPlay restartDelay={6000} />

      <h2 id="add">{t.sections.add.heading}</h2>
      <p>{t.sections.add.description}</p>

      <CodeBlock code={`npx awesomeui add <component> [options]

Components:
  button        Button component with variants
  badge         Badge / pill
  input         Text input with label and validation
  card          Card with header, body, footer
  dialog        Modal dialog with overlay
  alert         Alert banner with variants
  avatar        Avatar with fallback and status
  checkbox      Checkbox with indeterminate state
  select        Select dropdown
  switch        Toggle switch
  textarea      Multi-line text input
  skeleton      Loading placeholder
  table         Data table
  accordion     Accordion / collapse
  tabs          Tabbed interface
  tooltip       Tooltip on hover
  toast         Toast notifications
  sidebar       Collapsible sidebar navigation
  menubar       Menu bar with dropdowns
  loading       Loading spinner / progress
  progress      Progress bar
  pagination    Page navigation
  breadcrumb    Breadcrumb trail

Options:
  --framework, -f <name>    Target framework (overrides config)
  --style, -s <name>        Style adapter (overrides config)
  --output, -o <path>       Custom output directory`} language="bash" />

      <h3>{t.sections.add.example.heading}</h3>
      <TerminalBlock commands={[...t.sections.add.example.commands]} autoPlay restartDelay={6000} />

      <h2 id="list">{t.sections.list.heading}</h2>
      <p>{t.sections.list.description}</p>

      <CodeBlock code={`npx awesomeui list

Displays all available components in a formatted table.`} language="bash" />

      <h3>{t.sections.list.example.heading}</h3>
      <TerminalBlock commands={[...t.sections.list.example.commands]} autoPlay restartDelay={6000} />

      <h2>{t.sections.config.heading}</h2>
      <p>{t.sections.config.description}</p>

      <CodeBlock code={`{
  "framework": "react",
  "style": "tailwind",
  "typescript": true,
  "outputDir": "./src/components/ui",
  "components": [
    "button",
    "badge",
    "input",
    "card",
    "dialog",
    "tabs",
    "table"
  ]
}`} language="json" />

      <h2>{t.sections.nextSteps.heading}</h2>
      <ul>
        {t.sections.nextSteps.links.map((link: any) => (
          <li key={link.href}>
            {link.prefix}<a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
