import { CodeBlock } from "@/components/code-block";
import { TerminalBlock } from "@/components/code-block";
import { cliDocs as t } from "@/texts";

export default function CliDocsPage() {
  return (
    <div>
      <h1>{t.heading}</h1>
      <p>{t.subheading}</p>

      <h2 id="init">{t.sections.init.heading}</h2>
      <p>{t.sections.init.description}</p>

      <CodeBlock code={`npx awesomeui init [options]

Options:
  --framework <name>    Framework to use (react, next, vue, angular, svelte, solid)
  --style <name>        Style system (tailwind, css)
  --dir <path>          Output directory for components (default: ./src/components/ui)
  --typescript          Enable TypeScript (default: true)
  --yes, -y             Skip prompts and use defaults`} language="bash" />

      <h3>{t.sections.init.example.heading}</h3>
      <TerminalBlock commands={[...t.sections.init.example.commands]} />

      <h2 id="add">{t.sections.add.heading}</h2>
      <p>{t.sections.add.description}</p>

      <CodeBlock code={`npx awesomeui add <component> [options]

Components:
  button        Button component with variants
  dialog        Modal dialog with overlay
  card          Card with header, body, footer
  input         Text input with label and validation
  select        Select dropdown
  checkbox      Checkbox input
  switch        Toggle switch
  table         Data table
  tabs          Tabbed interface
  accordion     Accordion / collapse
  badge         Badge / pill
  avatar        Avatar component
  tooltip       Tooltip on hover
  toast         Toast notifications
  ... and more

Options:
  --framework <name>    Override framework detection
  --dir <path>          Custom output directory`} language="bash" />

      <h3>{t.sections.add.example.heading}</h3>
      <TerminalBlock commands={[...t.sections.add.example.commands]} />

      <h2 id="list">{t.sections.list.heading}</h2>
      <p>{t.sections.list.description}</p>

      <CodeBlock code={`npx awesomeui list [options]

Options:
  --framework <name>    Filter by framework support
  --category <name>     Filter by category
  --available           Show only available (not yet added) components`} language="bash" />

      <h3>{t.sections.list.example.heading}</h3>
      <TerminalBlock commands={[...t.sections.list.example.commands]} />

      <h2>{t.sections.config.heading}</h2>
      <p>{t.sections.config.description}</p>

      <CodeBlock code={`{
  "framework": "react",
  "style": "tailwind",
  "outputDir": "./src/components/ui",
  "typescript": true,
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
        {t.sections.nextSteps.links.map((link) => (
          <li key={link.href}>
            {link.prefix}<a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
