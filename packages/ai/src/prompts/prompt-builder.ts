/**
 * @module prompt-builder
 * @description Builds full AI prompts by combining templates with user input.
 * Sanitizes user input before injection into the prompt template.
 *
 * @example
 * ```typescript
 * import { buildGenerationPrompt } from './prompts/prompt-builder.js';
 *
 * const prompt = buildGenerationPrompt('Create a dropdown select component', {
 *   category: 'form',
 * });
 * ```
 */

import { sanitizeInput } from '../sanitizer.js';

/** Options for customizing the generation prompt */
export interface IPromptOptions {
  /** Preferred component category */
  category?: string;
  /** Additional constraints or requirements */
  constraints?: string;
  /** Number of variants to generate */
  variantCount?: number;
}

/** The prompt template (inlined to avoid file I/O at runtime) */
const PROMPT_TEMPLATE = `You are an expert UI component designer. Generate a component definition in AwesomeUI IR (Intermediate Representation) JSON format.

## Rules

1. Output ONLY valid JSON — no markdown, no explanation, no code fences.
2. The JSON must validate against the AwesomeUI ComponentIR schema.
3. Component name must be kebab-case.
4. Version should be "1.0.0".
5. Include meaningful props with types, defaults, and descriptions.
6. Use Tailwind CSS utility classes for all styles.
7. Include accessibility metadata (role, aria attributes, keyboard interactions).
8. Include at least a "default" slot for content projection.
9. Props with type "enum" MUST include a "values" array.

## Schema Reference

{
  "name": string (kebab-case),
  "version": "1.0.0",
  "description": string,
  "category": "primitive" | "form" | "layout" | "navigation" | "feedback" | "data-display" | "overlay" | "utility",
  "props": { [name]: { "type": "string"|"number"|"boolean"|"enum"|"object"|"array", "default"?: any, "required"?: boolean, "description": string, "values"?: string[] } },
  "slots": { [name]: { "description": string } },
  "events": { [name]: { "description": string } },
  "template": TemplateNode,
  "styles": { "base": string, [variantGroup]: { [value]: string } },
  "accessibility": { "role": string, "ariaAttributes": { [attr]: "{{expression}}" }, "keyboardInteractions": string[] }
}

TemplateNode types:
- Element: { "tag": string, "class"?: "{{expr}}", "attributes"?: {}, "children"?: TemplateNode[] }
- Text: { "text": "{{expr}}" }
- Slot: { "slot": string, "fallback"?: string }
- Conditional: { "if": string, "then": TemplateNode, "else"?: TemplateNode }
- Loop: { "each": string, "as": string, "key"?: string, "children": TemplateNode[] }

Expression syntax: {{props.name}}, {{styles.base}}, {{styles.variant[props.variant]}}

## User Request

Generate the following component:

{{USER_PROMPT}}`;

/**
 * Builds a full generation prompt from the template and user input.
 * User input is sanitized to prevent prompt injection.
 *
 * @param userPrompt - The user's component description
 * @param options - Optional generation customizations
 * @returns The complete prompt string
 *
 * @example
 * ```typescript
 * const prompt = buildGenerationPrompt('A modal dialog with title, body, and footer slots');
 * // Returns full prompt with schema reference + sanitized user input
 * ```
 */
export function buildGenerationPrompt(userPrompt: string, options?: IPromptOptions): string {
  const sanitized = sanitizeInput(userPrompt);

  let enrichedPrompt = sanitized;

  if (options?.category) {
    enrichedPrompt += `\n\nPreferred category: ${sanitizeInput(options.category)}`;
  }

  if (options?.constraints) {
    enrichedPrompt += `\n\nAdditional requirements: ${sanitizeInput(options.constraints)}`;
  }

  if (options?.variantCount) {
    enrichedPrompt += `\n\nInclude at least ${options.variantCount} visual variants.`;
  }

  return PROMPT_TEMPLATE.replace('{{USER_PROMPT}}', enrichedPrompt);
}
