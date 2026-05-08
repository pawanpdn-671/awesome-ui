import { CodeBlock } from "@/components/code-block";
import { TerminalBlock } from "@/components/code-block";

export default function CliDocsPage() {
  return (
    <div>
      <h1>CLI Reference</h1>
      <p>
        The AwesomeUI CLI is your command-line interface for initializing projects,
        adding components, and managing your AwesomeUI configuration.
      </p>

      <h2 id="init">Init Command</h2>
      <p>
        Initialize AwesomeUI in your project. Detects your framework and style system automatically.
      </p>

      <CodeBlock code={`npx awesomeui init [options]

Options:
  --framework <name>    Framework to use (react, next, vue, angular, svelte, solid)
  --style <name>        Style system (tailwind, css)
  --dir <path>          Output directory for components (default: ./src/components/ui)
  --typescript          Enable TypeScript (default: true)
  --yes, -y             Skip prompts and use defaults`} language="bash" />

      <h3>Example</h3>
      <TerminalBlock commands={[
        "npx awesomeui init",
        "✔ Detecting project environment...",
        "✔ Framework detected: Next.js 15",
        "✔ Style system detected: Tailwind CSS",
        "✔ TypeScript: enabled",
        "",
        "✔ AwesomeUI initialized successfully!",
        "  → Config created: awesomeui.config.json",
        "  → Components will be generated in: src/components/ui",
        "",
        "Run `npx awesomeui add <component>` to add components.",
      ]} />

      <h2 id="add">Add Command</h2>
      <p>
        Add individual components to your project. Components are transpiled to your
        framework of choice.
      </p>

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

      <h3>Example</h3>
      <TerminalBlock commands={[
        "npx awesomeui add button dialog card",
        "✔ Reading component definitions...",
        "✔ Transpiling to React...",
        "✔ Writing button.tsx",
        "✔ Writing dialog.tsx",
        "✔ Writing card.tsx",
        "",
        "✔ 3 components added successfully!",
        "  → src/components/ui/button.tsx",
        "  → src/components/ui/dialog.tsx",
        "  → src/components/ui/card.tsx",
      ]} />

      <h2 id="list">List Command</h2>
      <p>List all available components with their categories and status.</p>

      <CodeBlock code={`npx awesomeui list [options]

Options:
  --framework <name>    Filter by framework support
  --category <name>     Filter by category
  --available           Show only available (not yet added) components`} language="bash" />

      <h3>Example Output</h3>
      <TerminalBlock commands={[
        "npx awesomeui list",
        "",
        "Available components (26):",
        "",
        "Actions:",
        "  • button         Button with variants",
        "  • dropdown-menu  Dropdown menu",
        "  • menubar        Menu bar",
        "",
        "Overlay:",
        "  • dialog         Modal dialog",
        "  • toast          Toast notification",
        "  • tooltip        Tooltip",
        "",
        "Data Entry:",
        "  • input          Text input",
        "  • select         Select dropdown",
        "  • checkbox       Checkbox",
        "  • switch         Toggle switch",
        "  • textarea       Text area",
        "",
        "Data Display:",
        "  • table          Data table",
        "  • badge          Badge / pill",
        "  • avatar         Avatar",
        "  • card           Card",
        "  • progress       Progress bar",
        "  • skeleton       Skeleton loader",
        "",
        "Navigation:",
        "  • tabs           Tabs",
        "  • breadcrumb     Breadcrumb",
        "  • pagination     Pagination",
        "  • sidebar        Sidebar",
        "",
        "Layout:",
        "  • accordion      Accordion",
        "  • accordion-item Accordion item",
        "",
        "Feedback:",
        "  • alert          Alert",
        "  • loading        Loading spinner",
      ]} />

      <h2>Configuration</h2>
      <p>
        AwesomeUI uses a configuration file (<code>awesomeui.config.json</code>) in your project root:
      </p>

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

      <h2>Next Steps</h2>
      <ul>
        <li>Learn about <a href="/docs/theming">theming and customization</a></li>
        <li>Explore the <a href="/docs/components">component library</a></li>
        <li>Check the <a href="/docs/api-reference">API reference</a></li>
      </ul>
    </div>
  );
}
