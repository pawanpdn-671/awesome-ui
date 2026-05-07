import { z } from 'zod';

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

/**
 * Semantic version string in the format `major.minor.patch`.
 *
 * @example "1.0.0", "0.3.12"
 */
declare const SemVerSchema: z.ZodString;
/** The set of types a component prop can hold. */
declare const PROP_TYPES: readonly ["string", "number", "boolean", "enum", "object", "array", "function", "slot"];
/**
 * Schema for prop type discriminant.
 *
 * @example `"string"`, `"enum"`, `"boolean"`
 */
declare const PropTypeSchema: z.ZodEnum<["string", "number", "boolean", "enum", "object", "array", "function", "slot"]>;
/**
 * Schema for a single prop definition.
 * For `enum` types, `values` must be provided.
 *
 * @example
 * ```json
 * { "type": "enum", "values": ["sm", "md", "lg"], "default": "md" }
 * ```
 */
declare const PropDefinitionSchema: z.ZodEffects<z.ZodObject<{
    /** The data type of the prop */
    type: z.ZodEnum<["string", "number", "boolean", "enum", "object", "array", "function", "slot"]>;
    /** Default value for the prop (must match the declared type) */
    default: z.ZodOptional<z.ZodUnknown>;
    /** Whether the prop is required (defaults to false) */
    required: z.ZodOptional<z.ZodBoolean>;
    /** Human-readable description of what this prop does */
    description: z.ZodOptional<z.ZodString>;
    /** Allowed values — required when type is "enum" */
    values: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
    default?: unknown;
    required?: boolean | undefined;
    description?: string | undefined;
    values?: string[] | undefined;
}, {
    type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
    default?: unknown;
    required?: boolean | undefined;
    description?: string | undefined;
    values?: string[] | undefined;
}>, {
    type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
    default?: unknown;
    required?: boolean | undefined;
    description?: string | undefined;
    values?: string[] | undefined;
}, {
    type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
    default?: unknown;
    required?: boolean | undefined;
    description?: string | undefined;
    values?: string[] | undefined;
}>;
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
declare const PropsMapSchema: z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
    /** The data type of the prop */
    type: z.ZodEnum<["string", "number", "boolean", "enum", "object", "array", "function", "slot"]>;
    /** Default value for the prop (must match the declared type) */
    default: z.ZodOptional<z.ZodUnknown>;
    /** Whether the prop is required (defaults to false) */
    required: z.ZodOptional<z.ZodBoolean>;
    /** Human-readable description of what this prop does */
    description: z.ZodOptional<z.ZodString>;
    /** Allowed values — required when type is "enum" */
    values: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
    default?: unknown;
    required?: boolean | undefined;
    description?: string | undefined;
    values?: string[] | undefined;
}, {
    type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
    default?: unknown;
    required?: boolean | undefined;
    description?: string | undefined;
    values?: string[] | undefined;
}>, {
    type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
    default?: unknown;
    required?: boolean | undefined;
    description?: string | undefined;
    values?: string[] | undefined;
}, {
    type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
    default?: unknown;
    required?: boolean | undefined;
    description?: string | undefined;
    values?: string[] | undefined;
}>>;
/**
 * A string that may contain `{{expr}}` interpolation markers.
 * These are resolved by framework transpilers to native expressions.
 *
 * @example `"{{props.variant}}"`, `"btn {{styles.base}}"`
 */
declare const ExpressionStringSchema: z.ZodString;
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
declare const TextNodeSchema: z.ZodObject<{
    /** Text content, may contain `{{expr}}` interpolation */
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>;
/** Slot node — renders a named slot for content projection */
declare const SlotNodeSchema: z.ZodObject<{
    /** Slot name (e.g., "default", "icon") */
    slot: z.ZodString;
    /** Optional fallback content if no slot content is provided */
    fallback: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    slot: string;
    fallback?: string | undefined;
}, {
    slot: string;
    fallback?: string | undefined;
}>;
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
declare const ElementNodeSchema: z.ZodType;
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
declare const ConditionalNodeSchema: z.ZodType;
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
declare const LoopNodeSchema: z.ZodType;
/**
 * Component reference node — embeds another AwesomeUI component.
 *
 * @example
 * ```json
 * { "component": "icon", "props": { "name": "{{props.iconName}}" } }
 * ```
 */
declare const ComponentRefNodeSchema: z.ZodObject<{
    /** Name of the referenced AwesomeUI component */
    component: z.ZodString;
    /** Props to pass to the referenced component */
    props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    component: string;
    props?: Record<string, string> | undefined;
}, {
    component: string;
    props?: Record<string, string> | undefined;
}>;
/**
 * Union of all template node types. Discriminated by the presence of
 * `tag`, `text`, `slot`, `if`, `each`, or `component` keys.
 *
 * This is the recursive AST that represents the component's render structure.
 */
declare const TemplateNodeSchema: z.ZodType;
/**
 * Schema for a slot definition in the component metadata.
 * Slots define content projection points.
 *
 * @example
 * ```json
 * { "description": "Button content", "props": { "active": { "type": "boolean" } } }
 * ```
 */
declare const SlotDefinitionSchema: z.ZodUnion<[z.ZodString, z.ZodObject<{
    /** Human-readable description of the slot's purpose */
    description: z.ZodOptional<z.ZodString>;
    /** Scoped slot props passed back to the parent (for scoped slots) */
    props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
        /** The data type of the prop */
        type: z.ZodEnum<["string", "number", "boolean", "enum", "object", "array", "function", "slot"]>;
        /** Default value for the prop (must match the declared type) */
        default: z.ZodOptional<z.ZodUnknown>;
        /** Whether the prop is required (defaults to false) */
        required: z.ZodOptional<z.ZodBoolean>;
        /** Human-readable description of what this prop does */
        description: z.ZodOptional<z.ZodString>;
        /** Allowed values — required when type is "enum" */
        values: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }>, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    props?: Record<string, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }> | undefined;
}, {
    description?: string | undefined;
    props?: Record<string, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }> | undefined;
}>]>;
/** Map of slot name → definition */
declare const SlotsMapSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodObject<{
    /** Human-readable description of the slot's purpose */
    description: z.ZodOptional<z.ZodString>;
    /** Scoped slot props passed back to the parent (for scoped slots) */
    props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
        /** The data type of the prop */
        type: z.ZodEnum<["string", "number", "boolean", "enum", "object", "array", "function", "slot"]>;
        /** Default value for the prop (must match the declared type) */
        default: z.ZodOptional<z.ZodUnknown>;
        /** Whether the prop is required (defaults to false) */
        required: z.ZodOptional<z.ZodBoolean>;
        /** Human-readable description of what this prop does */
        description: z.ZodOptional<z.ZodString>;
        /** Allowed values — required when type is "enum" */
        values: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }>, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    props?: Record<string, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }> | undefined;
}, {
    description?: string | undefined;
    props?: Record<string, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }> | undefined;
}>]>>;
/**
 * Schema for an event definition.
 *
 * @example
 * ```json
 * { "description": "Fired when the button is clicked", "payload": { "type": "object" } }
 * ```
 */
declare const EventDefinitionSchema: z.ZodUnion<[z.ZodString, z.ZodObject<{
    /** Human-readable description of when this event fires */
    description: z.ZodOptional<z.ZodString>;
    /** Schema describing the event payload shape */
    payload: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    payload?: unknown;
}, {
    description?: string | undefined;
    payload?: unknown;
}>]>;
/** Map of event name → definition */
declare const EventsMapSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodObject<{
    /** Human-readable description of when this event fires */
    description: z.ZodOptional<z.ZodString>;
    /** Schema describing the event payload shape */
    payload: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    payload?: unknown;
}, {
    description?: string | undefined;
    payload?: unknown;
}>]>>;
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
declare const StyleValueSchema: z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>;
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
declare const StyleMapSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>, z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>]>>;
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
declare const AccessibilitySchema: z.ZodObject<{
    /** WAI-ARIA role (e.g., "button", "dialog", "tablist") */
    role: z.ZodOptional<z.ZodString>;
    /** ARIA attribute bindings */
    ariaAttributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /** Documented keyboard interactions */
    keyboardInteractions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    role?: string | undefined;
    ariaAttributes?: Record<string, string> | undefined;
    keyboardInteractions?: string[] | undefined;
}, {
    role?: string | undefined;
    ariaAttributes?: Record<string, string> | undefined;
    keyboardInteractions?: string[] | undefined;
}>;
/**
 * Color token with light and dark mode values.
 *
 * @example
 * ```json
 * { "name": "primary", "light": "#2563eb", "dark": "#3b82f6" }
 * ```
 */
declare const ColorTokenSchema: z.ZodObject<{
    name: z.ZodString;
    light: z.ZodString;
    dark: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    light: string;
    dark: string;
}, {
    name: string;
    light: string;
    dark: string;
}>;
/**
 * Spacing scale token — maps a scale key to a CSS value.
 *
 * @example `{ "0": "0px", "1": "0.25rem", "2": "0.5rem", "4": "1rem" }`
 */
declare const SpacingTokenSchema: z.ZodRecord<z.ZodString, z.ZodString>;
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
declare const TypographyTokenSchema: z.ZodObject<{
    fontFamilies: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    fontSizes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    fontWeights: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    lineHeights: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    fontFamilies?: Record<string, string> | undefined;
    fontSizes?: Record<string, string> | undefined;
    fontWeights?: Record<string, string> | undefined;
    lineHeights?: Record<string, string> | undefined;
}, {
    fontFamilies?: Record<string, string> | undefined;
    fontSizes?: Record<string, string> | undefined;
    fontWeights?: Record<string, string> | undefined;
    lineHeights?: Record<string, string> | undefined;
}>;
/**
 * Border radius scale token.
 *
 * @example `{ "none": "0", "sm": "0.125rem", "md": "0.375rem", "full": "9999px" }`
 */
declare const RadiusTokenSchema: z.ZodRecord<z.ZodString, z.ZodString>;
/**
 * Responsive breakpoint definitions.
 *
 * @example `{ "sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px" }`
 */
declare const BreakpointTokenSchema: z.ZodRecord<z.ZodString, z.ZodString>;
/**
 * Aggregate design token system encompassing all token categories.
 */
declare const DesignTokensSchema: z.ZodObject<{
    colors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        light: z.ZodString;
        dark: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        light: string;
        dark: string;
    }, {
        name: string;
        light: string;
        dark: string;
    }>, "many">>;
    spacing: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    typography: z.ZodOptional<z.ZodObject<{
        fontFamilies: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        fontSizes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        fontWeights: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        lineHeights: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        fontFamilies?: Record<string, string> | undefined;
        fontSizes?: Record<string, string> | undefined;
        fontWeights?: Record<string, string> | undefined;
        lineHeights?: Record<string, string> | undefined;
    }, {
        fontFamilies?: Record<string, string> | undefined;
        fontSizes?: Record<string, string> | undefined;
        fontWeights?: Record<string, string> | undefined;
        lineHeights?: Record<string, string> | undefined;
    }>>;
    radius: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    breakpoints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    colors?: {
        name: string;
        light: string;
        dark: string;
    }[] | undefined;
    spacing?: Record<string, string> | undefined;
    typography?: {
        fontFamilies?: Record<string, string> | undefined;
        fontSizes?: Record<string, string> | undefined;
        fontWeights?: Record<string, string> | undefined;
        lineHeights?: Record<string, string> | undefined;
    } | undefined;
    radius?: Record<string, string> | undefined;
    breakpoints?: Record<string, string> | undefined;
}, {
    colors?: {
        name: string;
        light: string;
        dark: string;
    }[] | undefined;
    spacing?: Record<string, string> | undefined;
    typography?: {
        fontFamilies?: Record<string, string> | undefined;
        fontSizes?: Record<string, string> | undefined;
        fontWeights?: Record<string, string> | undefined;
        lineHeights?: Record<string, string> | undefined;
    } | undefined;
    radius?: Record<string, string> | undefined;
    breakpoints?: Record<string, string> | undefined;
}>;
/** Supported style adapter types */
declare const STYLE_ADAPTER_TYPES: readonly ["tailwind", "css", "css-in-js", "panda"];
/**
 * Style adapter type discriminant.
 */
declare const StyleAdapterTypeSchema: z.ZodEnum<["tailwind", "css", "css-in-js", "panda"]>;
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
declare const StyleAdapterConfigSchema: z.ZodObject<{
    /** Which style system to target */
    type: z.ZodEnum<["tailwind", "css", "css-in-js", "panda"]>;
    /** Adapter-specific configuration options */
    config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: "tailwind" | "css" | "css-in-js" | "panda";
    config?: Record<string, unknown> | undefined;
}, {
    type: "tailwind" | "css" | "css-in-js" | "panda";
    config?: Record<string, unknown> | undefined;
}>;
/**
 * A dependency on another AwesomeUI component.
 *
 * @example
 * ```json
 * { "name": "icon", "version": "^1.0.0" }
 * ```
 */
declare const ComponentDependencySchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version?: string | undefined;
}, {
    name: string;
    version?: string | undefined;
}>;
/**
 * An npm package dependency for a component.
 *
 * @example
 * ```json
 * { "name": "@radix-ui/react-dialog", "version": "^1.0.0" }
 * ```
 */
declare const NpmDependencySchema: z.ZodObject<{
    /** npm package name */
    name: z.ZodString;
    /** Semver version range */
    version: z.ZodOptional<z.ZodString>;
    /** Whether this is a devDependency */
    dev: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version?: string | undefined;
    dev?: boolean | undefined;
}, {
    name: string;
    version?: string | undefined;
    dev?: boolean | undefined;
}>;
/** Standard component categories for organization */
declare const COMPONENT_CATEGORIES: readonly ["primitive", "form", "layout", "navigation", "feedback", "data-display", "overlay", "utility"];
declare const ComponentCategorySchema: z.ZodEnum<["primitive", "form", "layout", "navigation", "feedback", "data-display", "overlay", "utility"]>;
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
declare const ComponentIRSchema: z.ZodObject<{
    /** Unique component name in kebab-case (e.g., "button", "data-table") */
    name: z.ZodString;
    /** Semantic version of this component definition */
    version: z.ZodString;
    /** Human-readable description of the component */
    description: z.ZodOptional<z.ZodString>;
    /** Component category for registry organization */
    category: z.ZodOptional<z.ZodEnum<["primitive", "form", "layout", "navigation", "feedback", "data-display", "overlay", "utility"]>>;
    /** Component prop definitions */
    props: z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
        /** The data type of the prop */
        type: z.ZodEnum<["string", "number", "boolean", "enum", "object", "array", "function", "slot"]>;
        /** Default value for the prop (must match the declared type) */
        default: z.ZodOptional<z.ZodUnknown>;
        /** Whether the prop is required (defaults to false) */
        required: z.ZodOptional<z.ZodBoolean>;
        /** Human-readable description of what this prop does */
        description: z.ZodOptional<z.ZodString>;
        /** Allowed values — required when type is "enum" */
        values: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }>, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }>>;
    /** Named slots for content projection */
    slots: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodObject<{
        /** Human-readable description of the slot's purpose */
        description: z.ZodOptional<z.ZodString>;
        /** Scoped slot props passed back to the parent (for scoped slots) */
        props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
            /** The data type of the prop */
            type: z.ZodEnum<["string", "number", "boolean", "enum", "object", "array", "function", "slot"]>;
            /** Default value for the prop (must match the declared type) */
            default: z.ZodOptional<z.ZodUnknown>;
            /** Whether the prop is required (defaults to false) */
            required: z.ZodOptional<z.ZodBoolean>;
            /** Human-readable description of what this prop does */
            description: z.ZodOptional<z.ZodString>;
            /** Allowed values — required when type is "enum" */
            values: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
            default?: unknown;
            required?: boolean | undefined;
            description?: string | undefined;
            values?: string[] | undefined;
        }, {
            type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
            default?: unknown;
            required?: boolean | undefined;
            description?: string | undefined;
            values?: string[] | undefined;
        }>, {
            type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
            default?: unknown;
            required?: boolean | undefined;
            description?: string | undefined;
            values?: string[] | undefined;
        }, {
            type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
            default?: unknown;
            required?: boolean | undefined;
            description?: string | undefined;
            values?: string[] | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        props?: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
            default?: unknown;
            required?: boolean | undefined;
            description?: string | undefined;
            values?: string[] | undefined;
        }> | undefined;
    }, {
        description?: string | undefined;
        props?: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
            default?: unknown;
            required?: boolean | undefined;
            description?: string | undefined;
            values?: string[] | undefined;
        }> | undefined;
    }>]>>>;
    /** Events emitted by the component */
    events: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodObject<{
        /** Human-readable description of when this event fires */
        description: z.ZodOptional<z.ZodString>;
        /** Schema describing the event payload shape */
        payload: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        payload?: unknown;
    }, {
        description?: string | undefined;
        payload?: unknown;
    }>]>>>;
    /** The component's template structure (render AST) */
    template: z.ZodType<any, z.ZodTypeDef, any>;
    /** Component styles (utility classes or CSS property maps) */
    styles: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>, z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>]>>;
    /** Design tokens scoped to this component */
    tokens: z.ZodOptional<z.ZodObject<{
        colors: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            light: z.ZodString;
            dark: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            light: string;
            dark: string;
        }, {
            name: string;
            light: string;
            dark: string;
        }>, "many">>;
        spacing: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        typography: z.ZodOptional<z.ZodObject<{
            fontFamilies: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            fontSizes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            fontWeights: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            lineHeights: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            fontFamilies?: Record<string, string> | undefined;
            fontSizes?: Record<string, string> | undefined;
            fontWeights?: Record<string, string> | undefined;
            lineHeights?: Record<string, string> | undefined;
        }, {
            fontFamilies?: Record<string, string> | undefined;
            fontSizes?: Record<string, string> | undefined;
            fontWeights?: Record<string, string> | undefined;
            lineHeights?: Record<string, string> | undefined;
        }>>;
        radius: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        breakpoints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        colors?: {
            name: string;
            light: string;
            dark: string;
        }[] | undefined;
        spacing?: Record<string, string> | undefined;
        typography?: {
            fontFamilies?: Record<string, string> | undefined;
            fontSizes?: Record<string, string> | undefined;
            fontWeights?: Record<string, string> | undefined;
            lineHeights?: Record<string, string> | undefined;
        } | undefined;
        radius?: Record<string, string> | undefined;
        breakpoints?: Record<string, string> | undefined;
    }, {
        colors?: {
            name: string;
            light: string;
            dark: string;
        }[] | undefined;
        spacing?: Record<string, string> | undefined;
        typography?: {
            fontFamilies?: Record<string, string> | undefined;
            fontSizes?: Record<string, string> | undefined;
            fontWeights?: Record<string, string> | undefined;
            lineHeights?: Record<string, string> | undefined;
        } | undefined;
        radius?: Record<string, string> | undefined;
        breakpoints?: Record<string, string> | undefined;
    }>>;
    /** Other AwesomeUI components this component depends on */
    dependencies: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version?: string | undefined;
    }, {
        name: string;
        version?: string | undefined;
    }>, "many">>;
    /** npm packages this component depends on (e.g., "@radix-ui/react-dialog") */
    npmDependencies: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** npm package name */
        name: z.ZodString;
        /** Semver version range */
        version: z.ZodOptional<z.ZodString>;
        /** Whether this is a devDependency */
        dev: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version?: string | undefined;
        dev?: boolean | undefined;
    }, {
        name: string;
        version?: string | undefined;
        dev?: boolean | undefined;
    }>, "many">>;
    /** Accessibility metadata */
    accessibility: z.ZodOptional<z.ZodObject<{
        /** WAI-ARIA role (e.g., "button", "dialog", "tablist") */
        role: z.ZodOptional<z.ZodString>;
        /** ARIA attribute bindings */
        ariaAttributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        /** Documented keyboard interactions */
        keyboardInteractions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        role?: string | undefined;
        ariaAttributes?: Record<string, string> | undefined;
        keyboardInteractions?: string[] | undefined;
    }, {
        role?: string | undefined;
        ariaAttributes?: Record<string, string> | undefined;
        keyboardInteractions?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    props: Record<string, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }>;
    name: string;
    version: string;
    styles: Record<string, string | Record<string, string> | Record<string, string | Record<string, string>>>;
    description?: string | undefined;
    category?: "primitive" | "form" | "layout" | "navigation" | "feedback" | "data-display" | "overlay" | "utility" | undefined;
    slots?: Record<string, string | {
        description?: string | undefined;
        props?: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
            default?: unknown;
            required?: boolean | undefined;
            description?: string | undefined;
            values?: string[] | undefined;
        }> | undefined;
    }> | undefined;
    events?: Record<string, string | {
        description?: string | undefined;
        payload?: unknown;
    }> | undefined;
    template?: any;
    tokens?: {
        colors?: {
            name: string;
            light: string;
            dark: string;
        }[] | undefined;
        spacing?: Record<string, string> | undefined;
        typography?: {
            fontFamilies?: Record<string, string> | undefined;
            fontSizes?: Record<string, string> | undefined;
            fontWeights?: Record<string, string> | undefined;
            lineHeights?: Record<string, string> | undefined;
        } | undefined;
        radius?: Record<string, string> | undefined;
        breakpoints?: Record<string, string> | undefined;
    } | undefined;
    dependencies?: {
        name: string;
        version?: string | undefined;
    }[] | undefined;
    npmDependencies?: {
        name: string;
        version?: string | undefined;
        dev?: boolean | undefined;
    }[] | undefined;
    accessibility?: {
        role?: string | undefined;
        ariaAttributes?: Record<string, string> | undefined;
        keyboardInteractions?: string[] | undefined;
    } | undefined;
}, {
    props: Record<string, {
        type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
        default?: unknown;
        required?: boolean | undefined;
        description?: string | undefined;
        values?: string[] | undefined;
    }>;
    name: string;
    version: string;
    styles: Record<string, string | Record<string, string> | Record<string, string | Record<string, string>>>;
    description?: string | undefined;
    category?: "primitive" | "form" | "layout" | "navigation" | "feedback" | "data-display" | "overlay" | "utility" | undefined;
    slots?: Record<string, string | {
        description?: string | undefined;
        props?: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "function" | "enum" | "array" | "slot";
            default?: unknown;
            required?: boolean | undefined;
            description?: string | undefined;
            values?: string[] | undefined;
        }> | undefined;
    }> | undefined;
    events?: Record<string, string | {
        description?: string | undefined;
        payload?: unknown;
    }> | undefined;
    template?: any;
    tokens?: {
        colors?: {
            name: string;
            light: string;
            dark: string;
        }[] | undefined;
        spacing?: Record<string, string> | undefined;
        typography?: {
            fontFamilies?: Record<string, string> | undefined;
            fontSizes?: Record<string, string> | undefined;
            fontWeights?: Record<string, string> | undefined;
            lineHeights?: Record<string, string> | undefined;
        } | undefined;
        radius?: Record<string, string> | undefined;
        breakpoints?: Record<string, string> | undefined;
    } | undefined;
    dependencies?: {
        name: string;
        version?: string | undefined;
    }[] | undefined;
    npmDependencies?: {
        name: string;
        version?: string | undefined;
        dev?: boolean | undefined;
    }[] | undefined;
    accessibility?: {
        role?: string | undefined;
        ariaAttributes?: Record<string, string> | undefined;
        keyboardInteractions?: string[] | undefined;
    } | undefined;
}>;

/**
 * @module types
 * @description TypeScript types inferred from Zod schemas.
 * All types are derived via `z.infer<>` to maintain a single source of truth
 * between runtime validation and compile-time types.
 *
 * @example
 * ```typescript
 * import type { IComponentIR, ITemplateNode } from '@awesomeui/core';
 *
 * function processComponent(ir: IComponentIR): void {
 *   console.log(ir.name, ir.version);
 * }
 * ```
 */

/** Semantic version string */
type SemVer = z.infer<typeof SemVerSchema>;
/** Union of valid prop type names */
type PropType = z.infer<typeof PropTypeSchema>;
/** A single prop definition with type, default, description, etc. */
type IPropDefinition = z.infer<typeof PropDefinitionSchema>;
/** Map of prop name → prop definition */
type IPropsMap = z.infer<typeof PropsMapSchema>;
/** A string that may contain `{{expr}}` interpolation markers */
type ExpressionString = z.infer<typeof ExpressionStringSchema>;
/** A text node containing static or interpolated text */
type ITextNode = z.infer<typeof TextNodeSchema>;
/** A slot reference node for content projection */
type ISlotNode = z.infer<typeof SlotNodeSchema>;
/** An HTML element node with attributes, children, class, and style bindings */
type IElementNode = z.infer<typeof ElementNodeSchema>;
/** A conditional rendering node (if/then/else) */
type IConditionalNode = z.infer<typeof ConditionalNodeSchema>;
/** A loop rendering node (each/as/key/children) */
type ILoopNode = z.infer<typeof LoopNodeSchema>;
/** A reference to another AwesomeUI component */
type IComponentRefNode = z.infer<typeof ComponentRefNodeSchema>;
/** Discriminated union of all template node types */
type ITemplateNode = z.infer<typeof TemplateNodeSchema>;
/** A slot definition — either a simple string description or a full definition */
type ISlotDefinition = z.infer<typeof SlotDefinitionSchema>;
/** Map of slot name → slot definition */
type ISlotsMap = z.infer<typeof SlotsMapSchema>;
/** An event definition — either a simple string description or a full definition */
type IEventDefinition = z.infer<typeof EventDefinitionSchema>;
/** Map of event name → event definition */
type IEventsMap = z.infer<typeof EventsMapSchema>;
/** A style value: utility class string or CSS property map */
type StyleValue = z.infer<typeof StyleValueSchema>;
/** Component style map with base and variant groups */
type IStyleMap = z.infer<typeof StyleMapSchema>;
/** Accessibility metadata (role, ARIA attributes, keyboard interactions) */
type IAccessibility = z.infer<typeof AccessibilitySchema>;
/** Color token with light/dark mode values */
type IColorToken = z.infer<typeof ColorTokenSchema>;
/** Spacing scale token map */
type ISpacingToken = z.infer<typeof SpacingTokenSchema>;
/** Typography token system */
type ITypographyToken = z.infer<typeof TypographyTokenSchema>;
/** Border radius token map */
type IRadiusToken = z.infer<typeof RadiusTokenSchema>;
/** Responsive breakpoint token map */
type IBreakpointToken = z.infer<typeof BreakpointTokenSchema>;
/** Aggregate design token system */
type IDesignTokens = z.infer<typeof DesignTokensSchema>;
/** Supported style adapter types */
type StyleAdapterType = z.infer<typeof StyleAdapterTypeSchema>;
/** Style adapter configuration */
type IStyleAdapterConfig = z.infer<typeof StyleAdapterConfigSchema>;
/** A dependency on another AwesomeUI component */
type IComponentDependency = z.infer<typeof ComponentDependencySchema>;
/** An npm package dependency for a component */
type INpmDependency = z.infer<typeof NpmDependencySchema>;
/** Component category for registry organization */
type ComponentCategory = z.infer<typeof ComponentCategorySchema>;
/** The complete Component Intermediate Representation */
type IComponentIR = z.infer<typeof ComponentIRSchema>;

/**
 * @module errors
 * @description Result type and error handling utilities for AwesomeUI.
 * Uses the Result<T, E> pattern for all fallible operations.
 *
 * @example
 * ```typescript
 * import { ok, err, isOk, isErr } from '@awesomeui/core';
 *
 * const result = ok({ name: 'button' });
 * if (isOk(result)) {
 *   console.log(result.data.name); // 'button'
 * }
 * ```
 */
/**
 * Discriminated union representing either a successful result or an error.
 * Used throughout the codebase for all fallible operations instead of exceptions.
 */
type Result<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
/**
 * A structured field-level error entry used in validation results.
 */
interface IFieldError {
    /** Dot-path to the invalid field (e.g., "props.variant.type") */
    path: string;
    /** Human-readable error message */
    message: string;
    /** The Zod error code (e.g., "invalid_type", "invalid_enum_value") */
    code: string;
}
/**
 * Custom error class for schema validation failures.
 * Contains structured per-field errors with dot-path locations.
 *
 * @example
 * ```typescript
 * const error = new ValidationError('Component IR validation failed', [
 *   { path: 'props.variant.type', message: 'Invalid enum value', code: 'invalid_enum_value' }
 * ]);
 * console.log(error.fieldErrors[0].path); // 'props.variant.type'
 * ```
 */
declare class ValidationError extends Error {
    readonly fieldErrors: ReadonlyArray<IFieldError>;
    constructor(message: string, fieldErrors: IFieldError[]);
    /**
     * Returns a formatted multi-line string of all field errors.
     *
     * @example
     * ```typescript
     * console.log(error.formatErrors());
     * // "  • props.variant.type: Invalid enum value"
     * ```
     */
    formatErrors(): string;
}
/**
 * Creates a successful Result wrapping the given data.
 *
 * @example
 * ```typescript
 * const result = ok(42);
 * // result.success === true, result.data === 42
 * ```
 */
declare function ok<T>(data: T): Result<T, never>;
/**
 * Creates a failed Result wrapping the given error.
 *
 * @example
 * ```typescript
 * const result = err(new Error('Something went wrong'));
 * // result.success === false, result.error.message === 'Something went wrong'
 * ```
 */
declare function err<E>(error: E): Result<never, E>;
/**
 * Type guard that narrows a Result to its success variant.
 *
 * @example
 * ```typescript
 * if (isOk(result)) {
 *   console.log(result.data);
 * }
 * ```
 */
declare function isOk<T, E>(result: Result<T, E>): result is {
    success: true;
    data: T;
};
/**
 * Type guard that narrows a Result to its error variant.
 *
 * @example
 * ```typescript
 * if (isErr(result)) {
 *   console.error(result.error);
 * }
 * ```
 */
declare function isErr<T, E>(result: Result<T, E>): result is {
    success: false;
    error: E;
};

/**
 * @module validators
 * @description Validation functions for AwesomeUI IR data.
 * All validators use the Result<T, E> pattern — they never throw exceptions.
 *
 * @example
 * ```typescript
 * import { validateComponentIR, isOk } from '@awesomeui/core';
 *
 * const result = validateComponentIR(jsonData);
 * if (isOk(result)) {
 *   console.log(result.data.name);
 * } else {
 *   console.error(result.error.formatErrors());
 * }
 * ```
 */

/**
 * Validates unknown input against the ComponentIR schema.
 * Returns a Result containing either the parsed IR or a ValidationError.
 *
 * @param input - Raw data to validate (typically parsed from JSON)
 * @returns A Result with the validated IComponentIR or a ValidationError
 *
 * @example
 * ```typescript
 * import { validateComponentIR, isOk } from '@awesomeui/core';
 * import buttonJson from './button.ir.json';
 *
 * const result = validateComponentIR(buttonJson);
 * if (isOk(result)) {
 *   // result.data is fully typed IComponentIR
 *   console.log(`Validated: ${result.data.name} v${result.data.version}`);
 * } else {
 *   console.error('Validation failed:');
 *   console.error(result.error.formatErrors());
 * }
 * ```
 */
declare function validateComponentIR(input: unknown): Result<IComponentIR, ValidationError>;
/**
 * Validates unknown input against the DesignTokens schema.
 *
 * @param input - Raw data to validate
 * @returns A Result with the validated IDesignTokens or a ValidationError
 *
 * @example
 * ```typescript
 * const result = validateDesignTokens({
 *   colors: [{ name: 'primary', light: '#2563eb', dark: '#3b82f6' }],
 *   spacing: { '0': '0px', '1': '0.25rem' }
 * });
 * ```
 */
declare function validateDesignTokens(input: unknown): Result<IDesignTokens, ValidationError>;
/**
 * Validates unknown input against the TemplateNode schema.
 *
 * @param input - Raw data to validate
 * @returns A Result with the validated ITemplateNode or a ValidationError
 *
 * @example
 * ```typescript
 * const result = validateTemplateNode({
 *   tag: 'div',
 *   children: [{ text: 'Hello' }]
 * });
 * ```
 */
declare function validateTemplateNode(input: unknown): Result<ITemplateNode, ValidationError>;
/**
 * Validates unknown input against the StyleAdapterConfig schema.
 *
 * @param input - Raw data to validate
 * @returns A Result with the validated IStyleAdapterConfig or a ValidationError
 *
 * @example
 * ```typescript
 * const result = validateStyleAdapterConfig({
 *   type: 'tailwind',
 *   config: { prefix: 'aui-' }
 * });
 * ```
 */
declare function validateStyleAdapterConfig(input: unknown): Result<IStyleAdapterConfig, ValidationError>;

export { AccessibilitySchema, BreakpointTokenSchema, COMPONENT_CATEGORIES, ColorTokenSchema, type ComponentCategory, ComponentCategorySchema, ComponentDependencySchema, ComponentIRSchema, ComponentRefNodeSchema, ConditionalNodeSchema, DesignTokensSchema, ElementNodeSchema, EventDefinitionSchema, EventsMapSchema, type ExpressionString, ExpressionStringSchema, type IAccessibility, type IBreakpointToken, type IColorToken, type IComponentDependency, type IComponentIR, type IComponentRefNode, type IConditionalNode, type IDesignTokens, type IElementNode, type IEventDefinition, type IEventsMap, type IFieldError, type ILoopNode, type INpmDependency, type IPropDefinition, type IPropsMap, type IRadiusToken, type ISlotDefinition, type ISlotNode, type ISlotsMap, type ISpacingToken, type IStyleAdapterConfig, type IStyleMap, type ITemplateNode, type ITextNode, type ITypographyToken, LoopNodeSchema, NpmDependencySchema, PROP_TYPES, PropDefinitionSchema, type PropType, PropTypeSchema, PropsMapSchema, RadiusTokenSchema, type Result, STYLE_ADAPTER_TYPES, type SemVer, SemVerSchema, SlotDefinitionSchema, SlotNodeSchema, SlotsMapSchema, SpacingTokenSchema, StyleAdapterConfigSchema, type StyleAdapterType, StyleAdapterTypeSchema, StyleMapSchema, type StyleValue, StyleValueSchema, TemplateNodeSchema, TextNodeSchema, TypographyTokenSchema, ValidationError, err, isErr, isOk, ok, validateComponentIR, validateDesignTokens, validateStyleAdapterConfig, validateTemplateNode };
