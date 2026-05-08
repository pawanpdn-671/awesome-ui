import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";

export default function FormDocPage() {
  return (
    <div>
      <h1>
        Form
        <Badge variant="primary" className="ml-3 align-middle text-xs">Data Entry</Badge>
      </h1>
      <p>
        Form components with built-in validation, error states, and accessibility.
        Includes Input, Select, Checkbox, Switch, and Textarea.
      </p>

      <h2>Import</h2>
      <CodeBlock code={`import { Form, Input, Select, Checkbox, Textarea, Button } from '@awesomeui/react'`} language="tsx" />

      <h2>Basic Form</h2>
      <CodeBlock code={`function LoginForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
      />
      <Input
        name="password"
        label="Password"
        type="password"
        required
      />
      <Button type="submit" variant="primary">
        Sign In
      </Button>
    </Form>
  )
}`} language="tsx" />

      <h2>Input Props</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Prop</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Type</th>
              <th className="text-left py-3 px-3 text-surface-400 font-medium">Default</th>
            </tr>
          </thead>
          <tbody>
            {[
              { prop: "name", type: "string", default: "-" },
              { prop: "label", type: "string", default: "-" },
              { prop: "type", type: '"text" | "email" | "password" | "number"', default: '"text"' },
              { prop: "placeholder", type: "string", default: "-" },
              { prop: "required", type: "boolean", default: "false" },
              { prop: "disabled", type: "boolean", default: "false" },
              { prop: "error", type: "string", default: "-" },
            ].map((row) => (
              <tr key={row.prop} className="border-b border-surface-800/50">
                <td className="py-3 px-3 text-awesome-300 font-mono text-xs">{row.prop}</td>
                <td className="py-3 px-3 text-surface-400 text-xs font-mono">{row.type}</td>
                <td className="py-3 px-3 text-surface-500 text-xs">{row.default}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Validation</h2>
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
        Submit
      </Button>
    </Form>
  )
}`} language="tsx" />
    </div>
  );
}
