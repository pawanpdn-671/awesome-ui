/**
 * @module schema
 * @description Zod schemas for the AwesomeUI Intermediate Representation (IR).
 * These schemas define the framework-agnostic component format that transpilers
 * convert to React, Vue, Svelte, Angular, and Solid code.
 *
 * @example
 * ```typescript
 * import { ComponentIRSchema } from '@awesomeui/core';
 *
 * const result = ComponentIRSchema.safeParse(jsonData);
 * if (result.success) {
 *   console.log(result.data.name); // e.g., 'button'
 * }
 * ```
 */

import { z } from 'zod';

// ─── Semantic Version ──────────────────────────────────────────────────────────

/**
 * Semantic version string in the format `major.minor.patch`.
 *
 * @example "1.0.0", "0.3.12"
 */
export const SemVerSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/, 'Must be a valid semver string (e.g., "1.0.0")');

// ─── Prop Definitions ──────────────────────────────────────────────────────────

/** The set of types a component prop can hold. */
export const PROP_TYPES = [
  'string',
  'number',
  'boolean',
  'enum',
  'object',
  'array',
  'function',
  'slot',
] as const;

/**
 * Schema for prop type discriminant.
 *
 * @example `"string"`, `"enum"`, `"boolean"`
 */
export const PropTypeSchema = z.enum(PROP_TYPES);

/**
 * Schema for a single prop definition.
 * For `enum` types, `values` must be provided.
 *
 * @example
 * ```json
 * { "type": "enum", "values": ["sm", "md", "lg"], "default": "md" }
 * ```
 */
export const PropDefinitionSchema = z
  .object({
    /** The data type of the prop */
    type: PropTypeSchema,
    /** Default value for the prop (must match the declared type) */
    default: z.unknown().optional(),
    /** Whether the prop is required (defaults to false) */
    required: z.boolean().optional(),
    /** Human-readable description of what this prop does */
    description: z.string().optional(),
    /** Allowed values — required when type is "enum" */
    values: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'enum') {
        return data.values !== undefined && data.values.length > 0;
      }
      return true;
    },
    { message: 'Enum props must have a non-empty "values" array', path: ['values'] }
  );

/**
 * Map of prop name → definition.
 *
 * @example
 * ```json
 * {
 *   "variant": { "type": "enum", "values": ["primary", "secondary"], "default": "primary" },
 *   "disabled": { "type": "boolean", "default": false }
 * }
 * ```
 */
export const PropsMapSchema = z.record(z.string(), PropDefinitionSchema);

// ─── Expression Bindings ────────────────────────────────────────────────────────

/**
 * A string that may contain `{{expr}}` interpolation markers.
 * These are resolved by framework transpilers to native expressions.
 *
 * @example `"{{props.variant}}"`, `"btn {{styles.base}}"`
 */
export const ExpressionStringSchema = z.string();

// ─── Template Nodes (Recursive AST) ────────────────────────────────────────────

/**
 * Base type for template node schemas. The template IR is a recursive
 * discriminated union covering all rendering constructs:
 *
 * - **Element**: an HTML/component tag with attributes and children
 * - **Text**: static or interpolated text content
 * - **Slot**: a named slot reference (maps to framework slot mechanisms)
 * - **Conditional**: if/then/else branching
 * - **Loop**: iterating over a collection
 * - **ComponentRef**: embedding a nested AwesomeUI component
 */

/** Text node — renders static or interpolated text */
export const TextNodeSchema = z.object({
  /** Text content, may contain `{{expr}}` interpolation */
  text: z.string(),
});

/** Slot node — renders a named slot for content projection */
export const SlotNodeSchema = z.object({
  /** Slot name (e.g., "default", "icon") */
  slot: z.string(),
  /** Optional fallback content if no slot content is provided */
  fallback: z.string().optional(),
});

/**
 * Element node — an HTML element with attributes and children.
 * Uses `z.lazy` for recursive children.
 *
 * @example
 * ```json
 * {
 *   "tag": "button",
 *   "attributes": { "disabled": "{{props.disabled}}" },
 *   "children": [{ "slot": "default" }]
 * }
 * ```
 */
export const ElementNodeSchema: z.ZodType = z.lazy(() =>
  z.object({
    /** HTML tag name (e.g., "div", "button", "span") */
    tag: z.string(),
    /** Static or dynamic attribute bindings */
    attributes: z.record(z.string(), ExpressionStringSchema).optional(),
    /** CSS class bindings (expression string) */
    class: ExpressionStringSchema.optional(),
    /** Inline style bindings */
    style: z.record(z.string(), ExpressionStringSchema).optional(),
    /** Child template nodes */
    children: z.array(TemplateNodeSchema).optional(),
  })
);

/**
 * Conditional node — renders content based on a boolean expression.
 * Maps to: React ternary, Vue `v-if`, Svelte `{#if}`, Angular `*ngIf`, Solid `<Show>`.
 *
 * @example
 * ```json
 * {
 *   "if": "props.loading",
 *   "then": { "tag": "span", "class": "spinner" },
 *   "else": { "slot": "default" }
 * }
 * ```
 */
export const ConditionalNodeSchema: z.ZodType = z.lazy(() =>
  z.object({
    /** Boolean expression to evaluate */
    if: z.string(),
    /** Node to render when the condition is truthy */
    then: TemplateNodeSchema,
    /** Optional node to render when the condition is falsy */
    else: TemplateNodeSchema.optional(),
  })
);

/**
 * Loop node — iterates over a collection expression.
 * Maps to: React `.map()`, Vue `v-for`, Svelte `{#each}`, Angular `*ngFor`, Solid `<For>`.
 *
 * @example
 * ```json
 * {
 *   "each": "props.items",
 *   "as": "item",
 *   "key": "item.id",
 *   "children": [{ "tag": "li", "children": [{ "text": "{{item.label}}" }] }]
 * }
 * ```
 */
export const LoopNodeSchema: z.ZodType = z.lazy(() =>
  z.object({
    /** Expression that evaluates to an iterable collection */
    each: z.string(),
    /** Variable name for each iteration item */
    as: z.string(),
    /** Optional key expression for efficient list rendering */
    key: z.string().optional(),
    /** Child nodes rendered for each item */
    children: z.array(TemplateNodeSchema),
  })
);

/**
 * Component reference node — embeds another AwesomeUI component.
 *
 * @example
 * ```json
 * { "component": "icon", "props": { "name": "{{props.iconName}}" } }
 * ```
 */
export const ComponentRefNodeSchema = z.object({
  /** Name of the referenced AwesomeUI component */
  component: z.string(),
  /** Props to pass to the referenced component */
  props: z.record(z.string(), ExpressionStringSchema).optional(),
});

/**
 * Union of all template node types. Discriminated by the presence of
 * `tag`, `text`, `slot`, `if`, `each`, or `component` keys.
 *
 * This is the recursive AST that represents the component's render structure.
 */
export const TemplateNodeSchema: z.ZodType = z.lazy(() =>
  z.union([
    ElementNodeSchema,
    TextNodeSchema,
    SlotNodeSchema,
    ConditionalNodeSchema,
    LoopNodeSchema,
    ComponentRefNodeSchema,
  ])
);

// ─── Slot Definitions ───────────────────────────────────────────────────────────

/**
 * Schema for a slot definition in the component metadata.
 * Slots define content projection points.
 *
 * @example
 * ```json
 * { "description": "Button content", "props": { "active": { "type": "boolean" } } }
 * ```
 */
export const SlotDefinitionSchema = z.union([
  z.string(),
  z.object({
    /** Human-readable description of the slot's purpose */
    description: z.string().optional(),
    /** Scoped slot props passed back to the parent (for scoped slots) */
    props: z.record(z.string(), PropDefinitionSchema).optional(),
  }),
]);

/** Map of slot name → definition */
export const SlotsMapSchema = z.record(z.string(), SlotDefinitionSchema);

// ─── Event Definitions ──────────────────────────────────────────────────────────

/**
 * Schema for an event definition.
 *
 * @example
 * ```json
 * { "description": "Fired when the button is clicked", "payload": { "type": "object" } }
 * ```
 */
export const EventDefinitionSchema = z.union([
  z.string(),
  z.object({
    /** Human-readable description of when this event fires */
    description: z.string().optional(),
    /** Schema describing the event payload shape */
    payload: z.unknown().optional(),
  }),
]);

/** Map of event name → definition */
export const EventsMapSchema = z.record(z.string(), EventDefinitionSchema);

// ─── Style Definitions ──────────────────────────────────────────────────────────

/**
 * A style value can be either a utility-class string or a CSS property map.
 *
 * @example
 * ```
 * // Utility classes
 * "bg-blue-600 text-white hover:bg-blue-700"
 *
 * // CSS properties
 * { "background-color": "#2563eb", "color": "#ffffff" }
 * ```
 */
export const StyleValueSchema = z.union([
  z.string(),
  z.record(z.string(), z.string()),
]);

/**
 * Component styles with a base style and variant maps.
 *
 * @example
 * ```json
 * {
 *   "base": "inline-flex items-center",
 *   "variant": {
 *     "primary": "bg-blue-600 text-white",
 *     "secondary": "bg-gray-100 text-gray-900"
 *   },
 *   "size": {
 *     "sm": "h-8 px-3 text-sm",
 *     "md": "h-10 px-4 text-base"
 *   }
 * }
 * ```
 */
export const StyleMapSchema = z
  .record(z.string(), z.union([StyleValueSchema, z.record(z.string(), StyleValueSchema)]))
  .describe('Component styles with base and variant maps');

// ─── Accessibility ──────────────────────────────────────────────────────────────

/**
 * Accessibility metadata for a component.
 *
 * @example
 * ```json
 * {
 *   "role": "button",
 *   "ariaAttributes": { "aria-disabled": "{{props.disabled}}" },
 *   "keyboardInteractions": ["Enter to activate", "Space to activate"]
 * }
 * ```
 */
export const AccessibilitySchema = z.object({
  /** WAI-ARIA role (e.g., "button", "dialog", "tablist") */
  role: z.string().optional(),
  /** ARIA attribute bindings */
  ariaAttributes: z.record(z.string(), ExpressionStringSchema).optional(),
  /** Documented keyboard interactions */
  keyboardInteractions: z.array(z.string()).optional(),
});

// ─── Design Tokens ──────────────────────────────────────────────────────────────

/**
 * Color token with light and dark mode values.
 *
 * @example
 * ```json
 * { "name": "primary", "light": "#2563eb", "dark": "#3b82f6" }
 * ```
 */
export const ColorTokenSchema = z.object({
  name: z.string(),
  light: z.string(),
  dark: z.string(),
});

/**
 * Spacing scale token — maps a scale key to a CSS value.
 *
 * @example `{ "0": "0px", "1": "0.25rem", "2": "0.5rem", "4": "1rem" }`
 */
export const SpacingTokenSchema = z.record(z.string(), z.string());

/**
 * Typography token system — font families, sizes, weights, and line heights.
 *
 * @example
 * ```json
 * {
 *   "fontFamilies": { "sans": "Inter, sans-serif", "mono": "Fira Code, monospace" },
 *   "fontSizes": { "sm": "0.875rem", "base": "1rem", "lg": "1.125rem" },
 *   "fontWeights": { "normal": "400", "medium": "500", "bold": "700" },
 *   "lineHeights": { "tight": "1.25", "normal": "1.5", "relaxed": "1.75" }
 * }
 * ```
 */
export const TypographyTokenSchema = z.object({
  fontFamilies: z.record(z.string(), z.string()).optional(),
  fontSizes: z.record(z.string(), z.string()).optional(),
  fontWeights: z.record(z.string(), z.string()).optional(),
  lineHeights: z.record(z.string(), z.string()).optional(),
});

/**
 * Border radius scale token.
 *
 * @example `{ "none": "0", "sm": "0.125rem", "md": "0.375rem", "full": "9999px" }`
 */
export const RadiusTokenSchema = z.record(z.string(), z.string());

/**
 * Responsive breakpoint definitions.
 *
 * @example `{ "sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px" }`
 */
export const BreakpointTokenSchema = z.record(z.string(), z.string());

/**
 * Aggregate design token system encompassing all token categories.
 */
export const DesignTokensSchema = z.object({
  colors: z.array(ColorTokenSchema).optional(),
  spacing: SpacingTokenSchema.optional(),
  typography: TypographyTokenSchema.optional(),
  radius: RadiusTokenSchema.optional(),
  breakpoints: BreakpointTokenSchema.optional(),
});

// ─── Style Adapters ─────────────────────────────────────────────────────────────

/** Supported style adapter types */
export const STYLE_ADAPTER_TYPES = ['tailwind', 'css', 'css-in-js', 'panda'] as const;

/**
 * Style adapter type discriminant.
 */
export const StyleAdapterTypeSchema = z.enum(STYLE_ADAPTER_TYPES);

/**
 * Configuration for a style adapter, used by transpilers to determine
 * how component styles should be rendered.
 *
 * @example
 * ```json
 * {
 *   "type": "tailwind",
 *   "config": { "prefix": "aui-" }
 * }
 * ```
 */
export const StyleAdapterConfigSchema = z.object({
  /** Which style system to target */
  type: StyleAdapterTypeSchema,
  /** Adapter-specific configuration options */
  config: z.record(z.string(), z.unknown()).optional(),
});

// ─── Component Dependencies ─────────────────────────────────────────────────────

/**
 * A dependency on another AwesomeUI component.
 *
 * @example
 * ```json
 * { "name": "icon", "version": "^1.0.0" }
 * ```
 */
export const ComponentDependencySchema = z.object({
  name: z.string(),
  version: SemVerSchema.optional(),
});

// ─── Component Categories ───────────────────────────────────────────────────────

/** Standard component categories for organization */
export const COMPONENT_CATEGORIES = [
  'primitive',
  'form',
  'layout',
  'navigation',
  'feedback',
  'data-display',
  'overlay',
  'utility',
] as const;

export const ComponentCategorySchema = z.enum(COMPONENT_CATEGORIES);

// ─── Component IR (Top-Level Schema) ────────────────────────────────────────────

/**
 * The top-level Component Intermediate Representation schema.
 * This is the primary schema that defines a complete, framework-agnostic
 * component definition. All component `.ir.json` files must validate against this.
 *
 * @example
 * ```typescript
 * import { ComponentIRSchema } from '@awesomeui/core';
 * import buttonIR from './components/button.ir.json';
 *
 * const parsed = ComponentIRSchema.safeParse(buttonIR);
 * if (parsed.success) {
 *   // parsed.data is a fully typed IComponentIR
 *   console.log(parsed.data.name); // "button"
 * }
 * ```
 */
export const ComponentIRSchema = z.object({
  /** Unique component name in kebab-case (e.g., "button", "data-table") */
  name: z
    .string()
    .regex(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, 'Component name must be kebab-case'),

  /** Semantic version of this component definition */
  version: SemVerSchema,

  /** Human-readable description of the component */
  description: z.string().optional(),

  /** Component category for registry organization */
  category: ComponentCategorySchema.optional(),

  /** Component prop definitions */
  props: PropsMapSchema,

  /** Named slots for content projection */
  slots: SlotsMapSchema.optional(),

  /** Events emitted by the component */
  events: EventsMapSchema.optional(),

  /** The component's template structure (render AST) */
  template: TemplateNodeSchema,

  /** Component styles (utility classes or CSS property maps) */
  styles: StyleMapSchema,

  /** Design tokens scoped to this component */
  tokens: DesignTokensSchema.optional(),

  /** Other AwesomeUI components this component depends on */
  dependencies: z.array(ComponentDependencySchema).optional(),

  /** Accessibility metadata */
  accessibility: AccessibilitySchema.optional(),
});
