export const docsDatabase = {
  getAllDocs() {
    return [
      // ── Getting Started ──
      {
        source: 'getting-started.md',
        content: `AwesomeUI is a universal UI platform that works across every major framework including React, Next.js, Vue, Angular, Svelte, SolidJS, and React Native. To get started, install the package for your framework using npm: npm install @awesomeui/react for React or Next.js, npm install @awesomeui/vue for Vue, npm install @awesomeui/angular for Angular, npm install @awesomeui/svelte for Svelte, npm install @awesomeui/solid for SolidJS. Once installed, import components from the framework-specific package. Use the CLI to initialize your project with "npx awesomeui init" which detects your framework automatically. Add individual components with "npx awesomeui add button dialog card". All 26+ components are available for every framework with the same API.`
      },
      {
        source: 'getting-started.md',
        content: `Quick Start guide: After installing AwesomeUI for your framework, import any component and use it in your application. For example, import { Button, Card } from '@awesomeui/react' and use them in your JSX. AwesomeUI supports both Server Components and Client Components in Next.js 14 and 15. The CLI can scaffold your entire project. For existing projects, simply install the package and start importing components. Each component is tree-shakable, so you only bundle what you use.`
      },
      {
        source: 'getting-started.md',
        content: `AwesomeUI provides a comprehensive library of 26+ production-ready components across 7 categories: Actions (Button, Dropdown Menu, Menubar), Overlay (Dialog, Toast, Tooltip), Data Entry (Input, Select, Checkbox, Switch, Textarea), Data Display (Table, Badge, Avatar, Card, Progress, Skeleton), Navigation (Tabs, Breadcrumb, Pagination, Sidebar), Layout (Accordion), and Feedback (Alert, Loading). Every component works identically across all supported frameworks.`
      },

      // ── Components ──
      {
        source: 'components.md',
        content: `Button component: Buttons trigger actions and are available in five visual variants. Use variant="primary" for the main call-to-action with indigo background. variant="secondary" for alternative actions with a surface background. variant="outline" for bordered buttons with minimal emphasis. variant="ghost" for the least emphasis, appearing as text. variant="glow" for emphasized actions with a glowing indigo shadow. Sizes include sm (small), md (medium), and lg (large). The Button supports disabled and loading states.`
      },
      {
        source: 'components.md',
        content: `Dialog component: Modal dialogs with overlay backdrop, focus trap, and keyboard dismissal. The Dialog uses a compound component pattern: Dialog as the root, DialogTrigger to open, and DialogContent for the modal content. Dialogs trap focus within the modal, close with the Escape key, and return focus to the trigger element on close. Use for confirmations, forms, and detailed information that requires user attention.`
      },
      {
        source: 'components.md',
        content: `Form components: AwesomeUI provides a complete set of form components including Input, Select, Checkbox, Switch, and Textarea. All form components support labels, validation errors, disabled states, and required field indicators. The Input component supports types text, email, password, and number. Error states are displayed below the input. Forms are fully accessible with proper ARIA attributes and keyboard navigation.`
      },
      {
        source: 'components.md',
        content: `Card component: Versatile content container with header, body, and footer sections. Cards are used throughout the UI to group related content. They support multiple variants and can be customized with AwesomeUI's theming system. Cards are responsive by default and work well in grid layouts. Use cards for dashboards, content previews, and information display.`
      },
      {
        source: 'components.md',
        content: `Badge component: Badges are used to display status, counts, or labels. Available in variants: default, primary, success, warning, and danger. Badges are compact and can be used inside buttons, cards, or standalone. They support small and medium sizes and can be customized with the theming system.`
      },
      {
        source: 'components.md',
        content: `Tabs component: Tabs organize content into switchable panels. Implemented as a compound component with Tab, TabList, TabPanel sub-components. Tabs support keyboard navigation with arrow keys, controlled and uncontrolled state management, and responsive design. Active tab is indicated with the awesome-500 color.`
      },
      {
        source: 'components.md',
        content: `Toast component: Toast notifications provide non-intrusive feedback messages. They appear temporarily and can be dismissed. Toasts support success, error, warning, and info variants. They are positioned at the top-right by default and stack automatically. Toast duration can be configured. Use sonner library integration for more advanced toast management.`
      },
      {
        source: 'components.md',
        content: `Dropdown Menu component: Dropdown menus present a list of options when triggered. They use a compound component pattern for flexibility. Dropdown items support icons, separators, disabled states, and keyboard navigation with arrow keys. Menus close on selection or clicking outside.`
      },

      // ── Theming ──
      {
        source: 'theming.md',
        content: `AwesomeUI uses a comprehensive design token system built on CSS custom properties. Customize every aspect of the visual design with minimal effort. Design tokens are the foundation covering colors, spacing, typography, shadows, and more. All design tokens are exposed as CSS custom properties for easy overrides. The primary color palette is indigo-based with awesome-50 through awesome-950. Surface colors use slate tones with surface-50 through surface-950.`
      },
      {
        source: 'theming.md',
        content: `Dark mode is built into every AwesomeUI component. Components automatically adapt when the .dark class is applied to the HTML root element. Design tokens are inverted in light mode — surface-50 becomes the darkest shade and surface-950 becomes the lightest. The theme system respects prefers-color-scheme and stores user preference in localStorage. Toggle between light and dark with a single CSS class.`
      },
      {
        source: 'theming.md',
        content: `Customize AwesomeUI by overriding CSS custom properties. For example, change --color-brand to your brand color to update all components at once. Use the @awesomeui/themes package for programmatic theme management. Design tokens include color (primary, surface, success, warning, danger, muted), typography (font family, sizes, weights, line heights), spacing (4px, 8px, 16px, 32px scale), radius (none, sm, md, lg, xl, full), shadows (sm, md, lg, xl, glow), and animations (duration, easing, keyframes, transitions).`
      },

      // ── CLI ──
      {
        source: 'cli.md',
        content: `The AwesomeUI CLI helps you initialize projects, add components, and manage configuration from the command line. Initialize with "npx awesomeui init" which detects your framework (React, Next.js, Vue, Angular, Svelte, SolidJS), style system (Tailwind CSS), and TypeScript configuration automatically. Add components individually with "npx awesomeui add button dialog card". List all available components with "npx awesomeui list".`
      },
      {
        source: 'cli.md',
        content: `CLI Init command: Run "npx awesomeui init" in your project root. The CLI auto-detects your framework, package manager, and TypeScript settings. It creates an awesomeui.config.json file and sets up the component generation pipeline. Components are generated in src/components/ui by default. You can specify framework with --framework flag: "npx awesomeui init --framework next" for Next.js projects.`
      },
      {
        source: 'cli.md',
        content: `CLI Add command: Add components individually to your project with "npx awesomeui add <component-name>". Multiple components can be added at once: "npx awesomeui add button dialog card toast". Components are transpiled to your framework's syntax automatically. The CLI reads component definitions from the AwesomeUI registry, transpiles them to your framework, and writes the generated files to your project. Already added components are tracked to avoid duplicates.`
      },

      // ── API Reference ──
      {
        source: 'api-reference.md',
        content: `AwesomeUI provides these packages: @awesomeui/core (Core IR schema and types), @awesomeui/react (React components), @awesomeui/next (Next.js adapter), @awesomeui/vue (Vue components), @awesomeui/angular (Angular components), @awesomeui/svelte (Svelte components), @awesomeui/solid (SolidJS components), @awesomeui/react-native (React Native components), @awesomeui/tokens (Design tokens), @awesomeui/themes (Theming system), @awesomeui/cli (CLI tooling). All framework packages expose the same component API.`
      },
      {
        source: 'api-reference.md',
        content: `Common component props across all AwesomeUI components: variant (visual style: primary, secondary, outline, ghost, glow), size (component size: sm, md, lg), disabled (boolean to disable interaction), className (custom CSS classes combined with cn utility), children (content to render inside the component). All components accept ref forwarding for direct DOM access. Events follow framework conventions — onClick in React, @click in Vue.`
      },

      // ── Architecture ──
      {
        source: 'architecture.md',
        content: `AwesomeUI uses an innovative IR-based (Intermediate Representation) architecture. Components are defined in a framework-agnostic JSON format using the IR schema. Framework adapters then transpile this IR to native React, Vue, Angular, Svelte, or SolidJS components. This means one component definition works everywhere. The architecture includes: Core IR (framework-agnostic component definitions), Framework Adapters (thin translation layer), Design Tokens (shared styling), Accessibility Engine (built-in ARIA), and CLI & Tooling (code generation and scaffolding).`
      },
      {
        source: 'architecture.md',
        content: `AwesomeUI's IR-based architecture decouples component definitions from framework-specific rendering. Each component is defined as structured JSON with props, slots, events, styles (Tailwind classes), and accessibility metadata. The transpiler converts this IR into native framework code. This approach ensures consistent APIs, behavior, and design across all seven supported frameworks while keeping bundle sizes minimal (~5kB per component).`
      },

      // ── Cross-Platform ──
      {
        source: 'cross-platform.md',
        content: `AwesomeUI is a cross-platform UI library. Build once and deploy to web, mobile, and desktop. For web, use React, Vue, Angular, Svelte, or SolidJS with SSR and RSC support. For mobile, use React Native with native gestures and platform-adaptive design, sharing the same API and logic. For desktop, use Electron, Tauri, or any webview with keyboard shortcuts, window management, and system menus. The same Button component works across all platforms.`
      },

      // ── Accessibility ──
      {
        source: 'accessibility.md',
        content: `AwesomeUI is committed to accessibility. All components meet WCAG 2.1 AA standards. Full keyboard navigation support is built in. Screen reader support with proper ARIA attributes, live regions for dynamic content, announcements for loading states, and descriptive error messages for forms. Focus management is built into all interactive components. Dialogs trap focus within the modal and return focus to the trigger element on close. Skip links for navigation. Visible focus indicators on all interactive elements.`
      },
      {
        source: 'accessibility.md',
        content: `Keyboard navigation in AwesomeUI: Dialog closes with Escape. Dropdown Menu navigates with Arrow Up/Down keys, opens with Enter/Space. Tabs switch with Arrow Left/Right. Command menu opens with Ctrl+K/Cmd+K. Accordion toggles with Enter/Space. Select opens with Arrow Down, navigates with Arrow Up/Down. All interactive elements are keyboard focusable with visible focus rings. Components respect the user's prefers-reduced-motion setting.`
      },

      // ── Ecosystem ──
      {
        source: 'ecosystem.md',
        content: `The AwesomeUI ecosystem includes: Figma Kit with full component library for designers, VSCode Extension with snippets and autocomplete, Starter Kits pre-configured for every framework, Storybook integration for testing components in isolation, Theme Generator for visual theme editing, and an Icon Library with 1200+ icons optimized for all frameworks. Community resources include GitHub discussions, Discord server, and Twitter updates.`
      },

      // ── Performance ──
      {
        source: 'performance.md',
        content: `AwesomeUI is built for performance. Tree shaking ensures only imported components are bundled — about 5kB per component. Zero heavy runtime dependencies. SSR optimized for server rendering. Components can be dynamically imported for lazy loading. The IR-based architecture generates framework-native code with no runtime overhead from the abstraction layer. TypeScript-first with strict types for better developer experience and fewer runtime errors.`
      },

      // ── Framework Support ──
      {
        source: 'framework-support.md',
        content: `AwesomeUI supports 7 frameworks: React (18.x and 19.x with SSR and RSC), Next.js (14.x and 15.x with SSR and RSC), Vue (3.x with SSR), Angular (17.x and 18.x with SSR), Svelte (5.x with SSR), SolidJS (1.x with SSR), and React Native (0.76+). Install with npm install @awesomeui/react for React/Next.js, @awesomeui/vue for Vue, @awesomeui/angular for Angular, @awesomeui/svelte for Svelte, @awesomeui/solid for SolidJS, @awesomeui/react-native for React Native.`
      },

      // ─── Design Tokens Specifics ──
      {
        source: 'design-tokens.md',
        content: `AwesomeUI design tokens: Colors use an indigo primary palette (awesome-50 to awesome-950). Surface colors use a slate palette inverted in light mode. Typography uses Inter as the default sans-serif font and JetBrains Mono for monospace. Spacing follows a 4px scale. Border radius includes none, sm (4px), md (8px), lg (12px), xl (16px), 2xl (24px), and full (9999px). Shadows include sm, md, lg, xl, and glow variants. Animations include fade-in, fade-up, slide-down, scale-in, glow-pulse, float, and shimmer.`
      },
    ];
  },
};
