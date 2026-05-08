import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { formDoc as t } from "@/texts";

export default function FormDocPage() {
  const s = t.sections;

  return (
    <div>
      <h1>
        {t.heading}
        <Badge variant="primary" className="ml-3 align-middle text-xs">{t.badge}</Badge>
      </h1>
      <p>{t.subheading}</p>

      <h2>{s.import.heading}</h2>
      <CodeBlock code={`import { Form, Input, Select, Checkbox, Textarea, Button } from '@awesomeui/react'`} language="tsx" />

      <h2>{s.basicForm.heading}</h2>
      <CodeBlock code={`function LoginForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="email"
        label="${s.basicForm.email}"
        type="email"
        placeholder="${s.basicForm.placeholder}"
        required
      />
      <Input
        name="password"
        label="${s.basicForm.password}"
        type="password"
        required
      />
      <Button type="submit" variant="primary">
        ${s.basicForm.signIn}
      </Button>
    </Form>
  )
}`} language="tsx" />

      <h2>{s.inputProps.heading}</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              {s.inputProps.tableHeaders.map((h) => (
                <th key={h} className="text-left py-3 px-3 text-surface-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.inputProps.rows.map((row) => (
              <tr key={row.prop} className="border-b border-surface-800/50">
                <td className="py-3 px-3 text-awesome-300 font-mono text-xs">{row.prop}</td>
                <td className="py-3 px-3 text-surface-400 text-xs font-mono">{row.type}</td>
                <td className="py-3 px-3 text-surface-500 text-xs">{row.default}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{s.validation.heading}</h2>
      <CodeBlock code={`function ValidatedForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        type="email"
        error={errors.email}
        required
      />
      {errors.email && (
        <span className="text-red-400 text-sm">
          {errors.email}
        </span>
      )}
      <Button type="submit">
        ${s.validation.submit}
      </Button>
    </Form>
  )
}`} language="tsx" />
    </div>
  );
}
