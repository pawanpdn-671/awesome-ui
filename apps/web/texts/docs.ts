export const sidebar = {
  sections: [
    {
      title: "Getting Started",
      links: [
        { href: "/docs/getting-started", label: "Installation" },
        { href: "/docs/getting-started#quick-start", label: "Quick Start" },
        { href: "/docs/getting-started#frameworks", label: "Framework Setup" },
      ],
    },
    {
      title: "Colors",
      links: [
        { href: "/docs/colors", label: "Overview" },
        { href: "/docs/colors#neutral", label: "Neutral Palettes" },
        { href: "/docs/colors#accent", label: "Accent Palettes" },
        { href: "/docs/colors#css-variables", label: "CSS Variables" },
      ],
    },
    {
      title: "Components",
      links: [
        { href: "/docs/components", label: "Overview (26+)" },
        { href: "/docs/components/form", label: "Form" },
        { href: "/docs/components/button", label: "Button" },
        { href: "/docs/components/badge", label: "Badge" },
        { href: "/docs/components/input", label: "Input" },
        { href: "/docs/components/select", label: "Select" },
        { href: "/docs/components/checkbox", label: "Checkbox" },
        { href: "/docs/components/switch", label: "Switch" },
        { href: "/docs/components/textarea", label: "Textarea" },
        { href: "/docs/components/card", label: "Card" },
        { href: "/docs/components/alert", label: "Alert" },
        { href: "/docs/components/avatar", label: "Avatar" },
        { href: "/docs/components/table", label: "Table" },
        { href: "/docs/components/breadcrumb", label: "Breadcrumb" },
        { href: "/docs/components/pagination", label: "Pagination" },
        { href: "/docs/components/sidebar", label: "Sidebar" },
        { href: "/docs/components/menubar", label: "Menubar" },
        { href: "/docs/components/accordion", label: "Accordion" },
        { href: "/docs/components/skeleton", label: "Skeleton" },
        { href: "/docs/components/progress", label: "Progress" },
        { href: "/docs/components/loading", label: "Loading" },
        { href: "/docs/components/toast", label: "Toast" },
        { href: "/docs/components/dialog", label: "Dialog" },
        { href: "/docs/components/tooltip", label: "Tooltip" },
        { href: "/docs/components/tabs", label: "Tabs" },
        { href: "/docs/components/dropdown-menu", label: "Dropdown Menu" },
      ],
    },
    {
      title: "Theming",
      links: [
        { href: "/docs/theming", label: "Documentation" },
        { href: "/docs/theming#tokens", label: "Design Tokens" },
        { href: "/docs/theming#dark-mode", label: "Dark Mode" },
        { href: "/docs/theming#customization", label: "Customization" },
      ],
    },
    {
      title: "CLI",
      links: [
        { href: "/docs/cli", label: "Overview" },
        { href: "/docs/cli#init", label: "Init" },
        { href: "/docs/cli#add", label: "Add" },
        { href: "/docs/cli#list", label: "List" },
      ],
    },
    {
      title: "API Reference",
      links: [
        { href: "/docs/api-reference", label: "Overview" },
        { href: "/docs/api-reference#props", label: "Common Props" },
        { href: "/docs/api-reference#types", label: "TypeScript Types" },
        { href: "/docs/api-reference#events", label: "Events" },
      ],
    },
    {
      title: "Guides",
      links: [
        { href: "/docs/guides", label: "Overview" },
        { href: "/docs/guides#migration", label: "Migration Guide" },
        { href: "/docs/guides#performance", label: "Performance" },
        { href: "/docs/guides#accessibility", label: "Accessibility" },
      ],
    },
  ],
} as const;

export const docsLanding = {
  heading: "AwesomeUI Documentation",
  subheading:
    "Welcome to the AwesomeUI documentation. Here you'll find everything you need to build beautiful, cross-platform applications with a single design system.",
  cards: [
    { title: "Getting Started", desc: "Install AwesomeUI in your project and start building.", href: "/docs/getting-started" },
    { title: "Components", desc: "Explore all available components and their APIs.", href: "/docs/components" },
    { title: "Theming", desc: "Customize the look and feel of your application.", href: "/docs/theming" },
    { title: "CLI Reference", desc: "Learn how to use the AwesomeUI CLI.", href: "/docs/cli" },
    { title: "API Reference", desc: "Complete API documentation for all packages.", href: "/docs/api-reference" },
    { title: "Guides", desc: "Migration, performance, accessibility guides.", href: "/docs/guides" },
  ],
  viewDocs: "View docs",
} as const;

export const gettingStarted = {
  heading: "Getting Started",
  subheading: "Get up and running with AwesomeUI in minutes. Choose your framework and follow the setup guide.",
  sections: {
    installation: {
      heading: "Installation",
      description: "Install AwesomeUI for your framework of choice using npm, yarn, pnpm, or bun.",
      orWithOther: "Or with other package managers:",
      frameworks: [
        { name: "React / Next.js", command: "npm install @awesomeui/react" },
        { name: "Vue", command: "npm install @awesomeui/vue" },
        { name: "Angular", command: "npm install @awesomeui/angular" },
        { name: "Svelte", command: "npm install @awesomeui/svelte" },
        { name: "SolidJS", command: "npm install @awesomeui/solid" },
        { name: "React Native", command: "npm install @awesomeui/react-native" },
      ],
    },
    quickStart: {
      heading: "Quick Start",
      description: "Once installed, import and use any component in your application:",
      welcome: "Welcome to AwesomeUI",
      ready: "Your cross-framework UI platform is ready.",
      cta: "Get Started",
    },
    frameworkSetup: {
      heading: "Framework Setup",
      description:
        "AwesomeUI works with every major framework out of the box. Each framework gets the same components with the same API, adapted to framework conventions.",
      nextjs: { heading: "Next.js App Router", description: "For Next.js, AwesomeUI supports both Server and Client Components:", hello: "Hello Next.js" },
      vue: { heading: "Vue 3 Composition API", hello: "Hello Vue" },
    },
    cli: {
      heading: "Using the CLI",
      description: "The AwesomeUI CLI helps you initialize projects and add components quickly:",
    },
    nextSteps: {
      heading: "Next Steps",
      links: [
        { href: "/docs/components", label: "component library", prefix: "Explore the " },
        { href: "/docs/theming", label: "theming and customization", prefix: "Learn about " },
        { href: "/docs/api-reference", label: "API reference", prefix: "Check the " },
        { href: "/docs/guides", label: "guides", prefix: "Read the " },
      ],
    },
  },
} as const;

export const componentsDocs = {
  heading: "Components",
  subheading:
    "AwesomeUI provides a comprehensive library of production-ready components. Every component works identically across all supported frameworks.",
  categories: {
    heading: "Available Components",
    description: "Our component library includes 26+ components across 7 categories:",
    groups: [
      { cat: "Actions", items: ["Button", "Dropdown Menu", "Menubar"] },
      { cat: "Overlay", items: ["Dialog", "Toast", "Tooltip"] },
      { cat: "Data Entry", items: ["Input", "Select", "Checkbox", "Switch", "Textarea"] },
      { cat: "Data Display", items: ["Table", "Badge", "Avatar", "Card", "Progress", "Skeleton"] },
      { cat: "Navigation", items: ["Tabs", "Breadcrumb", "Pagination", "Sidebar"] },
      { cat: "Layout", items: ["Accordion"] },
      { cat: "Feedback", items: ["Alert", "Loading"] },
    ],
  },
  importPattern: {
    heading: "Import Pattern",
    description: "All components are importable directly from the framework package:",
  },
  button: {
    heading: "Button Component",
    description: "Buttons are used to trigger actions. Available in multiple variants and sizes.",
    variants: {
      primary: "Primary",
      secondary: "Secondary",
      outline: "Outline",
      ghost: "Ghost",
      glow: "Glow",
    },
  },
  props: {
    tableHeaders: ["Prop", "Type", "Default", "Description"],
    rows: [
      { prop: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "glow"', default: '"primary"', desc: "Visual style variant" },
      { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Button size" },
      { prop: "disabled", type: "boolean", default: "false", desc: "Disables the button" },
      { prop: "loading", type: "boolean", default: "false", desc: "Shows loading state" },
      { prop: "children", type: "ReactNode", default: "-", desc: "Button content" },
    ],
  },
  dialog: {
    heading: "Dialog Component",
    description: "Modal dialogs with overlay, focus trap, and keyboard dismissal.",
    trigger: "Open Dialog",
    title: "Dialog Title",
    body: "This is a dialog with focus trap and ESC to close.",
    confirm: "Confirm",
  },
  nextSteps: {
    heading: "Next Steps",
    links: [
      { href: "/components", label: "interactive component showcase", prefix: "Visit the " },
      { href: "/docs/theming", label: "theming and customization", prefix: "Learn about " },
      { href: "/docs/api-reference", label: "full API reference", prefix: "Check the " },
    ],
  },
} as const;

export const buttonDoc = {
  heading: "Button",
  badge: "Actions",
  subheading:
    "Buttons trigger actions. Available in multiple variants, sizes, and states. Consistent API across all frameworks.",
  sections: {
    import: { heading: "Import" },
    variants: {
      heading: "Variants",
      description: "Five visual variants to match different levels of emphasis:",
      primary: "Primary action",
      secondary: "Secondary action",
      outline: "Outlined action",
      ghost: "Subtle action",
      glow: "Emphasized action",
    },
    sizes: {
      heading: "Sizes",
      small: "Small",
      medium: "Medium",
      large: "Large",
    },
    states: {
      heading: "States",
      disabled: "Disabled",
      loading: "Loading state",
      spinner: "With spinner",
    },
    props: {
      heading: "Props",
      tableHeaders: ["Prop", "Type", "Default"],
      rows: [
        { prop: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "glow"', default: '"primary"' },
        { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
        { prop: "disabled", type: "boolean", default: "false" },
        { prop: "loading", type: "boolean", default: "false" },
        { prop: "type", type: '"button" | "submit" | "reset"', default: '"button"' },
      ],
    },
    frameworkExamples: {
      heading: "Framework Examples",
      submit: "Submit",
    },
  },
} as const;

export const formDoc = {
  heading: "Form",
  badge: "Data Entry",
  subheading:
    "Form components with built-in validation, error states, and accessibility. Includes Input, Select, Checkbox, Switch, and Textarea.",
  sections: {
    import: { heading: "Import" },
    basicForm: {
      heading: "Basic Form",
      email: "Email",
      password: "Password",
      placeholder: "you@example.com",
      signIn: "Sign In",
    },
    inputProps: {
      heading: "Input Props",
      tableHeaders: ["Prop", "Type", "Default"],
      rows: [
        { prop: "name", type: "string", default: "-" },
        { prop: "label", type: "string", default: "-" },
        { prop: "type", type: '"text" | "email" | "password" | "number"', default: '"text"' },
        { prop: "placeholder", type: "string", default: "-" },
        { prop: "required", type: "boolean", default: "false" },
        { prop: "disabled", type: "boolean", default: "false" },
        { prop: "error", type: "string", default: "-" },
      ],
    },
    validation: {
      heading: "Validation",
      submit: "Submit",
    },
  },
} as const;

export const themingDocs = {
  heading: "Theming",
  subheading:
    "AwesomeUI uses a comprehensive design token system built on CSS custom properties. Customize every aspect of the visual design with minimal effort.",
  sections: {
    tokens: {
      heading: "Design Tokens",
      description:
        "Design tokens are the foundation of AwesomeUI's theming system. They provide a single source of truth for colors, spacing, typography, and more.",
    },
    cssVariables: {
      heading: "CSS Variables",
      description: "All design tokens are exposed as CSS custom properties for easy overrides:",
    },
    darkMode: {
      heading: "Dark Mode",
      description:
        "AwesomeUI ships with first-class dark mode support. Components automatically adapt when the .dark class is applied to the root element:",
    },
    customization: {
      heading: "Customization",
      description: "Override any design token to create your own theme:",
    },
    programmatic: {
      heading: "Programmatic Theming",
      description: "Use the @awesomeui/themes package for programmatic theme management:",
    },
    nextSteps: {
      heading: "Next Steps",
      links: [
        { href: "/docs/components", label: "component library", prefix: "Explore the " },
        { href: "/docs/api-reference", label: "API reference", prefix: "Check the " },
        { href: "/docs/guides", label: "accessibility guides", prefix: "Read the " },
      ],
    },
  },
} as const;

export const cliDocs = {
  heading: "CLI Reference",
  subheading:
    "The AwesomeUI CLI is your command-line interface for initializing projects, adding components, and managing your AwesomeUI configuration.",
  sections: {
    init: {
      heading: "Init Command",
      description: "Initialize AwesomeUI in your project. Detects your framework and style system automatically.",
      example: {
        heading: "Example",
        commands: [
          "npx awesomeui init",
          "✔ Detecting project environment...",
          "✔ Framework detected: Next.js 15",
          "✔ Style system detected: Tailwind CSS",
          "✔ TypeScript: enabled",
          "",
          "✔ AwesomeUI initialized successfully!",
          "  → Config created: awesomeui.config.json",
          "  → Components will be generated in: src/components/ui",
          "",
          "Run `npx awesomeui add <component>` to add components.",
        ],
      },
    },
    add: {
      heading: "Add Command",
      description:
        "Add individual components to your project. Components are transpiled to your framework of choice.",
      example: {
        heading: "Example",
        commands: [
          "npx awesomeui add button dialog card",
          "✔ Reading component definitions...",
          "✔ Transpiling to React...",
          "✔ Writing button.tsx",
          "✔ Writing dialog.tsx",
          "✔ Writing card.tsx",
          "",
          "✔ 3 components added successfully!",
          "  → src/components/ui/button.tsx",
          "  → src/components/ui/dialog.tsx",
          "  → src/components/ui/card.tsx",
        ],
      },
    },
    list: {
      heading: "List Command",
      description: "List all available components with their categories and status.",
      example: {
        heading: "Example Output",
        commands: [
          "npx awesomeui list",
          "",
          "Available components (26):",
          "",
          "Actions:",
          "  • button         Button with variants",
          "  • dropdown-menu  Dropdown menu",
          "  • menubar        Menu bar",
          "",
          "Overlay:",
          "  • dialog         Modal dialog",
          "  • toast          Toast notification",
          "  • tooltip        Tooltip",
          "",
          "Data Entry:",
          "  • input          Text input",
          "  • select         Select dropdown",
          "  • checkbox       Checkbox",
          "  • switch         Toggle switch",
          "  • textarea       Text area",
          "",
          "Data Display:",
          "  • table          Data table",
          "  • badge          Badge / pill",
          "  • avatar         Avatar",
          "  • card           Card",
          "  • progress       Progress bar",
          "  • skeleton       Skeleton loader",
          "",
          "Navigation:",
          "  • tabs           Tabs",
          "  • breadcrumb     Breadcrumb",
          "  • pagination     Pagination",
          "  • sidebar        Sidebar",
          "",
          "Layout:",
          "  • accordion      Accordion",
          "  • accordion-item Accordion item",
          "",
          "Feedback:",
          "  • alert          Alert",
          "  • loading        Loading spinner",
        ],
      },
    },
    config: {
      heading: "Configuration",
      description:
        "AwesomeUI uses a configuration file (awesomeui.config.json) in your project root:",
    },
    nextSteps: {
      heading: "Next Steps",
      links: [
        { href: "/docs/theming", label: "theming and customization", prefix: "Learn about " },
        { href: "/docs/components", label: "component library", prefix: "Explore the " },
        { href: "/docs/api-reference", label: "API reference", prefix: "Check the " },
      ],
    },
  },
} as const;

export const apiReference = {
  heading: "API Reference",
  subheading:
    "Complete API documentation for AwesomeUI packages. Every component, hook, and utility follows the same API philosophy across all frameworks.",
  sections: {
    commonProps: {
      heading: "Common Props",
      description:
        "All AwesomeUI components share a consistent set of props for styling, behavior, and accessibility:",
    },
    componentApi: {
      heading: "Component API",
      description: "Every component in AwesomeUI follows a predictable API pattern:",
      items: [
        "Compound components for complex UI (Dialog, Tabs, Command)",
        "Controlled and uncontrolled state management",
        "Ref forwarding for direct DOM access",
        "Event handlers follow framework conventions (onClick, @click)",
      ],
    },
    types: {
      heading: "TypeScript Types",
      description: "AwesomeUI is fully typed. All components export their props interfaces:",
    },
    themingApi: {
      heading: "Theming API",
      description:
        "Customize themes using CSS variables. Every design token is exposed as a CSS custom property:",
    },
    events: {
      heading: "Event Handling",
      description:
        "Events follow each framework's conventions while maintaining consistent behavior:",
    },
    packageRef: {
      heading: "Package Reference",
      tableHeaders: ["Package", "Description", "Version"],
      packages: [
        { pkg: "@awesomeui/core", desc: "Core IR schema and types", ver: "0.1.0" },
        { pkg: "@awesomeui/react", desc: "React components", ver: "0.1.0" },
        { pkg: "@awesomeui/next", desc: "Next.js adapter", ver: "0.1.0" },
        { pkg: "@awesomeui/vue", desc: "Vue components", ver: "0.1.0" },
        { pkg: "@awesomeui/angular", desc: "Angular components", ver: "0.1.0" },
        { pkg: "@awesomeui/svelte", desc: "Svelte components", ver: "0.1.0" },
        { pkg: "@awesomeui/solid", desc: "SolidJS components", ver: "0.1.0" },
        { pkg: "@awesomeui/react-native", desc: "React Native components", ver: "0.1.0" },
        { pkg: "@awesomeui/tokens", desc: "Design tokens", ver: "0.1.0" },
        { pkg: "@awesomeui/themes", desc: "Theming system", ver: "0.1.0" },
        { pkg: "@awesomeui/cli", desc: "CLI tooling", ver: "0.1.0" },
      ],
    },
  },
} as const;

export const guides = {
  heading: "Guides",
  subheading:
    "Best practices, migration guides, performance tips, and accessibility guidelines for building with AwesomeUI.",
  sections: {
    migration: {
      heading: "Migration Guide",
      description:
        "Migrating from other UI libraries to AwesomeUI is straightforward thanks to our familiar API patterns.",
      fromMui: { heading: "From Material UI" },
      fromShadcn: { heading: "From shadcn/ui" },
    },
    performance: {
      heading: "Performance",
      description: "AwesomeUI is built for performance from the ground up:",
      items: [
        "Tree shaking — Import only what you use",
        "Minimal bundle — ~5kB per component",
        "Zero dependencies — No heavy runtime libraries",
        "SSR optimized — Works seamlessly with server rendering",
        "Lazy loading — Components can be dynamically imported",
      ],
    },
    accessibility: {
      heading: "Accessibility",
      description:
        "AwesomeUI is committed to accessibility. All components follow WAI-ARIA guidelines and are tested with screen readers and keyboard navigation.",
      keyboardNav: {
        heading: "Keyboard Navigation",
        items: [
          "All interactive elements are keyboard focusable",
          "Dialogs trap focus and close with Escape",
          "Dropdowns navigate with arrow keys",
          "Tabs navigate with arrow keys",
          "Command menu opens with Ctrl+K / Cmd+K",
        ],
      },
      screenReader: {
        heading: "Screen Reader Support",
        items: [
          "All components have proper ARIA labels",
          "Live regions for dynamic content",
          "Announcements for loading states",
          "Descriptive error messages for forms",
        ],
      },
      colorContrast: {
        heading: "Color Contrast",
        description:
          "All color combinations meet WCAG 2.1 AA standards for contrast ratio. Custom themes should maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.",
      },
    },
    bestPractices: {
      heading: "Best Practices",
      items: [
        "Import from the framework-specific package (e.g., @awesomeui/react)",
        "Use the CLI for component generation and project setup",
        "Override CSS variables for custom theming instead of using !important",
        "Leverage TypeScript for full type safety and autocomplete",
        "Test components across multiple frameworks when building shared UIs",
      ],
    },
  },
} as const;

export const accessibility = {
  heading: "Accessibility",
  subheading:
    "AwesomeUI is built with accessibility as a core principle. Every component follows WAI-ARIA guidelines and is rigorously tested.",
  sections: {
    commitment: {
      heading: "Our Commitment",
      items: [
        "All components meet WCAG 2.1 AA standards",
        "Full keyboard navigation support",
        "Screen reader friendly with proper ARIA attributes",
        "Focus management for modals, dialogs, and menus",
        "Reduced motion support for animations",
        "Color contrast compliance",
      ],
    },
    aria: {
      heading: "ARIA Attributes",
      description: "Every component includes appropriate ARIA attributes automatically:",
    },
    keyboardNav: {
      heading: "Keyboard Navigation",
      tableHeaders: ["Component", "Interaction", "Key"],
      rows: [
        { comp: "Dialog", action: "Close", key: "Escape" },
        { comp: "Dropdown Menu", action: "Navigate items", key: "Arrow Up/Down" },
        { comp: "Dropdown Menu", action: "Open/Close", key: "Enter/Space" },
        { comp: "Tabs", action: "Switch tabs", key: "Arrow Left/Right" },
        { comp: "Command Menu", action: "Open menu", key: "Ctrl + K" },
        { comp: "Command Menu", action: "Close menu", key: "Escape" },
        { comp: "Accordion", action: "Toggle section", key: "Enter/Space" },
        { comp: "Select", action: "Open list", key: "Arrow Down" },
        { comp: "Select", action: "Navigate items", key: "Arrow Up/Down" },
      ],
    },
    focusManagement: {
      heading: "Focus Management",
      description: "Focus management is built into all interactive components:",
      items: [
        "Dialogs trap focus within the modal",
        "Focus returns to trigger element on close",
        "Skip links for navigation",
        "Visible focus indicators on all interactive elements",
        "Programmatic focus management for dynamic content",
      ],
    },
    reducedMotion: {
      heading: "Reduced Motion",
      description: "Respects the user's prefers-reduced-motion setting:",
    },
    testing: {
      heading: "Testing",
      description: "We recommend testing your implementation with:",
      items: [
        "Keyboard-only navigation (Tab, Enter, Escape, Arrow keys)",
        "Screen readers (VoiceOver, NVDA, JAWS)",
        "Browser zoom (200%)",
        "Reduced motion settings",
        "High contrast mode",
      ],
    },
  },
} as const;
