export const sectionBuilderMeta = {
  title: "Section Builder - AwesomeUI",
  description: "Build beautiful UI sections with AI. Generate new sections or improve existing code using AwesomeUI components.",
} as const;

export const sectionBuilderUI = {
  badge: "AI-Powered Section Builder",
  heading: {
    line1: "Build Sections with",
    line2: "AwesomeUI + AI",
  },
  description: "Describe the section you want, and our AI will generate production-ready code using AwesomeUI components. Share, improve, and iterate — all while using your design system.",
  modes: {
    generate: {
      label: "Generate New",
      icon: "Wand2",
      textareaLabel: "Describe the section you want to build",
      textareaPlaceholder: 'e.g., "A pricing section with 3 tier cards, a badge on the middle one (most popular), and a CTA button on each card"',
      suggestionsTitle: "Try these suggestions:",
    },
    improve: {
      label: "Improve Existing",
      icon: "RefreshCw",
      textareaLabel: "Paste your existing code or describe what to improve",
      textareaPlaceholder: "Describe what improvements you want or just say 'Improve this section'",
      codeLabel: "Current code (optional)",
      codePlaceholder: "Paste your existing React/HTML code here...",
    },
  },
  generateButton: {
    idle: "Generate Section",
    improve: "Improve Section",
    loading: "Generating...",
  },
  results: {
    copyCode: "Copy Code",
    copied: "Copied",
    recolorLabel: "Recolor:",
    componentsLabel: "Components:",
    previewTab: "Preview",
    codeTab: "Code",
    blueprintNotice: "This is a visual blueprint. Copy the code below to use it in your project.",
    howToUse: {
      title: "How to use this code",
      body: 'Install AwesomeUI (npm install @awesomeui/react), then copy this component into your project. All components are from the @awesomeui/react package.',
    },
    improve: {
      title: "Improve this section",
      placeholder: "Describe what to improve (e.g., \"make it darker\", \"add more spacing\")",
      btn: "Improve",
    },
    newSection: "Generate New Section",
  },
  errorFallback: "Something went wrong",
  resultFallback: {
    title: "Generated Section",
    description: "",
  },
  bottomCards: [
    {
      title: "Generate from scratch",
      description: "Describe your vision and get a complete section using AwesomeUI components.",
    },
    {
      title: "Improve existing code",
      description: "Paste your current markup and let AI refactor it to use AwesomeUI components.",
    },
    {
      title: "Uses 26+ components",
      description: "Every generated section leverages your design system components.",
    },
  ],
} as const;

export const suggestionPrompts = [
  {
    label: "Pricing Section",
    description: "3-tier pricing cards with badges and CTAs",
    icon: "💰",
    prompt: "A pricing section with 3 tier cards, a 'Most Popular' badge on the middle tier, and CTA buttons on each card",
  },
  {
    label: "Hero Section",
    description: "Hero with headline, subtitle, and buttons",
    icon: "🚀",
    prompt: "A hero section with a large headline, supporting subtitle, and two CTA buttons (primary and secondary)",
  },
  {
    label: "Feature Grid",
    description: "Features with icons and descriptions",
    icon: "✨",
    prompt: "A feature grid with 4 features, each with an icon, title, and short description",
  },
  {
    label: "Testimonials",
    description: "Testimonial cards with avatars",
    icon: "💬",
    prompt: "A testimonial section with 3 customer cards showing avatar, name, role, and quote",
  },
  {
    label: "Contact Form",
    description: "Form with inputs and submit button",
    icon: "📧",
    prompt: "A contact form with name input, email input, message textarea, and submit button",
  },
  {
    label: "Stats Dashboard",
    description: "Stats overview with cards and progress",
    icon: "📊",
    prompt: "A dashboard stats overview with metric cards showing numbers, labels, and progress bars",
  },
];

export const componentsReference = `Available AwesomeUI Components (import from "@awesomeui/react"):

- Button: variant=[primary,secondary,outline,ghost,destructive], size=[sm,md,lg], loading, disabled, fullWidth
- Card: variant=[default,outlined,elevated,ghost], padding=[none,sm,md,lg]. Sub-components: Card.Header, Card.Body, Card.Footer
- Badge: variant=[default]
- Alert: variant=[info,success,warning,error], dismissible, title
- Avatar: src, alt, fallback, size=[sm,md,lg], status, shape=[circle,square]
- Input: type=[text,email,password,number,tel,url], placeholder, disabled, error, label, required
- Select: placeholder, disabled, error, required, label
- Textarea: placeholder, disabled, error, label, required, rows, maxLength, resizable
- Checkbox: checked, indeterminate, disabled, error, required, label
- Switch: checked, disabled, label, labelPosition=[left,right]
- Accordion: type=[single,multiple], collapsible, variant=[default]. Contains Accordion.Item with value, title, disabled
- Tabs: defaultValue, orientation=[horizontal,vertical], variant=[underline,pills,enclosed], activationMode=[auto,manual]. Contains Tab with value, label, disabled
- Dialog: open, title, description, size=[sm,md,lg,xl,full], closable, centered
- DropdownMenu: label, items as array
- Table: columns array, rows array, sortable, striped, hoverable, compact, loading
- Breadcrumb: items array, separator=[chevron,slash,dot], size=[sm,md,lg], maxItems
- Pagination: currentPage, totalPages, size=[sm,md,lg], variant=[default,simple]
- Sidebar: collapsed, variant=[default,floating,inset], position=[left,right]
- Progress: value (0-100), variant=[bar,circle,steps], color=[primary,success,warning,error], size=[sm,md,lg], showLabel, animated
- Loading: variant=[spinner,bar,dots,pulse], size=[sm,md,lg], overlay, label
- Skeleton: variant=[text,circular,rectangular,card,table], width, height, count, animated
- Tooltip: content, side=[top,bottom,left,right], align=[start,center,end], delay
- Toast: variant=[default,success,error,warning,info], position, duration, dismissible, title
- Menubar: items array, orientation=[horizontal,vertical]

Tailwind CSS utility classes are available for layout (flex, grid, gap, padding, margin, max-w).

Example AwesomeUI section:
import { Card, Button, Badge } from "@awesomeui/react";

export function PricingSection() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <Badge />
        <h2 className="text-3xl font-bold mt-4">Simple Pricing</h2>
        <p className="text-surface-400 mt-2">Choose the plan that fits your needs</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <Card.Header>Starter</Card.Header>
          <Card.Body>
            <p className="text-2xl font-bold">$19/mo</p>
            <Button variant="primary" fullWidth>Get Started</Button>
          </Card.Body>
        </Card>
      </div>
    </section>
  );
}`;

export const aiPrompts = {
  systemPrompt: `You are a SENIOR UI/UX DESIGNER AND ENGINEER with 15+ years of experience at top-tier companies. Your specialty is crafting pixel-perfect, production-ready React sections using AwesomeUI components. You have an exceptional eye for typography, spacing, color theory, and user experience.

${componentsReference}

DESIGN PHILOSOPHY:
- Every section must tell a visual story with clear hierarchy
- Use generous whitespace (py-16, py-20, gap-6, gap-8) for breathing room
- Pair fonts thoughtfully: bold headings with lighter body text
- Use color contrast strategically to guide the user's eye
- Add subtle hover transitions for interactivity (hover:bg-*, transition-all)
- Every component should feel intentional, not stacked

COLOR SYSTEM \u2014 you MUST choose from these AwesomeUI design tokens (pick the best ones for the section's purpose):
- Surface backgrounds: bg-surface-950, bg-surface-900, bg-surface-800, bg-surface-700
- Surface text: text-surface-100 (primary), text-surface-200, text-surface-300, text-surface-400 (muted)
- Accent: bg-awesome-500 (buttons/key actions), text-awesome-400 (highlights), border-awesome-500/20, hover:bg-awesome-600
- Borders: border-border, border-surface-800, border-surface-700
- Semantic colors (use appropriately): emerald-400/500 (success), amber-400/500 (warning), red-400/500 (error), blue-400/500 (info)

RULES:
1. ALWAYS use AwesomeUI components (Button, Card, Badge, etc.) \u2014 never raw HTML elements for UI
2. Use Tailwind CSS (className) for layout and spacing
3. Return ONLY valid JSON with this exact structure:
{
  "code": "the complete TSX code string with imports and export",
  "title": "short section name",
  "description": "brief description of what this section does",
  "componentsUsed": ["Button", "Card", ...]
}

4. The code MUST import components from "@awesomeui/react"
5. Use the color tokens above for all colors \u2014 never hardcode hex values
6. Make sections visually polished with proper spacing, typography, and layout
7. Use grid and flexbox for layouts
8. INCLUDE realistic, descriptive dummy/placeholder text (never leave empty strings or lorem ipsum \u2014 write actual product-like copy)
9. Every section must have a visually distinct hero/heading area with a clear value proposition
10. Buttons must have clear, action-oriented labels ("Get Started", "Learn More", "Sign Up Free", "View Demo")`,

  buildGeneratePrompt: (userPrompt: string) => `You are a SENIOR UI/UX DESIGNER. Generate a production-ready React section based on this request:

"${userPrompt}"

Requirements:
- Use AwesomeUI components from @awesomeui/react
- Export a function component as default
- Use Tailwind CSS with AwesomeUI color tokens (surface-*, awesome-*, emerald-*, amber-*, red-*, blue-*)
- Write REALISTIC dummy text (product-like copy, not lorem ipsum)
- Make it visually polished \u2014 senior designer quality
- Return valid JSON with code, title, description, and componentsUsed fields`,

  buildImprovePrompt: (userPrompt: string, existingCode: string) => `You are a SENIOR UI/UX DESIGNER. Improve this existing React section by refactoring it to use AwesomeUI components from @awesomeui/react:

EXISTING CODE:
\`\`\`tsx
${existingCode}
\`\`\`

USER REQUEST: "${userPrompt}"

Requirements:
- Replace raw HTML elements with AwesomeUI components where applicable
- Keep the same layout and functionality
- Use Tailwind CSS with AwesomeUI color tokens (surface-*, awesome-*, emerald-*, amber-*, red-*, blue-*)
- Write REALISTIC dummy text (product-like copy, not lorem ipsum)
- Export a function component as default
- Make it visually polished \u2014 senior designer quality
- Return valid JSON with code, title, description, and componentsUsed fields`,
} as const;

export const previewFallbackNode: { type: string; props?: Record<string, any>; children?: (any)[] }[] = [
  {
    type: "div",
    children: [
      {
        type: "section",
        props: { className: "text-surface-400 text-sm" },
        children: ["Preview generated. Copy the code to see it rendered."],
      },
    ],
  },
];
