import { CodeBlock } from "@/components/code-block";
import { DocHeader } from "@/components/doc-header";
import { getStaticTextsServer } from "@/lib/db-texts";

export default async function GuidesPage() {
	const { guides: t } = await getStaticTextsServer();
  return (
    <div>
      <DocHeader heading={t.heading} subheading={t.subheading} />

      <h2 id="migration">{t.sections.migration.heading}</h2>
      <p>{t.sections.migration.description}</p>

      <h3>{t.sections.migration.fromMui.heading}</h3>
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

      <h3>{t.sections.migration.fromShadcn.heading}</h3>
      <CodeBlock code={`// Before: shadcn/ui
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// After: AwesomeUI
import { Button, Card } from '@awesomeui/react'

// Same developer experience, zero setup
// Components are pre-built — no copy-paste needed`} language="tsx" />

      <h2 id="performance">{t.sections.performance.heading}</h2>
      <p>{t.sections.performance.description}</p>

      <ul>
        {t.sections.performance.items.map((item: any) => (
          <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>

      <CodeBlock code={`// Dynamic imports for code splitting
import dynamic from 'next/dynamic'

const Dialog = dynamic(
  () => import('@awesomeui/react').then(mod => mod.Dialog),
  { ssr: false }
)`} language="tsx" />

      <h2 id="accessibility">{t.sections.accessibility.heading}</h2>
      <p>{t.sections.accessibility.description}</p>

      <h3>{t.sections.accessibility.keyboardNav.heading}</h3>
      <ul>
        {t.sections.accessibility.keyboardNav.items.map((item: any) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h3>{t.sections.accessibility.screenReader.heading}</h3>
      <ul>
        {t.sections.accessibility.screenReader.items.map((item: any) => (
          <li key={item}>{item}</li>
        ))}
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

      <h3>{t.sections.accessibility.colorContrast.heading}</h3>
      <p>{t.sections.accessibility.colorContrast.description}</p>

      <h2>{t.sections.bestPractices.heading}</h2>
      <ul>
        {t.sections.bestPractices.items.map((item: any) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
