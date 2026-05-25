export function cn(...inputs: (string | false | null | undefined | Record<string, boolean>)[]) {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.join(" ");
}

export const frameworks = [
  { id: "react", name: "React", color: "#61DAFB" },
  { id: "nextjs", name: "Next.js", color: "#ffffff" },
  { id: "vue", name: "Vue", color: "#4FC08D" },
  { id: "angular", name: "Angular", color: "#DD0031" },
  { id: "svelte", name: "Svelte", color: "#FF3E00" },
  { id: "solid", name: "SolidJS", color: "#2C4F7C" },
  { id: "react-native", name: "React Native", color: "#61DAFB" },
] as const;

export const codeExamples: Record<string, Record<string, string>> = {
  button: {
    react: `import { Button } from '@awesomeui/react'

function App() {
  return (
    <Button variant="primary" size="md">
      Click Me
    </Button>
  )
}`,
    vue: `<template>
  <Button variant="primary" size="md">
    Click Me
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@awesomeui/vue'
</script>`,
    angular: `import { Component } from '@angular/core'
import { ButtonModule } from '@awesomeui/angular'

@Component({
  template: \`
    <aw-button variant="primary" size="md">
      Click Me
    </aw-button>
  \`
})
export class AppComponent {}`,
    svelte: `<script lang="ts">
  import { Button } from '@awesomeui/svelte'
</script>

<Button variant="primary" size="md">
  Click Me
</Button>`,
    solid: `import { Button } from '@awesomeui/solid'

function App() {
  return (
    <Button variant="primary" size="md">
      Click Me
    </Button>
  )
}`,
    "react-native": `import { Button } from '@awesomeui/react-native'

function App() {
  return (
    <Button variant="primary" size="md">
      Click Me
    </Button>
  )
}`,
  },
  dialog: {
    react: `import { Dialog, DialogTrigger, DialogContent } from '@awesomeui/react'

function App() {
  return (
    <Dialog>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <h2>Hello World</h2>
      </DialogContent>
    </Dialog>
  )
}`,
  },
  form: {
    react: `import { Form, Input, Button } from '@awesomeui/react'

function LoginForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Input name="email" label="Email" type="email" />
      <Input name="password" label="Password" type="password" />
      <Button type="submit">Sign In</Button>
    </Form>
  )
}`,
  },
  table: {
    react: `import { Table, TableHead, TableRow, TableCell } from '@awesomeui/react'

function DataTable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Role</TableCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}`,
  },
};
