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

import type { z } from 'zod';
import type {
  SemVerSchema,
  PropTypeSchema,
  PropDefinitionSchema,
  PropsMapSchema,
  ExpressionStringSchema,
  TextNodeSchema,
  SlotNodeSchema,
  ElementNodeSchema,
  ConditionalNodeSchema,
  LoopNodeSchema,
  ComponentRefNodeSchema,
  TemplateNodeSchema,
  SlotDefinitionSchema,
  SlotsMapSchema,
  EventDefinitionSchema,
  EventsMapSchema,
  StyleValueSchema,
  StyleMapSchema,
  AccessibilitySchema,
  ColorTokenSchema,
  SpacingTokenSchema,
  TypographyTokenSchema,
  RadiusTokenSchema,
  BreakpointTokenSchema,
  DesignTokensSchema,
  StyleAdapterTypeSchema,
  StyleAdapterConfigSchema,
  ComponentDependencySchema,
  ComponentCategorySchema,
  ComponentIRSchema,
} from './schema.js';

// ─── Prop Types ─────────────────────────────────────────────────────────────────

/** Semantic version string */
export type SemVer = z.infer<typeof SemVerSchema>;

/** Union of valid prop type names */
export type PropType = z.infer<typeof PropTypeSchema>;

/** A single prop definition with type, default, description, etc. */
export type IPropDefinition = z.infer<typeof PropDefinitionSchema>;

/** Map of prop name → prop definition */
export type IPropsMap = z.infer<typeof PropsMapSchema>;

// ─── Expression Types ───────────────────────────────────────────────────────────

/** A string that may contain `{{expr}}` interpolation markers */
export type ExpressionString = z.infer<typeof ExpressionStringSchema>;

// ─── Template Node Types ────────────────────────────────────────────────────────

/** A text node containing static or interpolated text */
export type ITextNode = z.infer<typeof TextNodeSchema>;

/** A slot reference node for content projection */
export type ISlotNode = z.infer<typeof SlotNodeSchema>;

/** An HTML element node with attributes, children, class, and style bindings */
export type IElementNode = z.infer<typeof ElementNodeSchema>;

/** A conditional rendering node (if/then/else) */
export type IConditionalNode = z.infer<typeof ConditionalNodeSchema>;

/** A loop rendering node (each/as/key/children) */
export type ILoopNode = z.infer<typeof LoopNodeSchema>;

/** A reference to another AwesomeUI component */
export type IComponentRefNode = z.infer<typeof ComponentRefNodeSchema>;

/** Discriminated union of all template node types */
export type ITemplateNode = z.infer<typeof TemplateNodeSchema>;

// ─── Slot & Event Types ─────────────────────────────────────────────────────────

/** A slot definition — either a simple string description or a full definition */
export type ISlotDefinition = z.infer<typeof SlotDefinitionSchema>;

/** Map of slot name → slot definition */
export type ISlotsMap = z.infer<typeof SlotsMapSchema>;

/** An event definition — either a simple string description or a full definition */
export type IEventDefinition = z.infer<typeof EventDefinitionSchema>;

/** Map of event name → event definition */
export type IEventsMap = z.infer<typeof EventsMapSchema>;

// ─── Style Types ────────────────────────────────────────────────────────────────

/** A style value: utility class string or CSS property map */
export type StyleValue = z.infer<typeof StyleValueSchema>;

/** Component style map with base and variant groups */
export type IStyleMap = z.infer<typeof StyleMapSchema>;

// ─── Accessibility Types ────────────────────────────────────────────────────────

/** Accessibility metadata (role, ARIA attributes, keyboard interactions) */
export type IAccessibility = z.infer<typeof AccessibilitySchema>;

// ─── Design Token Types ─────────────────────────────────────────────────────────

/** Color token with light/dark mode values */
export type IColorToken = z.infer<typeof ColorTokenSchema>;

/** Spacing scale token map */
export type ISpacingToken = z.infer<typeof SpacingTokenSchema>;

/** Typography token system */
export type ITypographyToken = z.infer<typeof TypographyTokenSchema>;

/** Border radius token map */
export type IRadiusToken = z.infer<typeof RadiusTokenSchema>;

/** Responsive breakpoint token map */
export type IBreakpointToken = z.infer<typeof BreakpointTokenSchema>;

/** Aggregate design token system */
export type IDesignTokens = z.infer<typeof DesignTokensSchema>;

// ─── Style Adapter Types ────────────────────────────────────────────────────────

/** Supported style adapter types */
export type StyleAdapterType = z.infer<typeof StyleAdapterTypeSchema>;

/** Style adapter configuration */
export type IStyleAdapterConfig = z.infer<typeof StyleAdapterConfigSchema>;

// ─── Component Types ────────────────────────────────────────────────────────────

/** A dependency on another AwesomeUI component */
export type IComponentDependency = z.infer<typeof ComponentDependencySchema>;

/** Component category for registry organization */
export type ComponentCategory = z.infer<typeof ComponentCategorySchema>;

/** The complete Component Intermediate Representation */
export type IComponentIR = z.infer<typeof ComponentIRSchema>;
