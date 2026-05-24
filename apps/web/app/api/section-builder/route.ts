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
   - Section bg: bg-surface-950
   - Card bg: bg-surface-900 (use rounded-xl plus border border-surface-200 shadow-sm for definition)
   - Headings: text-surface-100
   - Body text: text-surface-300
   - Muted text: text-surface-400
   - Buttons: always set variant="primary" and bg-awesome-500 hover:bg-awesome-600
   - Highlights: text-awesome-400
   - Borders: border-surface-200 on cards, border-border on other elements

5. **SPACING & LAYOUT RULES**:
   - section: py-20 or py-24
   - Container div inside section: max-w-6xl mx-auto px-4
   - Grid: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-8"
   - Card padding: p-6 or p-8
   - Space between heading and grid: mb-12 or mb-16 on heading
   - Always use grid-cols-1 (never just "md:grid-cols-3")

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-surface-900 rounded-xl border border-surface-200 shadow-sm">
            <Card.Header className="flex items-center gap-4">
              <Avatar size="md" fallback="SC" />
              <div>
                <Heading size="sm" className="text-surface-100">Sarah Chen</Heading>
                <Text className="text-surface-400 text-sm">VP of Engineering, TechFlow</Text>
              </div>
            </Card.Header>
            <Card.Body>
              <Text className="text-surface-300">
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
- bg-surface-950 for section, bg-surface-900 with border border-surface-200 shadow-sm for cards
`;

function repairJson(raw: string): string {
  let fixed = raw;
  fixed = fixed.replace(/(?<=:\s*)`([^`]*)`(?=\s*[,}])/g, (_, s) => JSON.stringify(s));
  fixed = fixed.replace(/(?<=:\s*)`([^`]*)`(?=\s*,\s*")/g, (_, s) => JSON.stringify(s));
  fixed = fixed.replace(/,\s*([}\]])/g, '$1');
  return fixed;
}

function extractJson(text: string): Record<string, any> {
  const trimmed = text.trim();

  // Strategy 1: find ```json ... ``` block explicitly (non-greedy, prevents
  // the regex from spilling into a subsequent ```tsx block).
  const jsonBlock = trimmed.match(/```json\s*\n?([\s\S]*?)```/);
  if (jsonBlock && jsonBlock[1]) {
    try {
      const parsed = JSON.parse(jsonBlock[1].trim());
      if (parsed.code || parsed.title) {
        // Prefer the fuller code from a ```tsx block if one exists
        const tsxBlock = trimmed.match(/```(?:tsx|jsx)\s*\n?([\s\S]*?)```/);
        if (tsxBlock && tsxBlock[1] && tsxBlock[1].trim().length > (parsed.code || '').length) {
          parsed.code = tsxBlock[1].trim();
        }
        return parsed;
      }
    } catch { /* fall through */ }
  }

  // Strategy 2: find ```tsx|jsx … ``` block, then look for JSON metadata before it.
  const codeBlock = trimmed.match(/```(?:tsx|jsx|typescript)?\s*\n?([\s\S]*?)```/);
  if (codeBlock && codeBlock[1]) {
    const beforeCode = trimmed.slice(0, codeBlock.index).trim();
    if (beforeCode) {
      const jsonLike = beforeCode.match(/\{[\s\S]*\}/);
      if (jsonLike) {
        try {
          const parsed = JSON.parse(jsonLike[0]);
          if (parsed.code || parsed.title) {
            parsed.code = codeBlock[1].trim();
            return parsed;
          }
        } catch { /* fall through */ }
      }
    }
    return { code: codeBlock[1].trim(), title: '', description: '', componentsUsed: [] };
  }

  // Strategy 3: greedy {…} match (original approach, works for raw JSON).
  let cleaned = trimmed.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '').trim();
  let jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const candidates = [jsonMatch[0], repairJson(jsonMatch[0])];
    for (const candidate of candidates) {
      try { return JSON.parse(candidate); } catch { /* try next */ }
    }
  }

  // Strategy 4: try parsing the whole cleaned text as JSON (for unmarked responses).
  try {
    const parsed = JSON.parse(cleaned);
    if (typeof parsed === 'object') return parsed;
  } catch { /* not JSON */ }

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

    // Rough token estimate (~4 chars per token) to avoid overflowing the model's 8K context.
    // System prompt is ~600 tokens, response budget is 2048, leaving ~5300 for user message.
    const MAX_INPUT_CHARS = 18000;

    if (action === 'recolor') {
      if (!existingCode) return NextResponse.json({ error: 'Code to recolor is required' }, { status: 400 });
      const truncated = existingCode.length > MAX_INPUT_CHARS ? existingCode.slice(0, MAX_INPUT_CHARS) + '\n// ... truncated' : existingCode;
      userMsg = `Change ONLY the accent colors to "${paletteLabel}". Keep structure and text identical.

Map hardcoded accent colors:
- bg-[color]-500 → bg-awesome-500
- hover:bg-[color]-600 → hover:bg-awesome-600
- text-[color]-400 → text-awesome-400
- border-[color]-500 → border-awesome-500

CODE:
\`\`\`tsx
${truncated}
\`\`\`

Return JSON: { "code": "...", "title": "...", "description": "...", "componentsUsed": [...] }`;
    } else if (action === 'improve') {
      if (!existingCode) return NextResponse.json({ error: 'Code to improve is required' }, { status: 400 });
      if (!prompt?.trim()) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
      const truncated = existingCode.length > MAX_INPUT_CHARS ? existingCode.slice(0, MAX_INPUT_CHARS) + '\n// ... truncated' : existingCode;
      userMsg = `Improve this section using ONLY the allowed AwesomeUI components.

NO React hooks, NO invented components, NO lorem ipsum.

EXISTING CODE:
\`\`\`tsx
${truncated}
\`\`\`

USER REQUEST: ${prompt.slice(0, 1000)}

Return JSON: { "code": "...", "title": "...", "description": "...", "componentsUsed": [...] }`;
    } else {
      if (!prompt?.trim()) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
      userMsg = `Generate a production-ready React section for: "${prompt.slice(0, 2000)}"

CRITICAL:
- NO React hooks - sections are STATIC
- ONLY use: ${COMPONENTS_ALLOWED}
- NO lorem ipsum - write realistic product copy
- Use section/div with Tailwind for layout
- grid-cols-1 md:grid-cols-2 lg:grid-cols-3 (NEVER omit grid-cols-1)
- section=bg-surface-950, cards=bg-surface-900 with border border-surface-200 shadow-sm rounded-xl, buttons=variant="primary" with className="bg-awesome-500 hover:bg-awesome-600"

Return JSON: { "code": "...", "title": "...", "description": "...", "componentsUsed": [...] }`;
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMsg },
      ],
      temperature: 0.6,
      max_tokens: 2048,
      top_p: 0.9,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'AI returned an empty response. Please try again.' }, { status: 502 });
    }

    const result = extractJson(content);
    let code = result.code ? cleanCode(result.code) : content;
    let title = result.title || 'Generated Section';
    let description = result.description || '';
    let componentsUsed: string[] = result.componentsUsed || [];

    // Fallback: try parsing the raw content as JSON if extraction didn't yield a real section
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

    // Validate we have actual code before returning
    if (!code || code === '{}' || code.length < 20) {
      return NextResponse.json({ error: 'AI returned incomplete data. Please try again.' }, { status: 422 });
    }

    return NextResponse.json({ code, title, description, componentsUsed });
  } catch (error: any) {
    // Provide specific error messages for common Groq API failures
    const errMsg = error?.message || '';
    let userMsg: string;
    if (errMsg.includes('rate_limit') || errMsg.includes('Rate limit')) {
      userMsg = 'Rate limit reached. Please wait a moment and try again.';
    } else if (errMsg.includes('context_length') || errMsg.includes('too large') || errMsg.includes('too many tokens')) {
      userMsg = 'The section is too large to process. Try a smaller section or generate a new one.';
    } else if (errMsg.includes('API key') || errMsg.includes('authentication') || errMsg.includes('unauthorized')) {
      userMsg = 'API configuration error. Please contact support.';
    } else if (errMsg.includes('timeout') || errMsg.includes('timed out')) {
      userMsg = 'Request timed out. Please try again.';
    } else {
      userMsg = 'Failed to generate section. Please try again.';
    }
    console.error('Section builder error:', errMsg);
    return NextResponse.json({ error: userMsg }, { status: 500 });
  }
}
