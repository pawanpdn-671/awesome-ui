'use strict';

var zod = require('zod');

// src/schema.ts
var SemVerSchema = zod.z.string().regex(/^\d+\.\d+\.\d+$/, 'Must be a valid semver string (e.g., "1.0.0")');
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
var PropTypeSchema = zod.z.enum(PROP_TYPES);
var PropDefinitionSchema = zod.z.object({
  /** The data type of the prop */
  type: PropTypeSchema,
  /** Default value for the prop (must match the declared type) */
  default: zod.z.unknown().optional(),
  /** Whether the prop is required (defaults to false) */
  required: zod.z.boolean().optional(),
  /** Human-readable description of what this prop does */
  description: zod.z.string().optional(),
  /** Allowed values — required when type is "enum" */
  values: zod.z.array(zod.z.string()).optional()
}).refine(
  (data) => {
    if (data.type === "enum") {
      return data.values !== void 0 && data.values.length > 0;
    }
    return true;
  },
  { message: 'Enum props must have a non-empty "values" array', path: ["values"] }
);
var PropsMapSchema = zod.z.record(zod.z.string(), PropDefinitionSchema);
var ExpressionStringSchema = zod.z.string();
var TextNodeSchema = zod.z.object({
  /** Text content, may contain `{{expr}}` interpolation */
  text: zod.z.string()
});
var SlotNodeSchema = zod.z.object({
  /** Slot name (e.g., "default", "icon") */
  slot: zod.z.string(),
  /** Optional fallback content if no slot content is provided */
  fallback: zod.z.string().optional()
});
var ElementNodeSchema = zod.z.lazy(
  () => zod.z.object({
    /** HTML tag name (e.g., "div", "button", "span") */
    tag: zod.z.string(),
    /** Static or dynamic attribute bindings */
    attributes: zod.z.record(zod.z.string(), ExpressionStringSchema).optional(),
    /** CSS class bindings (expression string) */
    class: ExpressionStringSchema.optional(),
    /** Inline style bindings */
    style: zod.z.record(zod.z.string(), ExpressionStringSchema).optional(),
    /** Child template nodes */
    children: zod.z.array(TemplateNodeSchema).optional()
  })
);
var ConditionalNodeSchema = zod.z.lazy(
  () => zod.z.object({
    /** Boolean expression to evaluate */
    if: zod.z.string(),
    /** Node to render when the condition is truthy */
    then: TemplateNodeSchema,
    /** Optional node to render when the condition is falsy */
    else: TemplateNodeSchema.optional()
  })
);
var LoopNodeSchema = zod.z.lazy(
  () => zod.z.object({
    /** Expression that evaluates to an iterable collection */
    each: zod.z.string(),
    /** Variable name for each iteration item */
    as: zod.z.string(),
    /** Optional key expression for efficient list rendering */
    key: zod.z.string().optional(),
    /** Child nodes rendered for each item */
    children: zod.z.array(TemplateNodeSchema)
  })
);
var ComponentRefNodeSchema = zod.z.object({
  /** Name of the referenced AwesomeUI component */
  component: zod.z.string(),
  /** Props to pass to the referenced component */
  props: zod.z.record(zod.z.string(), ExpressionStringSchema).optional()
});
var TemplateNodeSchema = zod.z.lazy(
  () => zod.z.union([
    ElementNodeSchema,
    TextNodeSchema,
    SlotNodeSchema,
    ConditionalNodeSchema,
    LoopNodeSchema,
    ComponentRefNodeSchema
  ])
);
var SlotDefinitionSchema = zod.z.union([
  zod.z.string(),
  zod.z.object({
    /** Human-readable description of the slot's purpose */
    description: zod.z.string().optional(),
    /** Scoped slot props passed back to the parent (for scoped slots) */
    props: zod.z.record(zod.z.string(), PropDefinitionSchema).optional()
  })
]);
var SlotsMapSchema = zod.z.record(zod.z.string(), SlotDefinitionSchema);
var EventDefinitionSchema = zod.z.union([
  zod.z.string(),
  zod.z.object({
    /** Human-readable description of when this event fires */
    description: zod.z.string().optional(),
    /** Schema describing the event payload shape */
    payload: zod.z.unknown().optional()
  })
]);
var EventsMapSchema = zod.z.record(zod.z.string(), EventDefinitionSchema);
var StyleValueSchema = zod.z.union([
  zod.z.string(),
  zod.z.record(zod.z.string(), zod.z.string())
]);
var StyleMapSchema = zod.z.record(zod.z.string(), zod.z.union([StyleValueSchema, zod.z.record(zod.z.string(), StyleValueSchema)])).describe("Component styles with base and variant maps");
var AccessibilitySchema = zod.z.object({
  /** WAI-ARIA role (e.g., "button", "dialog", "tablist") */
  role: zod.z.string().optional(),
  /** ARIA attribute bindings */
  ariaAttributes: zod.z.record(zod.z.string(), ExpressionStringSchema).optional(),
  /** Documented keyboard interactions */
  keyboardInteractions: zod.z.array(zod.z.string()).optional()
});
var ColorTokenSchema = zod.z.object({
  name: zod.z.string(),
  light: zod.z.string(),
  dark: zod.z.string()
});
var SpacingTokenSchema = zod.z.record(zod.z.string(), zod.z.string());
var TypographyTokenSchema = zod.z.object({
  fontFamilies: zod.z.record(zod.z.string(), zod.z.string()).optional(),
  fontSizes: zod.z.record(zod.z.string(), zod.z.string()).optional(),
  fontWeights: zod.z.record(zod.z.string(), zod.z.string()).optional(),
  lineHeights: zod.z.record(zod.z.string(), zod.z.string()).optional()
});
var RadiusTokenSchema = zod.z.record(zod.z.string(), zod.z.string());
var BreakpointTokenSchema = zod.z.record(zod.z.string(), zod.z.string());
var DesignTokensSchema = zod.z.object({
  colors: zod.z.array(ColorTokenSchema).optional(),
  spacing: SpacingTokenSchema.optional(),
  typography: TypographyTokenSchema.optional(),
  radius: RadiusTokenSchema.optional(),
  breakpoints: BreakpointTokenSchema.optional()
});
var STYLE_ADAPTER_TYPES = ["tailwind", "css", "css-in-js", "panda"];
var StyleAdapterTypeSchema = zod.z.enum(STYLE_ADAPTER_TYPES);
var StyleAdapterConfigSchema = zod.z.object({
  /** Which style system to target */
  type: StyleAdapterTypeSchema,
  /** Adapter-specific configuration options */
  config: zod.z.record(zod.z.string(), zod.z.unknown()).optional()
});
var ComponentDependencySchema = zod.z.object({
  name: zod.z.string(),
  version: SemVerSchema.optional()
});
var NpmDependencySchema = zod.z.object({
  /** npm package name */
  name: zod.z.string(),
  /** Semver version range */
  version: zod.z.string().optional(),
  /** Whether this is a devDependency */
  dev: zod.z.boolean().optional()
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
var ComponentCategorySchema = zod.z.enum(COMPONENT_CATEGORIES);
var ComponentIRSchema = zod.z.object({
  /** Unique component name in kebab-case (e.g., "button", "data-table") */
  name: zod.z.string().regex(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, "Component name must be kebab-case"),
  /** Semantic version of this component definition */
  version: SemVerSchema,
  /** Human-readable description of the component */
  description: zod.z.string().optional(),
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
  dependencies: zod.z.array(ComponentDependencySchema).optional(),
  /** npm packages this component depends on (e.g., "@radix-ui/react-dialog") */
  npmDependencies: zod.z.array(NpmDependencySchema).optional(),
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

exports.AccessibilitySchema = AccessibilitySchema;
exports.BreakpointTokenSchema = BreakpointTokenSchema;
exports.COMPONENT_CATEGORIES = COMPONENT_CATEGORIES;
exports.ColorTokenSchema = ColorTokenSchema;
exports.ComponentCategorySchema = ComponentCategorySchema;
exports.ComponentDependencySchema = ComponentDependencySchema;
exports.ComponentIRSchema = ComponentIRSchema;
exports.ComponentRefNodeSchema = ComponentRefNodeSchema;
exports.ConditionalNodeSchema = ConditionalNodeSchema;
exports.DesignTokensSchema = DesignTokensSchema;
exports.ElementNodeSchema = ElementNodeSchema;
exports.EventDefinitionSchema = EventDefinitionSchema;
exports.EventsMapSchema = EventsMapSchema;
exports.ExpressionStringSchema = ExpressionStringSchema;
exports.LoopNodeSchema = LoopNodeSchema;
exports.NpmDependencySchema = NpmDependencySchema;
exports.PROP_TYPES = PROP_TYPES;
exports.PropDefinitionSchema = PropDefinitionSchema;
exports.PropTypeSchema = PropTypeSchema;
exports.PropsMapSchema = PropsMapSchema;
exports.RadiusTokenSchema = RadiusTokenSchema;
exports.STYLE_ADAPTER_TYPES = STYLE_ADAPTER_TYPES;
exports.SemVerSchema = SemVerSchema;
exports.SlotDefinitionSchema = SlotDefinitionSchema;
exports.SlotNodeSchema = SlotNodeSchema;
exports.SlotsMapSchema = SlotsMapSchema;
exports.SpacingTokenSchema = SpacingTokenSchema;
exports.StyleAdapterConfigSchema = StyleAdapterConfigSchema;
exports.StyleAdapterTypeSchema = StyleAdapterTypeSchema;
exports.StyleMapSchema = StyleMapSchema;
exports.StyleValueSchema = StyleValueSchema;
exports.TemplateNodeSchema = TemplateNodeSchema;
exports.TextNodeSchema = TextNodeSchema;
exports.TypographyTokenSchema = TypographyTokenSchema;
exports.ValidationError = ValidationError;
exports.err = err;
exports.isErr = isErr;
exports.isOk = isOk;
exports.ok = ok;
exports.validateComponentIR = validateComponentIR;
exports.validateDesignTokens = validateDesignTokens;
exports.validateStyleAdapterConfig = validateStyleAdapterConfig;
exports.validateTemplateNode = validateTemplateNode;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map