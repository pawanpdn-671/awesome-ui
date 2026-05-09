import type { ReactNode } from "react";
import { DropdownMenuPreview, ToastPreview, SidebarPreview, AccordionPreview, DialogPreview, TabsPreview } from "@/components/component-previews";

export interface ComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ComponentSlot {
  name: string;
  description: string;
}

export interface ComponentDoc {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  props: ComponentProp[];
  slots: ComponentSlot[];
  imports: string;
  preview: ReactNode;
  previewCode: string;
  examples: Record<string, string>;
}

function codeBlock(code: string): string {
  return code;
}

const btnExample = `import { Button } from '@awesomeui/react'

function Example() {
  return (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  )
}`;

export const components: ComponentDoc[] = [
  {
    id: "button",
    name: "Button",
    category: "primitive",
    description: "Versatile button component with variants, sizes, loading state, and icon support.",
    version: "1.0.0",
    imports: codeBlock(`import { Button } from '@awesomeui/react'`),
    props: [
      { name: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "destructive"', default: '"primary"', description: "Visual style variant" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size" },
      { name: "disabled", type: "boolean", default: "false", description: "Whether the button is disabled" },
      { name: "loading", type: "boolean", default: "false", description: "Whether the button is in a loading state" },
      { name: "fullWidth", type: "boolean", default: "false", description: "Whether the button should take up the full width" },
    ],
    slots: [
      { name: "default", description: "Button label content" },
      { name: "icon", description: "Optional icon to display before the label" },
      { name: "trailingIcon", description: "Optional icon to display after the label" },
    ],
    preview: (
      <div className="flex flex-wrap gap-3 items-center justify-center py-8">
        <button className="px-5 py-2.5 rounded-lg bg-awesome-500 text-white text-sm font-medium hover:bg-awesome-600 transition-all shadow-lg shadow-awesome-500/20">Primary</button>
        <button className="px-5 py-2.5 rounded-lg bg-surface-800 text-surface-100 text-sm font-medium hover:bg-surface-700 border border-surface-700 transition-all">Secondary</button>
        <button className="px-5 py-2.5 rounded-lg border border-surface-600 text-surface-300 text-sm font-medium hover:bg-surface-800 hover:text-surface-100 transition-all">Outline</button>
        <button className="px-5 py-2.5 rounded-lg text-surface-400 text-sm font-medium hover:text-surface-100 hover:bg-surface-800 transition-all">Ghost</button>
      </div>
    ),
    previewCode: codeBlock(`<div className="flex flex-wrap gap-3 items-center justify-center">
  <button className="btn-primary">Primary</button>
  <button className="btn-secondary">Secondary</button>
  <button className="btn-outline">Outline</button>
  <button className="btn-ghost">Ghost</button>
</div>`),
    examples: {
      react: btnExample,
      vue: btnExample.replace(/import.*\n\n/, '').replace(/{Button}/g, 'Button').replace(/<Button/g, '<Button'),
    },
  },
  {
    id: "badge",
    name: "Badge",
    category: "data-display",
    description: "Small badge component for labels, counts, and status indicators.",
    version: "1.0.0",
    imports: codeBlock(`import { Badge } from '@awesomeui/react'`),
    props: [
      { name: "variant", type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning"', default: '"default"', description: "Visual style variant" },
    ],
    slots: [
      { name: "default", description: "Badge content" },
    ],
    preview: (
      <div className="flex flex-wrap gap-3 items-center justify-center py-8">
        <span className="px-3 py-1 rounded-full bg-awesome-500/20 text-awesome-300 text-xs font-medium">Default</span>
        <span className="px-3 py-1 rounded-full bg-surface-800 text-surface-300 text-xs font-medium">Secondary</span>
        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-medium">Destructive</span>
        <span className="px-3 py-1 rounded-full border border-surface-600 text-surface-300 text-xs font-medium">Outline</span>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">Success</span>
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium">Warning</span>
      </div>
    ),
    previewCode: codeBlock(`<div className="flex gap-3">
  <span className="badge-default">Default</span>
  <span className="badge-secondary">Secondary</span>
  <span className="badge-destructive">Destructive</span>
  <span className="badge-outline">Outline</span>
  <span className="badge-success">Success</span>
  <span className="badge-warning">Warning</span>
</div>`),
    examples: {
      react: codeBlock(`import { Badge } from '@awesomeui/react'

function Example() {
  return (
    <div className="flex gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  )
}`),
    },
  },
  {
    id: "input",
    name: "Input",
    category: "form",
    description: "Text input field with label, error state, and icon support.",
    version: "1.0.0",
    imports: codeBlock(`import { Input } from '@awesomeui/react'`),
    props: [
      { name: "type", type: '"text" | "email" | "password" | "number" | "tel" | "url"', default: '"text"', description: "Input type" },
      { name: "placeholder", type: "string", default: "-", description: "Placeholder text" },
      { name: "disabled", type: "boolean", default: "false", description: "Whether the input is disabled" },
      { name: "error", type: "boolean", default: "false", description: "Whether to show error state" },
      { name: "value", type: "string", default: "-", description: "Current input value" },
    ],
    slots: [
      { name: "prefix", description: "Content before the input" },
      { name: "suffix", description: "Content after the input" },
    ],
    preview: (
      <div className="py-8 px-4 max-w-sm mx-auto space-y-3">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Email</label>
          <input type="email" placeholder="you@example.com" className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-surface-700 text-surface-100 text-sm placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-awesome-500/30 focus:border-awesome-500/50 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Error state</label>
          <input type="text" defaultValue="bad input" className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-red-500/50 text-surface-100 text-sm placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all" />
          <p className="text-xs text-red-400 mt-1">This field has an error.</p>
        </div>
      </div>
    ),
    previewCode: `<!-- Input component with label, placeholder, and error state -->
<Input type="email" label="Email" placeholder="you@example.com" />
<Input label="Error state" error defaultValue="bad input" />`,
    examples: {
      react: codeBlock(`import { Input } from '@awesomeui/react'

function Example() {
  return (
    <div className="space-y-4">
      <div>
        <label>Email</label>
        <Input type="email" placeholder="you@example.com" />
      </div>
      <div>
        <label>Password</label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div>
        <label>With error</label>
        <Input error placeholder="Invalid value" />
      </div>
    </div>
  )
}`),
    },
  },
  {
    id: "card",
    name: "Card",
    category: "layout",
    description: "Container card component with header, body, and footer sections.",
    version: "1.0.0",
    imports: codeBlock(`import { Card, CardHeader, CardBody, CardFooter } from '@awesomeui/react'`),
    props: [
      { name: "padding", type: '"none" | "sm" | "md" | "lg"', default: '"md"', description: "Padding size for the card body" },
      { name: "variant", type: '"default" | "outlined" | "elevated" | "ghost"', default: '"default"', description: "Visual style variant of the card" },
    ],
    slots: [
      { name: "header", description: "Card header content" },
      { name: "default", description: "Card body content" },
      { name: "footer", description: "Card footer content" },
      { name: "image", description: "Card image at the top" },
    ],
    preview: (
      <div className="py-8 px-4 flex items-center justify-center">
        <div className="glass rounded-xl p-6 max-w-sm w-full border border-surface-700/50">
          <div className="w-full h-32 rounded-lg bg-gradient-to-br from-awesome-500/20 to-violet-500/20 mb-4 flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-awesome-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-awesome-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-surface-100 mb-2">Card Title</h3>
          <p className="text-sm text-surface-400 mb-4">Cards are versatile content containers used throughout the UI.</p>
          <button className="w-full px-4 py-2 rounded-lg bg-awesome-500 text-white text-sm font-medium hover:bg-awesome-600 transition-all">Learn More</button>
        </div>
      </div>
    ),
    previewCode: `<Card variant="default" padding="md">
  <CardHeader>image or header content</CardHeader>
  <CardBody>
    <h3>Card Title</h3>
    <p>Card description text.</p>
  </CardBody>
  <CardFooter>
    <Button>Learn More</Button>
  </CardFooter>
</Card>`,
    examples: {
      react: codeBlock(`import { Card, CardHeader, CardBody, CardFooter } from '@awesomeui/react'

function Example() {
  return (
    <Card variant="default" padding="md">
      <CardHeader>
        <h2>Card Title</h2>
      </CardHeader>
      <CardBody>
        <p>Card content goes here.</p>
      </CardBody>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
}`),
    },
  },
  {
    id: "alert",
    name: "Alert",
    category: "feedback",
    description: "Alert banner for displaying feedback messages with variant styles and dismissible support.",
    version: "1.0.0",
    imports: codeBlock(`import { Alert } from '@awesomeui/react'`),
    props: [
      { name: "variant", type: '"info" | "success" | "warning" | "error"', default: '"info"', description: "Visual style variant of the alert" },
      { name: "dismissible", type: "boolean", default: "false", description: "Whether the alert can be dismissed" },
      { name: "title", type: "string", default: "-", description: "Optional title text for the alert" },
    ],
    slots: [
      { name: "default", description: "Alert message" },
      { name: "icon", description: "Icon before the content" },
      { name: "action", description: "Action after the content" },
    ],
    preview: (
      <div className="max-w-lg mx-auto space-y-3">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-800 border border-awesome-500">
          <svg className="w-5 h-5 text-awesome-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div><div className="text-sm text-awesome-500">This is an info alert.</div></div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-800 border border-emerald-500">
          <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div><div className="text-sm text-emerald-500">Operation completed successfully.</div></div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-800 border border-red-500">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div><div className="text-sm text-red-500">Something went wrong.</div></div>
        </div>
      </div>
    ),
    previewCode: `<Alert variant="info" title="Note">
  This is an informational message.
</Alert>
<Alert variant="success" dismissible>
  Changes saved successfully.
</Alert>
<Alert variant="error">
  An error occurred while processing.
</Alert>`,
    examples: {
      react: codeBlock(`import { Alert } from '@awesomeui/react'

function Example() {
  return (
    <div className="space-y-4">
      <Alert variant="info" title="Note">
        This is an informational message.
      </Alert>
      <Alert variant="success" dismissible>
        Changes saved successfully.
      </Alert>
      <Alert variant="error">
        An error occurred while processing.
      </Alert>
      <Alert variant="warning">
        Your session will expire soon.
      </Alert>
    </div>
  )
}`),
    },
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "data-display",
    description: "Avatar component for displaying user profile images with fallback initials and status indicator.",
    version: "1.0.0",
    imports: codeBlock(`import { Avatar } from '@awesomeui/react'`),
    props: [
      { name: "src", type: "string", default: "-", description: "Image source URL" },
      { name: "alt", type: "string", default: "''", description: "Alt text for the avatar image" },
      { name: "fallback", type: "string", default: "-", description: "Fallback text (initials) shown when no image" },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Size of the avatar" },
      { name: "status", type: '"online" | "offline" | "away" | "busy"', default: "-", description: "Optional status indicator dot" },
      { name: "shape", type: '"circle" | "square" | "rounded"', default: '"circle"', description: "Shape of the avatar" },
    ],
    slots: [],
    preview: (
      <div className="flex flex-wrap gap-6 items-center justify-center py-8">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-awesome-400 to-awesome-600 flex items-center justify-center text-white text-sm font-medium">JD</div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-surface-950" />
        </div>
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-surface-700 flex items-center justify-center text-surface-300 text-sm font-medium"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 text-xs font-medium">AB</div>
        </div>
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-base font-medium">P</div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-surface-950" />
        </div>
      </div>
    ),
    previewCode: `<Avatar fallback="JD" size="md" status="online" />
<Avatar fallback="?" size="md" />
<Avatar fallback="AB" size="sm" />
<Avatar fallback="P" size="lg" status="away" />`,
    examples: {
      react: codeBlock(`import { Avatar } from '@awesomeui/react'

function Example() {
  return (
    <div className="flex items-center gap-4">
      <Avatar src="/avatar.jpg" alt="User" />
      <Avatar fallback="JD" size="lg" />
      <Avatar fallback="AB" size="sm" />
      <Avatar fallback="P" status="online" />
      <Avatar fallback="JD" shape="rounded" />
    </div>
  )
}`),
    },
  },
  {
    id: "checkbox",
    name: "Checkbox",
    category: "form",
    description: "Checkbox input component with label, indeterminate state, and error support.",
    version: "1.0.0",
    imports: codeBlock(`import { Checkbox } from '@awesomeui/react'`),
    props: [
      { name: "checked", type: "boolean", default: "false", description: "Whether the checkbox is checked" },
      { name: "indeterminate", type: "boolean", default: "false", description: "Whether the checkbox is in an indeterminate state" },
      { name: "disabled", type: "boolean", default: "false", description: "Whether the checkbox is disabled" },
      { name: "error", type: "boolean", default: "false", description: "Whether to show the error state" },
      { name: "required", type: "boolean", default: "false", description: "Whether the checkbox is required" },
    ],
    slots: [
      { name: "default", description: "Label content next to checkbox" },
    ],
    preview: (
      <div className="py-8 px-4 max-w-xs mx-auto space-y-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="w-4 h-4 rounded border-2 border-awesome-500 bg-awesome-500 flex items-center justify-center transition-colors">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm text-surface-200">Option A</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="w-4 h-4 rounded border-2 border-surface-600 bg-transparent group-hover:border-surface-500 transition-colors" />
          <span className="text-sm text-surface-200">Option B</span>
        </label>
        <label className="flex items-center gap-3 cursor-not-allowed opacity-50">
          <div className="w-4 h-4 rounded border-2 border-surface-700 bg-surface-800/50" />
          <span className="text-sm text-surface-400">Disabled</span>
        </label>
        <label className="flex items-center gap-3">
          <div className="w-4 h-4 rounded border-2 border-red-500/50 bg-red-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span className="text-sm text-red-400">Error state</span>
        </label>
      </div>
    ),
    previewCode: `<Checkbox defaultChecked>Option A</Checkbox>
<Checkbox>Option B</Checkbox>
<Checkbox indeterminate>Select all</Checkbox>
<Checkbox disabled>Disabled</Checkbox>
<Checkbox error>Error state</Checkbox>`,
    examples: {
      react: codeBlock(`import { Checkbox } from '@awesomeui/react'

function Example() {
  return (
    <div className="space-y-3">
      <Checkbox defaultChecked>Option A</Checkbox>
      <Checkbox>Option B</Checkbox>
      <Checkbox indeterminate>Select all</Checkbox>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox error>Error state</Checkbox>
    </div>
  )
}`),
    },
  },
  {
    id: "select",
    name: "Select",
    category: "form",
    description: "Select dropdown component with placeholder, error state, and option groups.",
    version: "1.0.0",
    imports: codeBlock(`import { Select } from '@awesomeui/react'`),
    props: [
      { name: "placeholder", type: "string", default: "'Select an option'", description: "Placeholder text" },
      { name: "disabled", type: "boolean", default: "false", description: "Whether the select is disabled" },
      { name: "error", type: "boolean", default: "false", description: "Whether to show error state" },
      { name: "required", type: "boolean", default: "false", description: "Whether the select is required" },
      { name: "label", type: "string", default: "-", description: "Label text above the select" },
    ],
    slots: [
      { name: "default", description: "Option/optgroup elements" },
      { name: "prefix", description: "Content before select text" },
    ],
    preview: (
      <div className="py-8 px-4 max-w-sm mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Framework</label>
          <div className="relative">
            <select className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-surface-700 text-surface-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-awesome-500/30 focus:border-awesome-500/50 transition-all">
              <option className="bg-transparent">React</option>
              <option className="bg-transparent">Vue</option>
              <option className="bg-transparent">Angular</option>
              <option className="bg-transparent">Svelte</option>
            </select>
            <svg className="w-4 h-4 text-surface-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">With error</label>
          <div className="relative">
            <select className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-red-500/50 text-surface-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all">
              <option className="bg-transparent">Select an option</option>
            </select>
            <svg className="w-4 h-4 text-surface-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          <p className="text-xs text-red-400 mt-1">Please select a framework.</p>
        </div>
      </div>
    ),
    previewCode: `<Select label="Framework" placeholder="Select a framework">
  <option value="react">React</option>
  <option value="vue">Vue</option>
  <option value="angular">Angular</option>
</Select>
<Select label="With error" error>
  <option>Select an option</option>
</Select>`,
    examples: {
      react: codeBlock(`import { Select } from '@awesomeui/react'

function Example() {
  return (
    <div className="space-y-4">
      <Select label="Framework" placeholder="Select a framework">
        <option value="react">React</option>
        <option value="vue">Vue</option>
        <option value="angular">Angular</option>
      </Select>
      <Select label="With error" error>
        <option>Select an option</option>
      </Select>
    </div>
  )
}`),
    },
  },
  {
    id: "switch",
    name: "Switch",
    category: "form",
    description: "Toggle switch component with label for binary settings.",
    version: "1.0.0",
    imports: codeBlock(`import { Switch } from '@awesomeui/react'`),
    props: [
      { name: "checked", type: "boolean", default: "false", description: "Whether the switch is toggled on" },
      { name: "disabled", type: "boolean", default: "false", description: "Whether the switch is disabled" },
      { name: "required", type: "boolean", default: "false", description: "Whether the switch is required" },
      { name: "label", type: "string", default: "-", description: "Label displayed next to the switch" },
      { name: "labelPosition", type: '"left" | "right"', default: '"right"', description: "Position of the label" },
    ],
    slots: [
      { name: "default", description: "Custom label content" },
    ],
    preview: (
      <div className="py-8 px-4 max-w-xs mx-auto space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-surface-200">Airplane Mode</span>
          <div className="w-10 h-6 rounded-full bg-awesome-500 relative transition-colors cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1 shadow transition-all" />
          </div>
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-surface-200">Wi-Fi</span>
          <div className="w-10 h-6 rounded-full bg-surface-700 relative transition-colors cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-surface-300 absolute top-1 left-1 shadow transition-all" />
          </div>
        </label>
        <label className="flex items-center justify-between cursor-not-allowed opacity-50">
          <span className="text-sm text-surface-400">Bluetooth</span>
          <div className="w-10 h-6 rounded-full bg-surface-700 relative">
            <div className="w-4 h-4 rounded-full bg-surface-300 absolute top-1 left-1 shadow" />
          </div>
        </label>
      </div>
    ),
    previewCode: `<Switch label="Airplane Mode" defaultChecked />
<Switch label="Wi-Fi" />
<Switch label="Bluetooth" disabled />
<Switch label="Notifications" labelPosition="left" />`,
    examples: {
      react: codeBlock(`import { Switch } from '@awesomeui/react'

function Example() {
  return (
    <div className="space-y-4">
      <Switch label="Airplane Mode" />
      <Switch defaultChecked label="Wi-Fi" />
      <Switch disabled label="Bluetooth" />
      <Switch labelPosition="left" label="Notifications" />
    </div>
  )
}`),
    },
  },
  {
    id: "textarea",
    name: "Textarea",
    category: "form",
    description: "Multi-line text input with label, error state, and character count.",
    version: "1.0.0",
    imports: codeBlock(`import { Textarea } from '@awesomeui/react'`),
    props: [
      { name: "placeholder", type: "string", default: "-", description: "Placeholder text" },
      { name: "disabled", type: "boolean", default: "false", description: "Whether the textarea is disabled" },
      { name: "error", type: "boolean", default: "false", description: "Whether to show error state" },
      { name: "label", type: "string", default: "-", description: "Label text above the textarea" },
      { name: "required", type: "boolean", default: "false", description: "Whether the textarea is required" },
      { name: "rows", type: "number", default: "4", description: "Number of visible rows" },
      { name: "maxLength", type: "number", default: "-", description: "Maximum character length" },
      { name: "resizable", type: "boolean", default: "true", description: "Whether the textarea can be resized" },
    ],
    slots: [],
    preview: (
      <div className="py-8 px-4 max-w-lg mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Message</label>
          <textarea rows={4} placeholder="Type your message here..." className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-surface-700 text-surface-100 text-sm placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-awesome-500/30 focus:border-awesome-500/50 transition-all resize-y" />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Bio <span className="text-surface-500">(max 200 chars)</span></label>
          <textarea rows={3} maxLength={200} className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-surface-700 text-surface-100 text-sm placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-awesome-500/30 focus:border-awesome-500/50 transition-all resize-none" />
          <div className="flex justify-end mt-1"><span className="text-xs text-surface-500">0/200</span></div>
        </div>
      </div>
    ),
    previewCode: `<Textarea label="Message" placeholder="Type your message..." />
<Textarea label="Bio" maxLength={200} resizable={false} />
<Textarea label="With error" error />`,
    examples: {
      react: codeBlock(`import { Textarea } from '@awesomeui/react'

function Example() {
  return (
    <div className="space-y-4">
      <Textarea label="Message" placeholder="Type your message..." />
      <Textarea label="Bio" maxLength={200} resizable={false} />
      <Textarea label="With error" error />
    </div>
  )
}`),
    },
  },
  {
    id: "skeleton",
    name: "Skeleton",
    category: "feedback",
    description: "Loading placeholder that mimics content layout with animated shimmer effect.",
    version: "1.0.0",
    imports: codeBlock(`import { Skeleton } from '@awesomeui/react'`),
    props: [
      { name: "variant", type: '"text" | "circular" | "rectangular" | "rounded"', default: '"text"', description: "Shape variant" },
      { name: "width", type: "string", default: "-", description: "Custom width" },
      { name: "height", type: "string", default: "-", description: "Custom height" },
      { name: "count", type: "number", default: "1", description: "Number of skeleton lines" },
      { name: "animated", type: "boolean", default: "true", description: "Whether to show the shimmer animation" },
    ],
    slots: [],
    preview: (
      <div className="py-8 px-4 max-w-sm mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-700 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-surface-700 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-surface-700 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-surface-700 rounded animate-pulse w-full" />
          <div className="h-3 bg-surface-700 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-surface-700 rounded animate-pulse w-2/3" />
        </div>
        <div className="h-32 bg-surface-700 rounded-lg animate-pulse" />
      </div>
    ),
    previewCode: `{/* Text skeleton */}
<Skeleton variant="text" count={3} />
{/* Circular skeleton for avatars */}
<Skeleton variant="circular" width="48px" height="48px" />
{/* Rectangular skeleton for images */}
<Skeleton variant="rectangular" width="100%" height="200px" />`,
    examples: {
      react: codeBlock(`import { Skeleton } from '@awesomeui/react'

function Example() {
  return (
    <div className="space-y-4">
      <Skeleton variant="text" count={3} />
      <Skeleton variant="circular" width="48px" height="48px" />
      <Skeleton variant="rectangular" width="100%" height="200px" />
      <Skeleton variant="rounded" width="300px" height="40px" />
    </div>
  )
}`),
    },
  },
  {
    id: "toast",
    name: "Toast",
    category: "overlay",
    description: "Toast notification for showing brief, temporary messages with variant styles.",
    version: "1.0.0",
    imports: codeBlock(`import { Toast, toast } from '@awesomeui/react'`),
    props: [
      { name: "variant", type: '"default" | "success" | "error" | "warning" | "info"', default: '"default"', description: "Visual style variant" },
      { name: "position", type: '"top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"', default: '"top-right"', description: "Position on screen" },
      { name: "duration", type: "number", default: "5000", description: "Auto-dismiss duration in ms" },
      { name: "dismissible", type: "boolean", default: "true", description: "Whether to show a dismiss button" },
      { name: "title", type: "string", default: "-", description: "Optional bold title text" },
    ],
    slots: [
      { name: "default", description: "Message" },
      { name: "icon", description: "Icon before content" },
      { name: "action", description: "Action after message" },
    ],
    preview: <ToastPreview />,
    previewCode: `{/* Trigger a toast notification */}
<button onClick={() => toast.success('Saved!')}>
  Show Success
</button>
<button onClick={() => toast.error('Failed!')}>
  Show Error
</button>

{/* Or use the Toast component directly */}
<Toast variant="success" title="Success">
  Changes saved.
</Toast>`,
    examples: {
      react: codeBlock(`import { toast } from '@awesomeui/react'

function Example() {
  return (
    <div className="flex gap-4">
      <button onClick={() => toast.success('Saved!')}>
        Show Success
      </button>
      <button onClick={() => toast.error('Failed!')}>
        Show Error
      </button>
      <button onClick={() => toast('Hello!')}>
        Show Default
      </button>
    </div>
  )
}`),
    },
  },
  {
    id: "table",
    name: "Table",
    category: "data-display",
    description: "Data table with sortable columns, loading state, and empty state.",
    version: "1.0.0",
    imports: codeBlock(`import { Table } from '@awesomeui/react'`),
    props: [
      { name: "columns", type: "array", default: "[]", description: "Column definitions with key, label, and optional sortable" },
      { name: "rows", type: "array", default: "[]", description: "Row data array" },
      { name: "sortable", type: "boolean", default: "false", description: "Whether columns are sortable" },
      { name: "striped", type: "boolean", default: "false", description: "Whether to show alternating row colors" },
      { name: "hoverable", type: "boolean", default: "true", description: "Whether rows highlight on hover" },
      { name: "compact", type: "boolean", default: "false", description: "Whether to use compact padding" },
      { name: "loading", type: "boolean", default: "false", description: "Whether the table is in a loading state" },
    ],
    slots: [
      { name: "header", description: "Above the table" },
      { name: "empty", description: "When no rows" },
      { name: "loading", description: "Custom loading indicator" },
      { name: "footer", description: "Below the table" },
    ],
    preview: (
      <div className="py-8 px-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-surface-800">
            <th className="text-left py-3 px-3 text-surface-400 font-medium">Name</th>
            <th className="text-left py-3 px-3 text-surface-400 font-medium">Role</th>
            <th className="text-left py-3 px-3 text-surface-400 font-medium">Status</th>
          </tr></thead>
          <tbody>
            <tr className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
              <td className="py-3 px-3 text-surface-200">John Doe</td>
              <td className="py-3 px-3 text-surface-400">Developer</td>
              <td className="py-3 px-3"><span className="inline-flex items-center gap-1.5 text-xs text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Active</span></td>
            </tr>
            <tr className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
              <td className="py-3 px-3 text-surface-200">Jane Smith</td>
              <td className="py-3 px-3 text-surface-400">Designer</td>
              <td className="py-3 px-3"><span className="inline-flex items-center gap-1.5 text-xs text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Active</span></td>
            </tr>
            <tr className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
              <td className="py-3 px-3 text-surface-200">Bob Johnson</td>
              <td className="py-3 px-3 text-surface-400">PM</td>
              <td className="py-3 px-3"><span className="inline-flex items-center gap-1.5 text-xs text-amber-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Away</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    previewCode: `const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 1, name: 'John Doe', role: 'Developer', status: 'Active' },
  { id: 2, name: 'Jane Smith', role: 'Designer', status: 'Active' },
]

<Table columns={columns} rows={rows} sortable striped hoverable />`,
    examples: {
      react: codeBlock(`import { Table } from '@awesomeui/react'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 1, name: 'John Doe', role: 'Developer', status: 'Active' },
  { id: 2, name: 'Jane Smith', role: 'Designer', status: 'Active' },
]

function Example() {
  return (
    <Table columns={columns} rows={rows} sortable striped hoverable />
  )
}`),
    },
  },
  {
    id: "accordion",
    name: "Accordion",
    category: "layout",
    description: "Accordion component for expandable/collapsible content sections.",
    version: "1.0.0",
    imports: codeBlock(`import { Accordion, AccordionItem } from '@awesomeui/react'`),
    props: [
      { name: "type", type: '"single" | "multiple"', default: '"single"', description: "Whether one or multiple items can be open" },
      { name: "defaultValue", type: "string", default: "-", description: "Initially expanded item value" },
      { name: "collapsible", type: "boolean", default: "true", description: "Whether all items can be collapsed" },
      { name: "variant", type: '"default" | "bordered" | "ghost"', default: '"default"', description: "Visual style variant" },
    ],
    slots: [
      { name: "default", description: "Accordion item components" },
    ],
    preview: <AccordionPreview />,
    previewCode: `<Accordion type="single" collapsible>
  <AccordionItem value="item-1" title="Section 1">
    Content for section 1.
  </AccordionItem>
  <AccordionItem value="item-2" title="Section 2">
    Content for section 2.
  </AccordionItem>
</Accordion>`,
    examples: {
      react: codeBlock(`import { Accordion, AccordionItem } from '@awesomeui/react'

function Example() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" title="Section 1">
        Content for section 1.
      </AccordionItem>
      <AccordionItem value="item-2" title="Section 2">
        Content for section 2.
      </AccordionItem>
    </Accordion>
  )
}`),
    },
  },
  {
    id: "sidebar",
    name: "Sidebar",
    category: "navigation",
    description: "Collapsible sidebar navigation with menu items, icons, and nested submenus.",
    version: "1.0.0",
    imports: codeBlock(`import { Sidebar } from '@awesomeui/react'`),
    props: [
      { name: "collapsed", type: "boolean", default: "false", description: "Whether the sidebar is collapsed to icon-only" },
      { name: "variant", type: '"default" | "floating" | "bordered"', default: '"default"', description: "Visual style variant" },
      { name: "position", type: '"left" | "right"', default: '"left"', description: "Which side the sidebar is on" },
      { name: "width", type: "string", default: "'16rem'", description: "Width of the expanded sidebar" },
      { name: "collapsedWidth", type: "string", default: "'4rem'", description: "Width of the collapsed sidebar" },
    ],
    slots: [
      { name: "header", description: "Top of sidebar" },
      { name: "default", description: "Nav menu items" },
      { name: "footer", description: "Bottom of sidebar" },
      { name: "toggle", description: "Custom toggle button" },
    ],
    preview: <SidebarPreview />,
    previewCode: `<Sidebar collapsed={false} variant="default">
  <Sidebar.Header>
    <Logo />
  </Sidebar.Header>
  <Sidebar.Nav>
    <Sidebar.Item>Dashboard</Sidebar.Item>
    <Sidebar.Item>Settings</Sidebar.Item>
  </Sidebar.Nav>
  <Sidebar.Footer>
    <UserProfile />
  </Sidebar.Footer>
</Sidebar>`,
    examples: {
      react: codeBlock(`import { Sidebar } from '@awesomeui/react'

function Example() {
  return (
    <Sidebar collapsed={false} variant="default" position="left">
      <Sidebar.Header>
        <Logo />
      </Sidebar.Header>
      <Sidebar.Nav>
        <Sidebar.Item icon={<DashboardIcon />}>Dashboard</Sidebar.Item>
        <Sidebar.Item icon={<SettingsIcon />}>Settings</Sidebar.Item>
      </Sidebar.Nav>
      <Sidebar.Footer>
        <UserProfile />
      </Sidebar.Footer>
    </Sidebar>
  )
}`),
    },
  },
  {
    id: "loading",
    name: "Loading",
    category: "feedback",
    description: "Loading state with spinner, progress bar, and overlay variants for async operations.",
    version: "1.0.0",
    imports: codeBlock(`import { Loading } from '@awesomeui/react'`),
    props: [
      { name: "variant", type: '"spinner" | "dots" | "pulse" | "progress" | "ring"', default: '"spinner"', description: "Visual style of the indicator" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size of the indicator" },
      { name: "label", type: "string", default: "-", description: "Text label below the indicator" },
      { name: "overlay", type: "boolean", default: "false", description: "Whether to show as a full-area overlay" },
      { name: "progress", type: "number", default: "-", description: "Progress value 0-100 (for progress variant)" },
    ],
    slots: [
      { name: "default", description: "Custom content inside loading area" },
    ],
    preview: (
      <div className="py-8 px-4 flex flex-wrap gap-8 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <svg className="w-8 h-8 text-awesome-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          <span className="text-xs text-surface-400">Loading...</span>
        </div>
        <div className="flex gap-1.5 items-center">
          {[0,1,2].map((i) => (<div key={i} className="w-2.5 h-2.5 rounded-full bg-awesome-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />))}
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-surface-700 border-t-awesome-400 animate-spin" />
        <div className="w-24">
          <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
            <div className="h-full bg-awesome-400 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    ),
    previewCode: `<Loading variant="spinner" label="Loading..." />
<Loading variant="dots" size="lg" />
<Loading variant="progress" progress={65} />
<Loading variant="ring" size="sm" />
<Loading overlay label="Please wait..." />`,
    examples: {
      react: codeBlock(`import { Loading } from '@awesomeui/react'

function Example() {
  return (
    <div className="space-y-8">
      <Loading variant="spinner" label="Loading..." />
      <Loading variant="dots" size="lg" />
      <Loading variant="progress" progress={65} />
      <Loading variant="ring" size="sm" />
      <Loading overlay label="Please wait..." />
    </div>
  )
}`),
    },
  },
  {
    id: "menubar",
    name: "Menubar",
    category: "navigation",
    description: "Horizontal menu bar with dropdown items, icons, and keyboard navigation.",
    version: "1.0.0",
    imports: codeBlock(`import { Menubar } from '@awesomeui/react'`),
    props: [
      { name: "items", type: "array", default: "[]", description: "Array of menu items with label, icon, and children" },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Orientation of the menu bar" },
    ],
    slots: [
      { name: "default", description: "Custom menu items" },
      { name: "start", description: "Start content" },
      { name: "end", description: "End content" },
    ],
    preview: (
      <div className="py-8 px-4 flex justify-center">
        <div className="flex items-center gap-1 rounded-lg border border-surface-800 bg-surface-950 px-2 py-1">
          {["File", "Edit", "View", "Help"].map((item) => (
            <button key={item} className="px-3 py-1.5 rounded-md text-sm text-surface-300 hover:bg-surface-800 hover:text-surface-100 transition-colors">{item}</button>
          ))}
        </div>
      </div>
    ),
    previewCode: `<Menubar orientation="horizontal">
  <Menubar.Item label="File">
    <Menubar.Item>New</Menubar.Item>
    <Menubar.Item>Open</Menubar.Item>
  </Menubar.Item>
  <Menubar.Item label="Edit">
    <Menubar.Item>Undo</Menubar.Item>
    <Menubar.Item>Redo</Menubar.Item>
  </Menubar.Item>
</Menubar>`,
    examples: {
      react: codeBlock(`import { Menubar } from '@awesomeui/react'

function Example() {
  return (
    <Menubar orientation="horizontal">
      <Menubar.Item label="File">
        <Menubar.Item>New</Menubar.Item>
        <Menubar.Item>Open</Menubar.Item>
        <Menubar.Separator />
        <Menubar.Item>Exit</Menubar.Item>
      </Menubar.Item>
      <Menubar.Item label="Edit">
        <Menubar.Item>Undo</Menubar.Item>
        <Menubar.Item>Redo</Menubar.Item>
      </Menubar.Item>
    </Menubar>
  )
}`),
    },
  },
  {
    id: "dialog",
    name: "Dialog",
    category: "overlay",
    description: "Modal dialog with backdrop, title, description, and action buttons.",
    version: "1.0.0",
    imports: codeBlock(`import { Dialog, DialogTrigger, DialogContent } from '@awesomeui/react'`),
    props: [
      { name: "open", type: "boolean", default: "false", description: "Whether the dialog is open" },
      { name: "title", type: "string", default: "-", description: "Dialog title text" },
      { name: "description", type: "string", default: "-", description: "Optional description text" },
      { name: "size", type: '"sm" | "md" | "lg" | "xl" | "fullscreen"', default: '"md"', description: "Size of the dialog" },
      { name: "closable", type: "boolean", default: "true", description: "Whether it can be closed by backdrop or Escape" },
      { name: "centered", type: "boolean", default: "true", description: "Whether the dialog is centered" },
    ],
    slots: [
      { name: "default", description: "Body content" },
      { name: "header", description: "Custom header" },
      { name: "footer", description: "Action buttons" },
      { name: "trigger", description: "Opens the dialog" },
    ],
    preview: <DialogPreview />,
    previewCode: `<Dialog>
  <DialogTrigger>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent title="Confirm Action" size="md">
    <p>Are you sure you want to proceed?</p>
    <div className="flex gap-3 mt-6">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  </DialogContent>
</Dialog>`,
    examples: {
      react: codeBlock(`import { Dialog, DialogTrigger, DialogContent } from '@awesomeui/react'

function Example() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent title="Confirm Action" size="md">
        <p>Are you sure you want to proceed?</p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}`),
    },
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "navigation",
    description: "Tabbed interface component with horizontal and vertical orientations.",
    version: "1.0.0",
    imports: codeBlock(`import { Tabs, TabList, Tab, TabPanel } from '@awesomeui/react'`),
    props: [
      { name: "defaultValue", type: "string", default: "-", description: "Initially selected tab value" },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Orientation of the tabs" },
      { name: "variant", type: '"underline" | "pills" | "enclosed" | "ghost"', default: '"underline"', description: "Visual style variant" },
      { name: "activationMode", type: '"auto" | "manual"', default: '"auto"', description: "Whether tab activates on focus or click" },
    ],
    slots: [
      { name: "default", description: "Tab list and tab panel components" },
      { name: "extra", description: "Extra content alongside tab list" },
    ],
    preview: <TabsPreview />,
    previewCode: `<Tabs defaultValue="overview" variant="underline">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="features">Features</Tab>
    <Tab value="pricing">Pricing</Tab>
  </TabList>
  <TabPanel value="overview">Overview content</TabPanel>
  <TabPanel value="features">Features content</TabPanel>
  <TabPanel value="pricing">Pricing content</TabPanel>
</Tabs>`,
    examples: {
      react: codeBlock(`import { Tabs, TabList, Tab, TabPanel } from '@awesomeui/react'

function Example() {
  return (
    <Tabs defaultValue="overview" variant="underline">
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="features">Features</Tab>
        <Tab value="pricing">Pricing</Tab>
      </TabList>
      <TabPanel value="overview">Overview content</TabPanel>
      <TabPanel value="features">Features content</TabPanel>
      <TabPanel value="pricing">Pricing content</TabPanel>
    </Tabs>
  )
}`),
    },
  },
  {
    id: "tooltip",
    name: "Tooltip",
    category: "overlay",
    description: "Tooltip that shows contextual information on hover, focus, or click.",
    version: "1.0.0",
    imports: codeBlock(`import { Tooltip } from '@awesomeui/react'`),
    props: [
      { name: "content", type: "string", default: "-", description: "Tooltip text content" },
      { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "Which side the tooltip appears on" },
      { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment relative to the trigger" },
      { name: "delay", type: "number", default: "300", description: "Delay in ms before showing" },
      { name: "maxWidth", type: "string", default: "'14rem'", description: "Maximum width of the tooltip" },
    ],
    slots: [
      { name: "default", description: "Trigger element" },
      { name: "content", description: "Custom tooltip content" },
    ],
    preview: (
      <div className="py-8 px-4 flex items-center justify-center gap-8">
        <div className="relative group">
          <button className="px-4 py-2 rounded-lg bg-surface-800 text-sm text-surface-200 border border-surface-700">Hover me</button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-surface-900 border border-surface-700 text-xs text-surface-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">Top tooltip</div>
        </div>
        <div className="relative group">
          <button className="px-4 py-2 rounded-lg bg-surface-800 text-sm text-surface-200 border border-surface-700">Right side</button>
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 rounded-lg bg-surface-900 border border-surface-700 text-xs text-surface-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">Right tooltip</div>
        </div>
      </div>
    ),
    previewCode: `<Tooltip content="This is a tooltip" side="top">
  <button>Hover me</button>
</Tooltip>
<Tooltip content="More info" side="right" delay={500}>
  <button>Delayed</button>
</Tooltip>`,
    examples: {
      react: codeBlock(`import { Tooltip } from '@awesomeui/react'

function Example() {
  return (
    <div className="flex gap-4">
      <Tooltip content="This is a tooltip" side="top">
        <button>Hover me</button>
      </Tooltip>
      <Tooltip content="More info" side="right" delay={500}>
        <button>Delayed</button>
      </Tooltip>
    </div>
  )
}`),
    },
  },
  {
    id: "progress",
    name: "Progress",
    category: "feedback",
    description: "Progress bar for tracking completion, loading, or step progress.",
    version: "1.0.0",
    imports: codeBlock(`import { Progress } from '@awesomeui/react'`),
    props: [
      { name: "value", type: "number", default: "0", description: "Current progress value" },
      { name: "max", type: "number", default: "100", description: "Maximum progress value" },
      { name: "variant", type: '"bar" | "circle" | "steps"', default: '"bar"', description: "Visual style variant" },
      { name: "color", type: '"primary" | "success" | "warning" | "error" | "info"', default: '"primary"', description: "Color variant" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size/thickness" },
      { name: "showLabel", type: "boolean", default: "true", description: "Whether to show the percentage label" },
      { name: "animated", type: "boolean", default: "true", description: "Whether the bar has smooth animation" },
      { name: "indeterminate", type: "boolean", default: "false", description: "Whether progress is indeterminate" },
    ],
    slots: [
      { name: "default", description: "Custom label content" },
    ],
    preview: (
      <div className="py-8 px-4 max-w-md mx-auto space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-1.5"><span className="text-surface-300">Progress</span><span className="text-surface-400">65%</span></div>
          <div className="h-2.5 bg-surface-800 rounded-full overflow-hidden">
            <div className="h-full bg-awesome-400 rounded-full transition-all duration-500" style={{ width: '65%' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1.5"><span className="text-surface-300">Success</span><span className="text-surface-400">100%</span></div>
          <div className="h-2.5 bg-surface-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: '100%' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1.5"><span className="text-surface-300">Indeterminate</span></div>
          <div className="h-2.5 bg-surface-800 rounded-full overflow-hidden">
            <div className="h-full bg-awesome-400 rounded-full animate-pulse" style={{ width: '40%' }} />
          </div>
        </div>
      </div>
    ),
    previewCode: `<Progress value={75} label="Uploading..." />
<Progress value={100} color="success" />
<Progress indeterminate label="Processing..." />
<Progress variant="circle" value={65} size="lg" />`,
    examples: {
      react: codeBlock(`import { Progress } from '@awesomeui/react'

function Example() {
  return (
    <div className="space-y-6">
      <Progress value={75} label="Uploading..." />
      <Progress value={100} color="success" />
      <Progress indeterminate label="Processing..." />
      <Progress variant="circle" value={65} size="lg" />
      <Progress variant="steps" steps={5} value={3} />
    </div>
  )
}`),
    },
  },
  {
    id: "pagination",
    name: "Pagination",
    category: "navigation",
    description: "Pagination for navigating through pages with page numbers, next/previous, and ellipsis.",
    version: "1.0.0",
    imports: codeBlock(`import { Pagination } from '@awesomeui/react'`),
    props: [
      { name: "currentPage", type: "number", default: "1", description: "Current active page number" },
      { name: "totalPages", type: "number", default: "1", description: "Total number of pages" },
      { name: "siblingCount", type: "number", default: "1", description: "Number of sibling pages on each side" },
      { name: "boundaryCount", type: "number", default: "1", description: "Number of boundary pages at start and end" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size of pagination buttons" },
      { name: "variant", type: '"default" | "outlined" | "ghost"', default: '"default"', description: "Visual style variant" },
      { name: "showPrevNext", type: "boolean", default: "true", description: "Whether to show previous/next buttons" },
    ],
    slots: [
      { name: "default", description: "Custom content between prev/next buttons" },
    ],
    preview: (
      <div className="py-8 px-4 flex justify-center">
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 rounded-lg text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-all">Prev</button>
          <button className="px-3 py-1.5 rounded-lg text-sm bg-awesome-500/20 text-awesome-300 font-medium border border-awesome-500/30">1</button>
          <button className="px-3 py-1.5 rounded-lg text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-all">2</button>
          <button className="px-3 py-1.5 rounded-lg text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-all">3</button>
          <span className="px-2 text-surface-500">...</span>
          <button className="px-3 py-1.5 rounded-lg text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-all">10</button>
          <button className="px-3 py-1.5 rounded-lg text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-all">Next</button>
        </div>
      </div>
    ),
    previewCode: `<Pagination
  currentPage={page}
  totalPages={20}
  onPageChange={setPage}
  siblingCount={1}
  boundaryCount={1}
/>`,
    examples: {
      react: codeBlock(`import { Pagination } from '@awesomeui/react'

function Example() {
  const [page, setPage] = useState(1)
  return (
    <Pagination
      currentPage={page}
      totalPages={20}
      onPageChange={setPage}
      siblingCount={1}
      boundaryCount={1}
    />
  )
}`),
    },
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    category: "navigation",
    description: "Breadcrumb navigation showing page hierarchy with links and separators.",
    version: "1.0.0",
    imports: codeBlock(`import { Breadcrumb } from '@awesomeui/react'`),
    props: [
      { name: "items", type: "array", default: "[]", description: "Array of items with label, href, and optional icon" },
      { name: "separator", type: '"slash" | "chevron" | "dot" | "arrow"', default: '"chevron"', description: "Separator style" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size of the breadcrumb text" },
      { name: "maxItems", type: "number", default: "-", description: "Maximum items before collapsing with ellipsis" },
    ],
    slots: [
      { name: "default", description: "Custom breadcrumb items" },
    ],
    preview: (
      <div className="py-8 px-4 flex justify-center">
        <nav className="flex items-center gap-1.5 text-sm">
          <a className="text-surface-400 hover:text-surface-200 transition-colors">Home</a>
          <svg className="w-3.5 h-3.5 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <a className="text-surface-400 hover:text-surface-200 transition-colors">Docs</a>
          <svg className="w-3.5 h-3.5 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-surface-100 font-medium">Components</span>
        </nav>
      </div>
    ),
    previewCode: `const items = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Components' },
]

<Breadcrumb items={items} separator="chevron" />`,
    examples: {
      react: codeBlock(`import { Breadcrumb } from '@awesomeui/react'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Components' },
]

function Example() {
  return <Breadcrumb items={items} separator="chevron" />
}`),
    },
  },
  {
    id: "dropdown-menu",
    name: "Dropdown Menu",
    category: "overlay",
    description: "Dropdown menu with trigger, items, separators, and keyboard navigation.",
    version: "1.0.0",
    imports: codeBlock(`import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@awesomeui/react'`),
    props: [
      { name: "label", type: "string", default: "'Menu'", description: "Accessible label for the menu" },
      { name: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Alignment relative to the trigger" },
      { name: "side", type: '"bottom" | "top" | "left" | "right"', default: '"bottom"', description: "Which side the dropdown appears on" },
      { name: "items", type: "array", default: "[]", description: "Array of menu items with label, icon, shortcut" },
    ],
    slots: [
      { name: "trigger", description: "Opens the dropdown" },
      { name: "default", description: "Custom menu content" },
    ],
    preview: <DropdownMenuPreview />,
    previewCode: `<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuItem icon={<UserIcon />} shortcut="⌘P">
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem icon={<SettingsIcon />} shortcut="⌘S">
      Settings
    </DropdownMenuItem>
    <DropdownMenu.Separator />
    <DropdownMenuItem variant="destructive">
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    examples: {
      react: codeBlock(`import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@awesomeui/react'

function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem icon={<UserIcon />} shortcut="⌘P">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem icon={<SettingsIcon />} shortcut="⌘S">
          Settings
        </DropdownMenuItem>
        <DropdownMenu.Separator />
        <DropdownMenuItem variant="destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`),
    },
  },
];

export const componentCategories = [
  { name: "primitive", label: "Primitives" },
  { name: "form", label: "Forms" },
  { name: "data-display", label: "Data Display" },
  { name: "layout", label: "Layout" },
  { name: "feedback", label: "Feedback" },
  { name: "navigation", label: "Navigation" },
  { name: "overlay", label: "Overlays" },
];

export const allComponentIds = components.map((c) => c.id);
export function getComponent(id: string): ComponentDoc | undefined {
  return components.find((c) => c.id === id);
}
