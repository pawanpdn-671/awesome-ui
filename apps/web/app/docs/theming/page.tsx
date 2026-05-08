import { CodeBlock } from "@/components/code-block";
import { themingDocs as t } from "@/texts";

export default function ThemingPage() {
  return (
    <div>
      <h1>{t.heading}</h1>
      <p>{t.subheading}</p>

      <h2 id="tokens">{t.sections.tokens.heading}</h2>
      <p>{t.sections.tokens.description}</p>

      <CodeBlock code={`// @awesomeui/tokens
const tokens = {
  colors: {
    awesome: { 50: '#eef2ff', 500: '#6366f1', 900: '#312e81' },
    surface: { 50: '#f8fafc', 900: '#0f172a', 950: '#020617' },
  },
  spacing: { 4: '1rem', 8: '2rem', 16: '4rem' },
  typography: {
    fontFamily: { sans: ['Inter', 'system-ui'], mono: ['JetBrains Mono', 'monospace'] },
  },
  radius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem' },
}`} language="tsx" />

      <h2 id="css-variables">{t.sections.cssVariables.heading}</h2>
      <p>{t.sections.cssVariables.description}</p>

      <CodeBlock code={`:root {
  /* Colors */
  --awesome-50: #eef2ff;
  --awesome-500: #6366f1;
  --awesome-900: #312e81;

  --surface-50: #f8fafc;
  --surface-900: #0f172a;
  --surface-950: #020617;

  /* Spacing */
  --spacing-4: 1rem;
  --spacing-8: 2rem;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}`} language="css" />

      <h2 id="dark-mode">{t.sections.darkMode.heading}</h2>
      <p>{t.sections.darkMode.description}</p>

      <CodeBlock code={`/* Dark mode automatically handled */
.dark {
  --surface-50: #f8fafc;
  --surface-900: #0f172a;
  --surface-950: #020617;
}

/* Toggle with JavaScript */
document.documentElement.classList.toggle('dark')`} language="css" />

      <h2 id="customization">{t.sections.customization.heading}</h2>
      <p>{t.sections.customization.description}</p>

      <CodeBlock code={`/* Custom brand theme */
:root {
  --awesome-500: #7c3aed;
  --awesome-600: #6d28d9;
  --radius-xl: 1rem;
  --font-sans: 'Inter', system-ui, sans-serif;
}

/* Custom dark mode */
.dark {
  --surface-900: #0c0a09;
  --surface-950: #000000;
  --surface-800: #1c1917;
}`} language="css" />

      <h2>{t.sections.programmatic.heading}</h2>
      <p>{t.sections.programmatic.description}</p>

      <CodeBlock code={`import { darkTheme, lightTheme, generateCSSVariables } from '@awesomeui/themes'

// Generate CSS variables
const css = generateCSSVariables(darkTheme)
console.log(css)
// :root {
//   --background: #020617;
//   --foreground: #f8fafc;
//   ...
// }

// Access theme values
console.log(darkTheme.colors.accent) // #6366f1`} language="tsx" />

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
