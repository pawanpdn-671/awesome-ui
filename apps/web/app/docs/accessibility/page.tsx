import { CodeBlock } from "@/components/code-block";

export default function AccessibilityPage() {
  return (
    <div>
      <h1>Accessibility</h1>
      <p>
        AwesomeUI is built with accessibility as a core principle. Every component
        follows WAI-ARIA guidelines and is rigorously tested.
      </p>

      <h2>Our Commitment</h2>
      <ul>
        <li>All components meet WCAG 2.1 AA standards</li>
        <li>Full keyboard navigation support</li>
        <li>Screen reader friendly with proper ARIA attributes</li>
        <li>Focus management for modals, dialogs, and menus</li>
        <li>Reduced motion support for animations</li>
        <li>Color contrast compliance</li>
      </ul>

      <h2>ARIA Attributes</h2>
      <p>
        Every component includes appropriate ARIA attributes automatically:
      </p>

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

      <h2>Keyboard Navigation</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Component</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Interaction</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Key</th>
            </tr>
          </thead>
          <tbody>
            {[
              { comp: "Dialog", action: "Close", key: "Escape" },
              { comp: "Dropdown Menu", action: "Navigate items", key: "Arrow Up/Down" },
              { comp: "Dropdown Menu", action: "Open/Close", key: "Enter/Space" },
              { comp: "Tabs", action: "Switch tabs", key: "Arrow Left/Right" },
              { comp: "Command Menu", action: "Open menu", key: "Ctrl + K" },
              { comp: "Command Menu", action: "Close menu", key: "Escape" },
              { comp: "Accordion", action: "Toggle section", key: "Enter/Space" },
              { comp: "Select", action: "Open list", key: "Arrow Down" },
              { comp: "Select", action: "Navigate items", key: "Arrow Up/Down" },
            ].map((row) => (
              <tr key={`${row.comp}-${row.action}`} className="border-b border-surface-800/50">
                <td className="py-3 px-3 text-surface-200 text-xs">{row.comp}</td>
                <td className="py-3 px-3 text-surface-400 text-xs">{row.action}</td>
                <td className="py-3 px-3 text-awesome-300 text-xs font-mono">{row.key}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Focus Management</h2>
      <p>
        Focus management is built into all interactive components:
      </p>

      <ul>
        <li>Dialogs trap focus within the modal</li>
        <li>Focus returns to trigger element on close</li>
        <li>Skip links for navigation</li>
        <li>Visible focus indicators on all interactive elements</li>
        <li>Programmatic focus management for dynamic content</li>
      </ul>

      <h2>Reduced Motion</h2>
      <p>
        Respects the user&apos;s <code>prefers-reduced-motion</code> setting:
      </p>

      <CodeBlock code={`/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-up,
  .animate-slide-down {
    animation: none;
  }
}`} language="css" />

      <h2>Testing</h2>
      <p>
        We recommend testing your implementation with:
      </p>
      <ul>
        <li>Keyboard-only navigation (Tab, Enter, Escape, Arrow keys)</li>
        <li>Screen readers (VoiceOver, NVDA, JAWS)</li>
        <li>Browser zoom (200%)</li>
        <li>Reduced motion settings</li>
        <li>High contrast mode</li>
      </ul>
    </div>
  );
}
