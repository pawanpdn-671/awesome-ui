export const layout = {
  title: { default: "AwesomeUI", template: "%s — AwesomeUI" },
  description: "",
  keywords: [] as string[],
  openGraph: { siteName: "AwesomeUI", title: "AwesomeUI", description: "" },
  twitter: { title: "AwesomeUI", description: "" },
};

export const header = { links: [] as { href: string; label: string }[], cta: "", ariaLabel: { github: "", closeMenu: "", openMenu: "" } };

export const hero = {
  badge: "", heading: { part1: "", part2: "" }, subtitle: "", subtitleFrameworks: "",
  cta: { getStarted: "", browseComponents: "", github: "" },
  metrics: [] as { value: string; label: string }[],
  floatingFrameworks: [] as { name: string; color: string; x: string; y: string; delay: string }[],
  terminalCommands: [] as string[],
  codeBlock: { welcome: "", getStarted: "" },
  frameworkGrid: [] as string[],
};

export const frameworkSupport = {
  badge: "", heading: "", subheading: "",
  stats: [] as { value: string; label: string }[],
  labels: { install: "", compatible: "", ssr: "", rsc: "" },
  frameworks: [] as { id: string; name: string; install: string; version: string; ssr: boolean; rsc: boolean }[],
};

export const apiPhilosophy = {
  badge: "", heading: { part1: "", part2: "" }, subheading: "",
  tenets: [] as { title: string; desc: string }[],
  codeExamples: [] as { label: string; color: string }[],
  codeButton: "",
};

export const componentShowcase = {
  badge: "", heading: "", subheading: "",
  categories: [] as string[],
  components: [] as { id: string; name: string; description: string; category: string }[],
  preview: {} as Record<string, Record<string, string>>,
  toggle: { preview: "", code: "" },
  comingSoon: "", cta: "",
};

export const crossPlatform = {
  badge: "", heading: { part1: "", part2: "" }, subheading: "",
  platforms: [] as { name: string; desc: string; features: string[] }[],
  bottom: { heading: "", description: "", tags: [] as string[], preview: { label: "", title: "", subtitle: "", web: "", mobile: "", desktop: "" } },
};

export const dxSection = {
  badge: "", heading: "", subheading: "",
  features: [] as { title: string; desc: string }[],
  codeBlocks: { tsAutocomplete: { heading: "", clickMe: "" }, modularImports: { heading: "" } },
};

export const cliSection = {
  badge: "", heading: "", subheading: "",
  workflows: [] as { title: string; commands: string[] }[],
  frameworkSetup: { heading: "", frameworks: [] as { name: string; code: string; color: string }[] },
  cta: "",
};

export const architectureSection = {
  badge: "", heading: { part1: "", part2: "" }, subheading: "",
  layers: [] as { title: string; desc: string }[],
  howItWorks: { heading: "", steps: [] as { number: string; title: string; desc: string }[] },
};

export const themingSection = {
  badge: "", heading: { part1: "", part2: "" }, subheading: "",
  tokens: [] as { category: string; items: string[] }[],
  livePreview: { heading: "", colors: [] as { color: string; label: string }[], radii: [] as string[] },
  cssVariables: { heading: "", copy: "", copied: "" },
  darkMode: { heading: "", description: "" },
};

export const ecosystemSection = {
  badge: "", heading: "", subheading: "",
  items: [] as { title: string; desc: string }[],
  cta: "",
};

export const comparisonSection = {
  badge: "", heading: "", subheading: "",
  headers: [] as { key: string; label: string; highlight: boolean }[],
  features: [] as unknown as Record<string, string | boolean>[],
  featureHeader: "",
};

export const footer = {
  columns: {} as Record<string, { href: string; label: string }[]>,
  copyright: "", logoAlt: "",
};

export const componentsPage = { heading: "", subheading: "" };

export const sidebar = { sections: [] as { title: string; links: { href: string; label: string }[] }[] };

export const docsLanding = {
  heading: "", subheading: "",
  cards: [] as { title: string; desc: string; href: string }[],
  viewDocs: "",
};

export const gettingStarted = {
  heading: "", subheading: "",
  sections: {
    installation: { heading: "", description: "", orWithOther: "", frameworks: [] as { name: string; command: string }[] },
    quickStart: { heading: "", description: "", welcome: "", ready: "", cta: "" },
    frameworkSetup: { heading: "", description: "", nextjs: { heading: "", description: "", hello: "" }, vue: { heading: "", hello: "" } },
    cli: { heading: "", description: "" },
    nextSteps: { heading: "", links: [] as { href: string; label: string; prefix: string }[] },
  },
};

export const componentsDocs = {
  heading: "", subheading: "",
  categories: { heading: "", description: "", groups: [] as { cat: string; items: string[] }[] },
  importPattern: { heading: "", description: "" },
  button: { heading: "", description: "", variants: {} as Record<string, string> },
  props: { tableHeaders: [] as string[], rows: [] as { prop: string; type: string; default: string; desc: string }[] },
  dialog: { heading: "", description: "", trigger: "", title: "", body: "", confirm: "" },
  nextSteps: { heading: "", links: [] as { href: string; label: string; prefix: string }[] },
};

export const buttonDoc = {
  heading: "", badge: "", subheading: "",
  sections: {
    import: { heading: "" },
    variants: { heading: "", description: "", primary: "", secondary: "", outline: "", ghost: "", glow: "" },
    sizes: { heading: "", small: "", medium: "", large: "" },
    states: { heading: "", disabled: "", loading: "", spinner: "" },
    props: { heading: "", tableHeaders: [] as string[], rows: [] as { prop: string; type: string; default: string }[] },
    frameworkExamples: { heading: "", submit: "" },
  },
};

export const formDoc = {
  heading: "", badge: "", subheading: "",
  sections: {
    import: { heading: "" },
    basicForm: { heading: "", email: "", password: "", placeholder: "", signIn: "" },
    inputProps: { heading: "", tableHeaders: [] as string[], rows: [] as { prop: string; type: string; default: string }[] },
    validation: { heading: "", submit: "" },
  },
};

export const themingDocs = {
  heading: "", subheading: "",
  sections: {
    tokens: { heading: "", description: "" },
    cssVariables: { heading: "", description: "" },
    darkMode: { heading: "", description: "" },
    customization: { heading: "", description: "" },
    programmatic: { heading: "", description: "" },
    nextSteps: { heading: "", links: [] as { href: string; label: string; prefix: string }[] },
  },
};

export const cliDocs = {
  heading: "", subheading: "",
  sections: {
    init: { heading: "", description: "", example: { heading: "", commands: [] as string[] } },
    add: { heading: "", description: "", example: { heading: "", commands: [] as string[] } },
    list: { heading: "", description: "", example: { heading: "", commands: [] as string[] } },
    config: { heading: "", description: "" },
    nextSteps: { heading: "", links: [] as { href: string; label: string; prefix: string }[] },
  },
};

export const apiReference = {
  heading: "", subheading: "",
  sections: {
    commonProps: { heading: "", description: "" },
    componentApi: { heading: "", description: "", items: [] as string[] },
    types: { heading: "", description: "" },
    themingApi: { heading: "", description: "" },
    events: { heading: "", description: "" },
    packageRef: { heading: "", tableHeaders: [] as string[], packages: [] as { pkg: string; desc: string; ver: string }[] },
  },
};

export const guides = {
  heading: "", subheading: "",
  sections: {
    migration: { heading: "", description: "", fromMui: { heading: "" }, fromShadcn: { heading: "" } },
    performance: { heading: "", description: "", items: [] as string[] },
    accessibility: {
      heading: "", description: "",
      keyboardNav: { heading: "", items: [] as string[] },
      screenReader: { heading: "", items: [] as string[] },
      colorContrast: { heading: "", description: "" },
    },
    bestPractices: { heading: "", items: [] as string[] },
  },
};

export const accessibility = {
  heading: "", subheading: "",
  sections: {
    commitment: { heading: "", items: [] as string[] },
    aria: { heading: "", description: "" },
    keyboardNav: { heading: "", tableHeaders: [] as string[], rows: [] as { comp: string; action: string; key: string }[] },
    focusManagement: { heading: "", description: "", items: [] as string[] },
    reducedMotion: { heading: "", description: "" },
    testing: { heading: "", description: "", items: [] as string[] },
  },
};

export const textFallbacks = {
  ...header, ...hero, ...frameworkSupport, ...apiPhilosophy,
  ...componentShowcase, ...crossPlatform, ...dxSection, ...cliSection,
  ...architectureSection, ...themingSection, ...ecosystemSection, ...comparisonSection,
  ...footer, ...componentsPage,
  ...sidebar, ...docsLanding, ...gettingStarted, ...componentsDocs,
  ...buttonDoc, ...formDoc, ...themingDocs, ...cliDocs, ...apiReference,
  ...guides, ...accessibility,
} as const;

export type TextsContextType = { [key: string]: unknown };
export type MergedTexts = { [key: string]: unknown };
