import { CodeBlock } from "@/components/code-block";
import { accessibility as t } from "@/texts";

export default function AccessibilityPage() {
  return (
    <div>
      <h1>{t.heading}</h1>
      <p>{t.subheading}</p>

      <h2>{t.sections.commitment.heading}</h2>
      <ul>
        {t.sections.commitment.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t.sections.aria.heading}</h2>
      <p>{t.sections.aria.description}</p>

      <CodeBlock code={`// Button
<button
  role="button"
  aria-disabled={disabled}
  aria-label={ariaLabel}
  aria-describedby={ariaDescribedby}
>
  {children}
</button>

// Dialog
<div role="dialog" aria-modal="true" aria-label={title}>
  <div role="document">
    {children}
  </div>
</div>

// Tabs
<div role="tablist">
  <button role="tab" aria-selected={isActive}>
    Tab 1
  </button>
  <div role="tabpanel">
    Panel content
  </div>
</div>`} language="tsx" />

      <h2>{t.sections.keyboardNav.heading}</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              {t.sections.keyboardNav.tableHeaders.map((h) => (
                <th key={h} className="text-left py-3 px-3 text-surface-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.sections.keyboardNav.rows.map((row) => (
              <tr key={`${row.comp}-${row.action}`} className="border-b border-surface-800/50">
                <td className="py-3 px-3 text-surface-200 text-xs">{row.comp}</td>
                <td className="py-3 px-3 text-surface-400 text-xs">{row.action}</td>
                <td className="py-3 px-3 text-awesome-300 text-xs font-mono">{row.key}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{t.sections.focusManagement.heading}</h2>
      <p>{t.sections.focusManagement.description}</p>

      <ul>
        {t.sections.focusManagement.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t.sections.reducedMotion.heading}</h2>
      <p>{t.sections.reducedMotion.description}</p>

      <CodeBlock code={`/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-up,
  .animate-slide-down {
    animation: none;
  }
}`} language="css" />

      <h2>{t.sections.testing.heading}</h2>
      <p>{t.sections.testing.description}</p>

      <ul>
        {t.sections.testing.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
