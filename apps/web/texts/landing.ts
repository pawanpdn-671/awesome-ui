export const layout = {
  title: {
    default: "AwesomeUI — Universal UI for Every Framework",
    template: "%s — AwesomeUI",
  },
  description:
    "Build once. Ship everywhere. One design system for React, Next.js, Vue, Angular, Svelte, SolidJS, and React Native.",
  keywords: [
    "UI library", "component library", "React", "Vue", "Angular",
    "Svelte", "SolidJS", "React Native", "Next.js", "design system",
    "cross-framework",
  ],
  openGraph: {
    siteName: "AwesomeUI",
    title: "AwesomeUI — Universal UI for Every Framework",
    description: "Build once. Ship everywhere. One design system for every framework.",
  },
  twitter: {
    title: "AwesomeUI — Universal UI for Every Framework",
    description: "Build once. Ship everywhere. One design system for every framework.",
  },
} as const;

export const header = {
  links: [
    { href: "/docs", label: "Docs" },
    { href: "/components", label: "Components" },
    { href: "/docs/theming", label: "Theming" },
    { href: "/docs/api-reference", label: "API" },
  ],
  cta: "Get Started",
  ariaLabel: {
    github: "GitHub",
    closeMenu: "Close menu",
    openMenu: "Open menu",
  },
} as const;

export const hero = {
  badge: "v0.1.0 — Public Alpha",
  heading: {
    part1: "Universal UI",
    part2: "for every framework.",
  },
  subtitle:
    "One design system. Unified APIs. Beautiful defaults.",
  subtitleFrameworks: "React, Next.js, Vue, Angular, Svelte, SolidJS, and React Native",
  cta: {
    getStarted: "Get Started",
    browseComponents: "Browse Components",
    github: "GitHub",
  },
  metrics: [
    { value: "7", label: "Frameworks" },
    { value: "26+", label: "Components" },
    { value: "Zero", label: "Lock-in" },
    { value: "100%", label: "TypeScript" },
  ],
  floatingFrameworks: [
    { name: "React", color: "#61DAFB", x: "-20%", y: "15%", delay: "0s" },
    { name: "Vue", color: "#4FC08D", x: "85%", y: "10%", delay: "0.5s" },
    { name: "Angular", color: "#DD0031", x: "90%", y: "60%", delay: "1s" },
    { name: "Svelte", color: "#FF3E00", x: "-15%", y: "70%", delay: "1.5s" },
    { name: "SolidJS", color: "#2C4F7C", x: "50%", y: "-5%", delay: "2s" },
    { name: "React Native", color: "#61DAFB", x: "5%", y: "85%", delay: "2.5s" },
  ],
  terminalCommands: [
    "npx awesomeui init",
    "✔ Framework detected: Next.js",
    "✔ Style system: Tailwind CSS",
    "✔ TypeScript: enabled",
    "✔ Components generated: 26",
    "",
    "Success! AwesomeUI is ready.",
    "Run `npx awesomeui add` to add components.",
  ],
  codeBlock: {
    welcome: "Welcome to AwesomeUI",
    getStarted: "Get Started",
  },
  frameworkGrid: ["React", "Vue", "Angular", "Svelte"],
} as const;

export const frameworkSupport = {
  badge: "Multi-Framework",
  heading: "Your framework. Our components.",
  subheading:
    "Every AwesomeUI component is available for every major framework. Same API. Same design. Same developer experience.",
  stats: [
    { value: "26+", label: "Components" },
    { value: "100%", label: "TypeScript" },
    { value: "Zero", label: "Lock-in" },
    { value: "~5kB", label: "Per Component" },
  ],
  labels: {
    install: "Install",
    compatible: "✓ Compatible",
    ssr: "SSR",
    rsc: "RSC",
  },
  frameworks: [
    { id: "react", name: "React", install: "npm install @awesomeui/react", version: "18.x / 19.x", ssr: true, rsc: true },
    { id: "nextjs", name: "Next.js", install: "npm install @awesomeui/react", version: "14.x / 15.x", ssr: true, rsc: true },
    { id: "vue", name: "Vue", install: "npm install @awesomeui/vue", version: "3.x", ssr: true, rsc: false },
    { id: "angular", name: "Angular", install: "npm install @awesomeui/angular", version: "17.x / 18.x", ssr: true, rsc: false },
    { id: "svelte", name: "Svelte", install: "npm install @awesomeui/svelte", version: "5.x", ssr: true, rsc: false },
    { id: "solid", name: "SolidJS", install: "npm install @awesomeui/solid", version: "1.x", ssr: true, rsc: false },
    { id: "react-native", name: "React Native", install: "npm install @awesomeui/react-native", version: "0.76+", ssr: false, rsc: false },
  ],
} as const;

export const apiPhilosophy = {
  badge: "Universal API",
  heading: {
    part1: "One API.",
    part2: "Every framework.",
  },
  subheading:
    "Learn it once. Use it everywhere. Our universal API philosophy means your knowledge transfers seamlessly between frameworks.",
  tenets: [
    { title: "Same Component Naming", desc: "Button, Dialog, Card, Input — same names everywhere." },
    { title: "Same Props API", desc: "variant, size, disabled, loading — identical props across all frameworks." },
    { title: "Same Theming System", desc: "CSS variables + design tokens. One theme, every framework." },
    { title: "Same Accessibility", desc: "WAI-ARIA compliant. Keyboard navigable. Screen reader friendly." },
    { title: "Same Design Tokens", desc: "Colors, spacing, typography, shadows — one source of truth." },
  ],
  codeExamples: [
    { label: "React", color: "bg-awesome-400" },
    { label: "Vue", color: "bg-emerald-400" },
    { label: "Svelte", color: "bg-orange-400" },
    { label: "Angular", color: "bg-sky-400" },
  ],
  codeButton: "Submit",
} as const;

export const componentShowcase = {
  badge: "Component Gallery",
  heading: "Beautiful components. Zero effort.",
  subheading:
    "Explore our growing library of production-ready components. Every component works in every framework.",
  categories: ["All", "Actions", "Overlay", "Data Entry", "Data Display", "Navigation", "Layout"],
  components: [
    { id: "button", name: "Button", description: "Versatile button component with multiple variants and sizes.", category: "Actions" },
    { id: "dialog", name: "Dialog", description: "Modal dialog with overlay, focus trap, and animations.", category: "Overlay" },
    { id: "form", name: "Forms", description: "Form components with validation, labels, and error states.", category: "Data Entry" },
    { id: "command", name: "Command Menu", description: "Spotlight-style command palette with search and keyboard shortcuts.", category: "Navigation" },
    { id: "card", name: "Card", description: "Content container with header, body, and footer sections.", category: "Layout" },
    { id: "table", name: "Table", description: "Data table with sorting, pagination, and responsive design.", category: "Data Display" },
  ],
  preview: {
    button: { primary: "Primary", secondary: "Secondary", ghost: "Ghost" },
    dialog: { title: "Confirm Action", description: "Are you sure you want to proceed?", cancel: "Cancel", confirm: "Confirm" },
    form: { email: "Email", password: "Password", emailPlaceholder: "you@example.com", signIn: "Sign In" },
    command: { searchPlaceholder: "Search...", shortcut: "⌘K", items: ["Settings", "Profile", "Notifications", "Logout"] },
    card: { title: "Beautiful Card", description: "Cards are versatile content containers used throughout the UI.", cta: "Learn More" },
    table: { headers: ["Name", "Role", "Status"], rows: [{ name: "John Doe", role: "Developer", status: "Active" }, { name: "Jane Smith", role: "Designer", status: "Active" }, { name: "Bob Johnson", role: "PM", status: "Away" }] },
  },
  toggle: { preview: "Preview", code: "Code" },
  comingSoon: "// Coming soon",
  cta: "Browse all 26+ components",
} as const;

export const crossPlatform = {
  badge: "Cross-Platform",
  heading: {
    part1: "One codebase.",
    part2: "Every platform.",
  },
  subheading:
    "Build once and deploy to web, mobile, and desktop. AwesomeUI adapts to each platform while maintaining consistent APIs and design.",
  platforms: [
    {
      name: "Web",
      desc: "React, Vue, Angular, Svelte, SolidJS",
      features: ["SSR support", "RSC compatible", "Responsive", "SEO optimized"],
    },
    {
      name: "Mobile",
      desc: "React Native — iOS & Android",
      features: ["Native gestures", "Platform adaptive", "Shared logic", "Same API"],
    },
    {
      name: "Desktop",
      desc: "Electron, Tauri, or any webview",
      features: ["Keyboard shortcuts", "Window management", "System menus", "Tray icons"],
    },
  ],
  bottom: {
    heading: "Same component. Everywhere.",
    description:
      "Write your UI once using AwesomeUI's universal API and watch it render natively on every platform. The same Button component works across web browsers, mobile devices, and desktop applications.",
    tags: ["React", "Vue", "Angular", "Svelte", "Solid", "RN"],
    preview: {
      label: "Preview",
      title: "AwesomeUI",
      subtitle: "Running on all platforms",
      web: "Web",
      mobile: "Mobile",
      desktop: "Desktop",
    },
  },
} as const;

export const dxSection = {
  badge: "Developer Experience",
  heading: "Built for developers.",
  subheading:
    "Every API, every tool, every detail is crafted to make you more productive and your code more maintainable.",
  features: [
    { title: "TypeScript-First", desc: "Fully typed APIs with strict TypeScript support. Autocomplete works out of the box." },
    { title: "Tree Shakable", desc: "Import only what you need. Dead code elimination built in." },
    { title: "Accessible", desc: "WAI-ARIA compliant components. Keyboard navigation. Screen reader support." },
    { title: "SSR + RSC", desc: "Server-side rendering and React Server Components support for Next.js." },
    { title: "Theme Engine", desc: "CSS variables based theming. Customize every aspect of the design." },
    { title: "Performance", desc: "Optimized bundles. Lazy loading. Minimal runtime overhead." },
    { title: "CLI Generators", desc: "Generate components, themes, and full project scaffolds from the CLI." },
    { title: "Framework Adapters", desc: "Thin adapters for every major framework. Zero overhead." },
  ],
  codeBlocks: {
    tsAutocomplete: { heading: "TypeScript Autocomplete", clickMe: "Click Me" },
    modularImports: { heading: "Modular Imports" },
  },
} as const;

export const cliSection = {
  badge: "CLI Powered",
  heading: "Terminal-first workflow.",
  subheading:
    "Everything you need at your fingertips. Initialize, add components, and configure your project — all from the command line.",
  workflows: [
    {
      title: "Initialize a project",
      commands: ["npx awesomeui init", "✔ Detecting project...", "✔ Framework: Next.js 15", "✔ Style: Tailwind CSS", "✔ TypeScript: enabled", "", "✔ Project initialized!"],
    },
    {
      title: "Add components",
      commands: ["npx awesomeui add button", "npx awesomeui add dialog", "npx awesomeui add card", "npx awesomeui add form", "", "✔ All components added"],
    },
    {
      title: "List available components",
      commands: ["npx awesomeui list", "", "Available components:", "  • button       Actions", "  • dialog       Overlay", "  • card         Layout", "  • form         Data Entry", "  • table        Data Display", "  • command      Navigation", "  • ... 20 more"],
    },
  ],
  frameworkSetup: {
    heading: "Framework-specific setup",
    frameworks: [
      { name: "React", code: "npx awesomeui init --framework react", color: "#61DAFB" },
      { name: "Next.js", code: "npx awesomeui init --framework next", color: "#fff" },
      { name: "Vue", code: "npx awesomeui init --framework vue", color: "#4FC08D" },
      { name: "Angular", code: "npx awesomeui init --framework angular", color: "#DD0031" },
      { name: "Svelte", code: "npx awesomeui init --framework svelte", color: "#FF3E00" },
      { name: "Solid", code: "npx awesomeui init --framework solid", color: "#2C4F7C" },
    ],
  },
  cta: "View CLI Documentation",
} as const;

export const architectureSection = {
  badge: "Architecture",
  heading: {
    part1: "Built different.",
    part2: "Engineered better.",
  },
  subheading:
    "AwesomeUI uses a groundbreaking IR-based architecture that decouples component definitions from framework-specific rendering.",
  layers: [
    { title: "Core IR", desc: "Framework-agnostic Intermediate Representation defines every component as structured JSON." },
    { title: "Framework Adapters", desc: "Thin adapters translate IR to React, Vue, Angular, Svelte, SolidJS, and React Native." },
    { title: "Design Tokens", desc: "Shared design tokens drive consistent styling across every framework and platform." },
    { title: "Accessibility Engine", desc: "Built-in WAI-ARIA patterns, keyboard navigation, and screen reader support." },
    { title: "Rendering Layer", desc: "Optimized rendering with SSR, RSC, and streaming support for maximum performance." },
    { title: "CLI & Tooling", desc: "Code generation, scaffolding, theming CLI, and project initialization tools." },
  ],
  howItWorks: {
    heading: "How it works",
    steps: [
      { number: "1", title: "Define in IR", desc: "Components are defined in a framework-agnostic JSON format using our IR schema." },
      { number: "2", title: "Transpile", desc: "Framework adapters transpile IR to native React, Vue, Angular, or Svelte components." },
      { number: "3", title: "Render", desc: "Native components render with shared design tokens, theming, and accessibility built in." },
    ],
  },
} as const;

export const themingSection = {
  badge: "Theming System",
  heading: {
    part1: "Your brand.",
    part2: "Your theme.",
  },
  subheading:
    "Comprehensive design tokens and CSS variables give you complete control over every aspect of the visual design.",
  tokens: [
    { category: "Colors", items: ["Primary", "Surface", "Success", "Warning", "Danger", "Muted"] },
    { category: "Typography", items: ["Font Family", "Font Sizes", "Font Weights", "Line Heights"] },
    { category: "Spacing", items: ["4px scale", "8px scale", "16px scale", "32px scale"] },
    { category: "Radius", items: ["None", "Small", "Medium", "Large", "Full"] },
    { category: "Shadows", items: ["Small", "Medium", "Large", "XL", "Glow"] },
    { category: "Animation", items: ["Duration", "Easing", "Keyframes", "Transitions"] },
  ],
  livePreview: {
    heading: "Live Preview",
    colors: [
      { color: "#6366f1", label: "Indigo" },
      { color: "#10b981", label: "Emerald" },
      { color: "#f59e0b", label: "Amber" },
      { color: "#ef4444", label: "Red" },
      { color: "#8b5cf6", label: "Purple" },
    ],
    radii: ["sm", "md", "lg", "xl", "2xl"],
  },
  cssVariables: {
    heading: "CSS Variables",
    copy: "Copy",
    copied: "Copied",
  },
  darkMode: {
    heading: "Dark Mode Ready",
    description:
      "All components ship with dark mode support built in. Toggle between light and dark themes with a single CSS class on the HTML element. Design tokens automatically adapt.",
  },
} as const;

export const ecosystemSection = {
  badge: "Ecosystem",
  heading: "Everything you need.",
  subheading:
    "A growing ecosystem of tools, integrations, and resources to accelerate your workflow.",
  items: [
    { title: "Figma Kit", desc: "Full component library for Figma. Design with the same components you build with." },
    { title: "VSCode Extension", desc: "Snippets, autocomplete, and live previews directly in your editor." },
    { title: "Starter Kits", desc: "Pre-configured project templates for every framework. Zero setup." },
    { title: "Storybook", desc: "Explore and test components in isolation with our Storybook integration." },
    { title: "Theme Generator", desc: "Visual theme editor to create and preview custom design tokens." },
    { title: "Icon Library", desc: "1,200+ icons optimized for all frameworks. Consistent and customizable." },
  ],
  cta: "Explore the Ecosystem",
} as const;

export const comparisonSection = {
  badge: "Comparison",
  heading: "Why AwesomeUI?",
  subheading:
    "The only truly cross-framework UI platform. No other library comes close.",
  headers: [
    { key: "awesomeui", label: "AwesomeUI", highlight: true },
    { key: "mui", label: "Material UI", highlight: false },
    { key: "chakra", label: "Chakra UI", highlight: false },
    { key: "antd", label: "Ant Design", highlight: false },
    { key: "mantine", label: "Mantine", highlight: false },
    { key: "shadcn", label: "shadcn/ui", highlight: false },
  ],
  features: [
    { name: "Cross-Framework", awesomeui: true, mui: "React only", chakra: "React only", antd: "React only", mantine: "React only", shadcn: "React only" },
    { name: "React Native", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: "Partial" },
    { name: "Vue Support", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: false },
    { name: "Angular Support", awesomeui: true, mui: false, chakra: false, antd: "Angular ver.", mantine: false, shadcn: false },
    { name: "Svelte Support", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: false },
    { name: "SolidJS Support", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: false },
    { name: "Unified API", awesomeui: true, mui: true, chakra: true, antd: true, mantine: true, shadcn: true },
    { name: "TypeScript", awesomeui: true, mui: true, chakra: true, antd: true, mantine: true, shadcn: true },
    { name: "Tree Shakable", awesomeui: true, mui: "Partial", chakra: true, antd: "Partial", mantine: true, shadcn: true },
    { name: "SSR Support", awesomeui: true, mui: true, chakra: true, antd: true, mantine: true, shadcn: true },
    { name: "RSC Support", awesomeui: true, mui: "Partial", chakra: false, antd: false, mantine: false, shadcn: true },
    { name: "CLI Generators", awesomeui: true, mui: false, chakra: false, antd: false, mantine: false, shadcn: true },
    { name: "Theming Engine", awesomeui: true, mui: true, chakra: true, antd: true, mantine: true, shadcn: "CSS vars" },
    { name: "Accessibility", awesomeui: true, mui: true, chakra: true, antd: "Partial", mantine: true, shadcn: true },
    { name: "Bundle Size", awesomeui: "~5kB/comp", mui: "~50kB+", chakra: "~30kB+", antd: "~100kB+", mantine: "~40kB+", shadcn: "~3kB/comp" },
  ],
  featureHeader: "Feature",
} as const;

export const footer = {
  columns: {
    Product: [
      { href: "/docs/getting-started", label: "Getting Started" },
      { href: "/components", label: "Components" },
      { href: "/docs/theming", label: "Theming" },
      { href: "/docs/cli", label: "CLI" },
      { href: "/docs/api-reference", label: "API Reference" },
    ],
    Frameworks: [
      { href: "/docs/getting-started?framework=react", label: "React" },
      { href: "/docs/getting-started?framework=nextjs", label: "Next.js" },
      { href: "/docs/getting-started?framework=vue", label: "Vue" },
      { href: "/docs/getting-started?framework=angular", label: "Angular" },
      { href: "/docs/getting-started?framework=svelte", label: "Svelte" },
      { href: "/docs/getting-started?framework=solid", label: "SolidJS" },
      { href: "/docs/getting-started?framework=react-native", label: "React Native" },
    ],
    Resources: [
      { href: "/docs/guides", label: "Guides" },
      { href: "/docs/accessibility", label: "Accessibility" },
      { href: "/docs/api-reference", label: "API Reference" },
      { href: "/docs/migration", label: "Migration" },
      { href: "https://github.com", label: "GitHub" },
    ],
    Company: [
      { href: "/", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "https://twitter.com", label: "Twitter" },
      { href: "https://discord.gg", label: "Discord" },
    ],
  },
  copyright: "AwesomeUI. All rights reserved.",
  logoAlt: "AwesomeUI",
} as const;

export const componentsPage = {
  heading: "Component Library",
  subheading:
    "Explore every AwesomeUI component. Each component works identically across all supported frameworks.",
} as const;
