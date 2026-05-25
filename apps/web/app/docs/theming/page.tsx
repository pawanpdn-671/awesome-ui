import { CodeBlock } from "@/components/code-block";
import { DocHeader } from "@/components/doc-header";
import { getStaticTextsServer } from "@/lib/db-texts";

export default async function ThemingPage() {
	const { themingDocs: t } = await getStaticTextsServer();
  return (
    <div>
      <DocHeader heading={t.heading} subheading={t.subheading} />

      <h2 id="tokens">{t.sections.tokens.heading}</h2>
      <p>{t.sections.tokens.description}</p>

      <CodeBlock code={`// @awesomeui/tokens
const tokens = {
  colors: {
    awesome: { 50: '#ffffff', 500: '#000000', 900: '#6b6b6b' },
    surface: { 50: '#ffffff', 900: '#0a0a0a', 950: '#050505' },
    blue: { 50: '#eef2ff', 500: '#6366f1', 900: '#312e81' },
    gray: { 50: '#f9fafb', 500: '#6b7280', 900: '#111827' },
    red: { 50: '#fef2f2', 500: '#ef4444', 900: '#7f1d1d' },
    emerald: { 50: '#ecfdf5', 500: '#10b981', 900: '#064e3b' },
    success: { 50: '#f2fdf4', 500: '#005d1c' },
    warning: { 50: '#fffcf0', 500: '#a35000' },
    danger: { 50: '#fff2f1', 500: '#a80000' },
  },
  spacing: { 4: '1rem', 8: '2rem', 16: '4rem' },
  typography: {
    fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'], mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'] },
  },
  radius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', '2xl': '1rem', full: '9999px' },
}`} language="tsx" />

      <h2 id="css-variables">{t.sections.cssVariables.heading}</h2>
      <p>{t.sections.cssVariables.description}</p>

      <CodeBlock code={`:root {
  /* Colors */
  --awesome-50: #ffffff;
  --awesome-500: #000000;
  --awesome-900: #6b6b6b;

  --surface-50: #ffffff;
  --surface-900: #0a0a0a;
  --surface-950: #050505;

  /* Spacing */
  --spacing-4: 1rem;
  --spacing-8: 2rem;

  /* Typography */
  --font-sans: 'Inter', 'ui-sans-serif', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', monospace;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}`} language="css" />

      <h2 id="dark-mode">{t.sections.darkMode.heading}</h2>
      <p>{t.sections.darkMode.description}</p>

      <CodeBlock code={`/* Use the dark theme — toggle with JS */
.dark {
  --awesome-500: #000000;
  --surface-50: #ebebeb;
  --surface-900: #0a0a0a;
  --surface-950: #050505;
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
//   --background: #050505;
//   --foreground: #ffffff;
//   --accent: #000000;
//   --border: #0f0f0f;
//   ...
// }

// Access theme values
console.log(darkTheme.colors.accent) // #000000`} language="tsx" />

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
