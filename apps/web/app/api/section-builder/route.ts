import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadRootEnv() {
  const paths = [
    resolve(process.cwd(), '../../.env'),
    resolve(process.cwd(), '../.env'),
    resolve(process.cwd(), '.env'),
  ];
  for (const p of paths) {
    if (existsSync(p)) {
      const content = readFileSync(p, 'utf-8');
      const match = content.match(/^GROQ_API_KEY=(.+)$/m);
      if (match && match[1]) return match[1].trim();
    }
  }
  return undefined;
}

let groq: Groq | null = null;

function getGroq() {
  const key = process.env.GROQ_API_KEY || loadRootEnv();
  if (!key) throw new Error('GROQ_API_KEY not configured');
  return new Groq({ apiKey: key });
}

const COMPONENTS_ALLOWED = `
Button, Card, Card.Header, Card.Body, Card.Footer, Badge, Alert, Avatar, 
Input, Select, Textarea, Checkbox, Switch, Accordion, Tabs, Tab, Dialog, 
DropdownMenu, Table, Breadcrumb, Pagination, Sidebar, Progress, Loading, 
Skeleton, Tooltip, Toast, Menubar, Heading, Text
`;

const SYSTEM_PROMPT = `You are an expert UI/UX designer who generates PERFECT React sections using the EXACT components listed below.

=== CRITICAL RULES - THESE ARE NOT OPTIONAL ===

1. **ONLY USE THESE COMPONENTS** (exact names, case-sensitive):
   ${COMPONENTS_ALLOWED}

   ✅ DO use: Card, Button, Heading, Text, Avatar, etc.
   ❌ NEVER invent components: NO Grid, NO Container, NO Flex, NO Divider, NO Carousel
   ❌ NEVER use raw HTML: NO <button>, NO <div class="card">
   ❌ NEVER use: useState, useEffect, useRef, or any React hooks
   ❌ NEVER use: router, navigation, or event handlers
   Sections are STATIC renders - no interactivity needed.

2. **USE TAILWIND FOR LAYOUT** (className on native elements like section/div):
   - Grid: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
   - Flex: className="flex flex-col md:flex-row items-center justify-between gap-6"
   - Container: className="max-w-6xl mx-auto px-4 py-20"
   Apply these to <section> and <div> elements, NOT to components.

3. **TEXT CONTENT RULES**:
   - ❌ NEVER use "lorem ipsum" or placeholder text
   - ✅ Write REALISTIC product copy:
     * Names: "Sarah Chen", "Marcus Johnson", "TechFlow Inc."
     * Roles: "VP of Engineering", "Product Manager at Stripe"
     * Quotes: "This tool saved our team 20 hours per week. Incredibly valuable."
     * Features: "Real-time analytics", "Enterprise-grade security", "99.9% uptime SLA"
   - ✅ Be specific, not generic

4. **COLOR RULES** - ONLY THESE CLASSES:
   - Section bg: bg-surface-950 or bg-surface-900
   - Card bg: bg-surface-800 or bg-surface-700 (different from section bg)
   - Headings: text-surface-100
   - Body text: text-surface-200 or text-surface-300
   - Muted text: text-surface-400
   - Buttons: bg-awesome-500 hover:bg-awesome-600
   - Highlights: text-awesome-400
   - Borders: border-border or border-surface-800

5. **SPACING & LAYOUT RULES**:
   - Generous padding: py-16, py-20, py-24 for sections
   - Gaps: gap-4, gap-6, gap-8, gap-12
   - Card padding: p-4, p-6, p-8
   - Always specify: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 (never just "md:grid-cols-3")

6. **OUTPUT FORMAT** - Return ONLY valid JSON:
{
  "code": "import { Component } from '@awesomeui/react';\\n\\nexport function Section() { return <section>...</section>; }",
  "title": "Pricing Section",
  "description": "3-tier pricing cards with CTAs",
  "componentsUsed": ["Card", "Button", "Badge"]
}

The "code" field MUST be a complete, valid React function component.

=== EXAMPLE OF A GOOD SECTION ===

\`\`\`tsx
import { Card, Button, Heading, Text, Avatar } from '@awesomeui/react';

export function TestimonialSection() {
  return (
    <section className="py-20 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4">
        <Heading size="lg" className="text-surface-100 mb-4 text-center">
          Loved by engineering teams
        </Heading>
        <Text className="text-surface-400 text-center mb-12 max-w-2xl mx-auto">
          Join 10,000+ developers who've transformed their workflow
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="bg-surface-800">
            <Card.Header className="flex items-center gap-4">
              <Avatar size="md" fallback="SC" />
              <div>
                <Heading size="sm" className="text-surface-100">Sarah Chen</Heading>
                <Text className="text-surface-400 text-sm">VP of Engineering, TechFlow</Text>
              </div>
            </Card.Header>
            <Card.Body>
              <Text className="text-surface-200">
                "This platform cut our deployment time from 2 hours to 15 minutes. 
                The developer experience is unmatched."
              </Text>
            </Card.Body>
          </Card>
          {/* ... more cards ... */}
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
\`\`\`

Notice:
- No React hooks (useState, etc.)
- No invented components (Grid, Carousel)
- Layout uses Tailwind on section/div
- Copy is realistic, not lorem ipsum
- Uses exact component names
- bg-surface-950 for section, bg-surface-800 for cards (different shades for contrast)
`;

function repairJson(raw: string): string {
  let fixed = raw;
  fixed = fixed.replace(/(?<=:\s*)`([^`]*)`(?=\s*[,}])/g, (_, s) => JSON.stringify(s));
  fixed = fixed.replace(/(?<=:\s*)`([^`]*)`(?=\s*,\s*")/g, (_, s) => JSON.stringify(s));
  fixed = fixed.replace(/,\s*([}\]])/g, '$1');
  return fixed;
}

function extractJson(text: string): Record<string, any> {
  let cleaned = text.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '').trim();
  let jsonMatch = cleaned.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    const candidates = [jsonMatch[0], repairJson(jsonMatch[0])];
    for (const candidate of candidates) {
      try { return JSON.parse(candidate); } catch { /* try next */ }
    }
  }

  const codeBlockMatch = cleaned.match(/```(?:tsx|jsx|typescript)?\s*\n?([\s\S]*?)```/);
  if (codeBlockMatch) {
    return { code: (codeBlockMatch[1] || '').trim(), title: '', description: '', componentsUsed: [] };
  }

  return {};
}

function cleanCode(code: string): string {
  let cleaned = code.trim();
  cleaned = cleaned.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();
  if (cleaned.startsWith('`') && cleaned.endsWith('`')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

const PALETTE_LABELS: Record<string, string> = {
  "slate": "Slate",
  "zinc": "Zinc",
  "stone": "Stone",
  "neutral": "Neutral",
  "blue-accent": "Blue",
  "purple-accent": "Purple",
  "emerald-accent": "Emerald",
  "amber-accent": "Amber",
  "rose-accent": "Rose",
  "cyan-accent": "Cyan",
  "teal-accent": "Teal",
  "sky-accent": "Sky",
  "indigo-accent": "Indigo",
  "pink-accent": "Pink",
};

export async function POST(req: NextRequest) {
  try {
    const { action = "generate", prompt, existingCode, palette } = await req.json();

    if (!groq) groq = getGroq();

    const paletteLabel = PALETTE_LABELS[palette] || "Slate";

    let userMsg: string;

    if (action === 'recolor') {
      if (!existingCode) return NextResponse.json({ error: 'Code to recolor is required' }, { status: 400 });
      userMsg = `Change ONLY the accent colors in this section to "${paletteLabel}".

RULES:
- Keep EXACT same structure, components, text
- Find any hardcoded accent color classes and map them:
  - bg-[color]-500 → bg-awesome-500
  - bg-[color]-600 (hover) → hover:bg-awesome-600
  - text-[color]-400 → text-awesome-400
  - border-[color]-500 → border-awesome-500
- Surface classes (bg-surface-*, text-surface-*) stay the same

CODE:
\`\`\`tsx
${existingCode}
\`\`\`

Return JSON: { "code": "...", "title": "...", "description": "...", "componentsUsed": [...] }`;
    } else if (action === 'improve' && existingCode) {
      if (!prompt?.trim()) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
      userMsg = `Improve this existing section using ONLY the allowed AwesomeUI components.

CRITICAL: 
- NO React hooks (useState, etc.)
- NO invented components (Grid, Carousel, etc.)
- Use div/section with Tailwind classes for layout
- NO lorem ipsum - write realistic product copy

EXISTING CODE:
\`\`\`tsx
${existingCode}
\`\`\`

USER REQUEST: ${prompt}

Return JSON: { "code": "...", "title": "...", "description": "...", "componentsUsed": [...] }`;
    } else {
      if (!prompt?.trim()) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
      userMsg = `Generate a production-ready React section for: "${prompt}"

CRITICAL REMINDERS BEFORE YOU BEGIN:
1. ❌ NO React hooks (useState, useEffect, useRef, etc.) - sections are STATIC
2. ❌ NO invented components - ONLY use: ${COMPONENTS_ALLOWED}
3. ❌ NO "lorem ipsum" - write realistic product names, quotes, features
4. ❌ NO raw HTML buttons/divs for UI - use AwesomeUI components
5. ✅ Use <section> and <div> with Tailwind className for layout
6. ✅ Layout: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 (NEVER omit grid-cols-1)
7. ✅ Colors: section=bg-surface-950/900, cards=bg-surface-800/700 (DIFFERENT), buttons=bg-awesome-500

Return JSON: { "code": "...", "title": "...", "description": "...", "componentsUsed": [...] }`;
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMsg },
      ],
      temperature: 0.6,
      max_tokens: 4096,
      top_p: 0.9,
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const result = extractJson(raw);
    let code = result.code ? cleanCode(result.code) : raw;

    let title = result.title || 'Generated Section';
    let description = result.description || '';
    let componentsUsed: string[] = result.componentsUsed || [];

    if ((!title || title === 'Generated Section') && !description && componentsUsed.length === 0) {
      try {
        const nested = JSON.parse(code);
        if (nested.code) {
          code = cleanCode(nested.code);
          title = nested.title || title;
          description = nested.description || '';
          componentsUsed = nested.componentsUsed || [];
        }
      } catch { /* no nested json */ }
    }

    return NextResponse.json({ code, title, description, componentsUsed });
  } catch (error) {
    console.error('Section builder error:', error);
    return NextResponse.json(
      { error: 'Failed to generate section. Please try again.' },
      { status: 500 }
    );
  }
}
