import { CodeBlock } from "@/components/code-block";

export default function GuidesPage() {
  return (
    <div>
      <h1>Guides</h1>
      <p>
        Best practices, migration guides, performance tips, and accessibility
        guidelines for building with AwesomeUI.
      </p>

      <h2 id="migration">Migration Guide</h2>
      <p>
        Migrating from other UI libraries to AwesomeUI is straightforward thanks
        to our familiar API patterns.
      </p>

      <h3>From Material UI</h3>
      <CodeBlock code={`// Before: Material UI
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'

// After: AwesomeUI
import { Button, Card } from '@awesomeui/react'

// Props are similar but simplified
<Button variant="contained" color="primary">
  → <Button variant="primary">

<Card sx={{ padding: 2 }}>
  → <Card className="p-2">`} language="tsx" />

      <h3>From shadcn/ui</h3>
      <CodeBlock code={`// Before: shadcn/ui
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// After: AwesomeUI
import { Button, Card } from '@awesomeui/react'

// Same developer experience, zero setup
// Components are pre-built — no copy-paste needed`} language="tsx" />

      <h2 id="performance">Performance</h2>
      <p>
        AwesomeUI is built for performance from the ground up:
      </p>

      <ul>
        <li><strong>Tree shaking</strong> — Import only what you use</li>
        <li><strong>Minimal bundle</strong> — ~5kB per component</li>
        <li><strong>Zero dependencies</strong> — No heavy runtime libraries</li>
        <li><strong>SSR optimized</strong> — Works seamlessly with server rendering</li>
        <li><strong>Lazy loading</strong> — Components can be dynamically imported</li>
      </ul>

      <CodeBlock code={`// Dynamic imports for code splitting
import dynamic from 'next/dynamic'

const Dialog = dynamic(
  () => import('@awesomeui/react').then(mod => mod.Dialog),
  { ssr: false }
)`} language="tsx" />

      <h2 id="accessibility">Accessibility</h2>
      <p>
        AwesomeUI is committed to accessibility. All components follow WAI-ARIA
        guidelines and are tested with screen readers and keyboard navigation.
      </p>

      <h3>Keyboard Navigation</h3>
      <ul>
        <li>All interactive elements are keyboard focusable</li>
        <li>Dialogs trap focus and close with Escape</li>
        <li>Dropdowns navigate with arrow keys</li>
        <li>Tabs navigate with arrow keys</li>
        <li>Command menu opens with Ctrl+K / Cmd+K</li>
      </ul>

      <h3>Screen Reader Support</h3>
      <ul>
        <li>All components have proper ARIA labels</li>
        <li>Live regions for dynamic content</li>
        <li>Announcements for loading states</li>
        <li>Descriptive error messages for forms</li>
      </ul>

      <CodeBlock code={`// All components include ARIA attributes
<Button
  ariaLabel="Submit form"
  ariaDescribedby="form-error"
  loading={isSubmitting}
>
  Submit
</Button>

<Dialog ariaLabel="Confirm delete">
  {/* Focus trap, ESC to close, aria-modal */}
  ...
</Dialog>`} language="tsx" />

      <h3>Color Contrast</h3>
      <p>
        All color combinations meet WCAG 2.1 AA standards for contrast ratio.
        Custom themes should maintain a minimum contrast ratio of 4.5:1 for
        normal text and 3:1 for large text.
      </p>

      <h2>Best Practices</h2>
      <ul>
        <li>Import from the framework-specific package (e.g., @awesomeui/react)</li>
        <li>Use the CLI for component generation and project setup</li>
        <li>Override CSS variables for custom theming instead of using !important</li>
        <li>Leverage TypeScript for full type safety and autocomplete</li>
        <li>Test components across multiple frameworks when building shared UIs</li>
      </ul>
    </div>
  );
}
