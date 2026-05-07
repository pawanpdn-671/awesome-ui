import { z } from 'zod';

// src/schema.ts
var SemVerSchema = z.string().regex(/^\d+\.\d+\.\d+$/, 'Must be a valid semver string (e.g., "1.0.0")');
var PROP_TYPES = [
  "string",
  "number",
  "boolean",
  "enum",
  "object",
  "array",
  "function",
  "slot"
];
var PropTypeSchema = z.enum(PROP_TYPES);
var PropDefinitionSchema = z.object({
  /** The data type of the prop */
  type: PropTypeSchema,
  /** Default value for the prop (must match the declared type) */
  default: z.unknown().optional(),
  /** Whether the prop is required (defaults to false) */
  required: z.boolean().optional(),
  /** Human-readable description of what this prop does */
  description: z.string().optional(),
  /** Allowed values — required when type is "enum" */
  values: z.array(z.string()).optional()
}).refine(
  (data) => {
    if (data.type === "enum") {
      return data.values !== void 0 && data.values.length > 0;
    }
    return true;
  },
  { message: 'Enum props must have a non-empty "values" array', path: ["values"] }
);
var PropsMapSchema = z.record(z.string(), PropDefinitionSchema);
var ExpressionStringSchema = z.string();
var TextNodeSchema = z.object({
  /** Text content, may contain `{{expr}}` interpolation */
  text: z.string()
});
var SlotNodeSchema = z.object({
  /** Slot name (e.g., "default", "icon") */
  slot: z.string(),
  /** Optional fallback content if no slot content is provided */
  fallback: z.string().optional()
});
var ElementNodeSchema = z.lazy(
  () => z.object({
    /** HTML tag name (e.g., "div", "button", "span") */
    tag: z.string(),
    /** Static or dynamic attribute bindings */
    attributes: z.record(z.string(), ExpressionStringSchema).optional(),
    /** CSS class bindings (expression string) */
    class: ExpressionStringSchema.optional(),
    /** Inline style bindings */
    style: z.record(z.string(), ExpressionStringSchema).optional(),
    /** Child template nodes */
    children: z.array(TemplateNodeSchema).optional()
  })
);
var ConditionalNodeSchema = z.lazy(
  () => z.object({
    /** Boolean expression to evaluate */
    if: z.string(),
    /** Node to render when the condition is truthy */
    then: TemplateNodeSchema,
    /** Optional node to render when the condition is falsy */
    else: TemplateNodeSchema.optional()
  })
);
var LoopNodeSchema = z.lazy(
  () => z.object({
    /** Expression that evaluates to an iterable collection */
    each: z.string(),
    /** Variable name for each iteration item */
    as: z.string(),
    /** Optional key expression for efficient list rendering */
    key: z.string().optional(),
    /** Child nodes rendered for each item */
    children: z.array(TemplateNodeSchema)
  })
);
var ComponentRefNodeSchema = z.object({
  /** Name of the referenced AwesomeUI component */
  component: z.string(),
  /** Props to pass to the referenced component */
  props: z.record(z.string(), ExpressionStringSchema).optional()
});
var TemplateNodeSchema = z.lazy(
  () => z.union([
    ElementNodeSchema,
    TextNodeSchema,
    SlotNodeSchema,
    ConditionalNodeSchema,
    LoopNodeSchema,
    ComponentRefNodeSchema
  ])
);
var SlotDefinitionSchema = z.union([
  z.string(),
  z.object({
    /** Human-readable description of the slot's purpose */
    description: z.string().optional(),
    /** Scoped slot props passed back to the parent (for scoped slots) */
    props: z.record(z.string(), PropDefinitionSchema).optional()
  })
]);
var SlotsMapSchema = z.record(z.string(), SlotDefinitionSchema);
var EventDefinitionSchema = z.union([
  z.string(),
  z.object({
    /** Human-readable description of when this event fires */
    description: z.string().optional(),
    /** Schema describing the event payload shape */
    payload: z.unknown().optional()
  })
]);
var EventsMapSchema = z.record(z.string(), EventDefinitionSchema);
var StyleValueSchema = z.union([
  z.string(),
  z.record(z.string(), z.string())
]);
var StyleMapSchema = z.record(z.string(), z.union([StyleValueSchema, z.record(z.string(), StyleValueSchema)])).describe("Component styles with base and variant maps");
var AccessibilitySchema = z.object({
  /** WAI-ARIA role (e.g., "button", "dialog", "tablist") */
  role: z.string().optional(),
  /** ARIA attribute bindings */
  ariaAttributes: z.record(z.string(), ExpressionStringSchema).optional(),
  /** Documented keyboard interactions */
  keyboardInteractions: z.array(z.string()).optional()
});
var ColorTokenSchema = z.object({
  name: z.string(),
  light: z.string(),
  dark: z.string()
});
var SpacingTokenSchema = z.record(z.string(), z.string());
var TypographyTokenSchema = z.object({
  fontFamilies: z.record(z.string(), z.string()).optional(),
  fontSizes: z.record(z.string(), z.string()).optional(),
  fontWeights: z.record(z.string(), z.string()).optional(),
  lineHeights: z.record(z.string(), z.string()).optional()
});
var RadiusTokenSchema = z.record(z.string(), z.string());
var BreakpointTokenSchema = z.record(z.string(), z.string());
var DesignTokensSchema = z.object({
  colors: z.array(ColorTokenSchema).optional(),
  spacing: SpacingTokenSchema.optional(),
  typography: TypographyTokenSchema.optional(),
  radius: RadiusTokenSchema.optional(),
  breakpoints: BreakpointTokenSchema.optional()
});
var STYLE_ADAPTER_TYPES = ["tailwind", "css", "css-in-js", "panda"];
var StyleAdapterTypeSchema = z.enum(STYLE_ADAPTER_TYPES);
var StyleAdapterConfigSchema = z.object({
  /** Which style system to target */
  type: StyleAdapterTypeSchema,
  /** Adapter-specific configuration options */
  config: z.record(z.string(), z.unknown()).optional()
});
var ComponentDependencySchema = z.object({
  name: z.string(),
  version: SemVerSchema.optional()
});
var NpmDependencySchema = z.object({
  /** npm package name */
  name: z.string(),
  /** Semver version range */
  version: z.string().optional(),
  /** Whether this is a devDependency */
  dev: z.boolean().optional()
});
var COMPONENT_CATEGORIES = [
  "primitive",
  "form",
  "layout",
  "navigation",
  "feedback",
  "data-display",
  "overlay",
  "utility"
];
var ComponentCategorySchema = z.enum(COMPONENT_CATEGORIES);
var ComponentIRSchema = z.object({
  /** Unique component name in kebab-case (e.g., "button", "data-table") */
  name: z.string().regex(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, "Component name must be kebab-case"),
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
  /** npm packages this component depends on (e.g., "@radix-ui/react-dialog") */
  npmDependencies: z.array(NpmDependencySchema).optional(),
  /** Accessibility metadata */
  accessibility: AccessibilitySchema.optional()
});

// src/errors.ts
var ValidationError = class extends Error {
  fieldErrors;
  constructor(message, fieldErrors) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = Object.freeze(fieldErrors);
  }
  /**
   * Returns a formatted multi-line string of all field errors.
   *
   * @example
   * ```typescript
   * console.log(error.formatErrors());
   * // "  • props.variant.type: Invalid enum value"
   * ```
   */
  formatErrors() {
    return this.fieldErrors.map((e) => `  \u2022 ${e.path}: ${e.message}`).join("\n");
  }
};
function ok(data) {
  return { success: true, data };
}
function err(error) {
  return { success: false, error };
}
function isOk(result) {
  return result.success === true;
}
function isErr(result) {
  return result.success === false;
}

// src/validators.ts
function zodErrorToValidationError(zodError, contextMessage) {
  const fieldErrors = zodError.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code
  }));
  return new ValidationError(contextMessage, fieldErrors);
}
function validateComponentIR(input) {
  const parsed = ComponentIRSchema.safeParse(input);
  if (parsed.success) {
    return ok(parsed.data);
  }
  return err(zodErrorToValidationError(parsed.error, "Component IR validation failed"));
}
function validateDesignTokens(input) {
  const parsed = DesignTokensSchema.safeParse(input);
  if (parsed.success) {
    return ok(parsed.data);
  }
  return err(zodErrorToValidationError(parsed.error, "Design tokens validation failed"));
}
function validateTemplateNode(input) {
  const parsed = TemplateNodeSchema.safeParse(input);
  if (parsed.success) {
    return ok(parsed.data);
  }
  return err(zodErrorToValidationError(parsed.error, "Template node validation failed"));
}
function validateStyleAdapterConfig(input) {
  const parsed = StyleAdapterConfigSchema.safeParse(input);
  if (parsed.success) {
    return ok(parsed.data);
  }
  return err(zodErrorToValidationError(parsed.error, "Style adapter config validation failed"));
}

export { AccessibilitySchema, BreakpointTokenSchema, COMPONENT_CATEGORIES, ColorTokenSchema, ComponentCategorySchema, ComponentDependencySchema, ComponentIRSchema, ComponentRefNodeSchema, ConditionalNodeSchema, DesignTokensSchema, ElementNodeSchema, EventDefinitionSchema, EventsMapSchema, ExpressionStringSchema, LoopNodeSchema, NpmDependencySchema, PROP_TYPES, PropDefinitionSchema, PropTypeSchema, PropsMapSchema, RadiusTokenSchema, STYLE_ADAPTER_TYPES, SemVerSchema, SlotDefinitionSchema, SlotNodeSchema, SlotsMapSchema, SpacingTokenSchema, StyleAdapterConfigSchema, StyleAdapterTypeSchema, StyleMapSchema, StyleValueSchema, TemplateNodeSchema, TextNodeSchema, TypographyTokenSchema, ValidationError, err, isErr, isOk, ok, validateComponentIR, validateDesignTokens, validateStyleAdapterConfig, validateTemplateNode };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map