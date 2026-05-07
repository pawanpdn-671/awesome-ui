/**
 * @module @awesomeui/core
 * @description Core package for the AwesomeUI cross-framework component platform.
 * Exports IR schemas, TypeScript types, validators, and error handling utilities.
 *
 * @example
 * ```typescript
 * import {
 *   ComponentIRSchema,
 *   validateComponentIR,
 *   isOk,
 *   type IComponentIR,
 * } from '@awesomeui/core';
 * ```
 */

// ─── Schemas ────────────────────────────────────────────────────────────────────
export {
  // Semver
  SemVerSchema,
  // Props
  PROP_TYPES,
  PropTypeSchema,
  PropDefinitionSchema,
  PropsMapSchema,
  // Expressions
  ExpressionStringSchema,
  // Template Nodes
  TextNodeSchema,
  SlotNodeSchema,
  ElementNodeSchema,
  ConditionalNodeSchema,
  LoopNodeSchema,
  ComponentRefNodeSchema,
  TemplateNodeSchema,
  // Slots & Events
  SlotDefinitionSchema,
  SlotsMapSchema,
  EventDefinitionSchema,
  EventsMapSchema,
  // Styles
  StyleValueSchema,
  StyleMapSchema,
  // Accessibility
  AccessibilitySchema,
  // Design Tokens
  ColorTokenSchema,
  SpacingTokenSchema,
  TypographyTokenSchema,
  RadiusTokenSchema,
  BreakpointTokenSchema,
  DesignTokensSchema,
  // Style Adapters
  STYLE_ADAPTER_TYPES,
  StyleAdapterTypeSchema,
  StyleAdapterConfigSchema,
  // Dependencies & Categories
  ComponentDependencySchema,
  COMPONENT_CATEGORIES,
  ComponentCategorySchema,
  // Component IR
  ComponentIRSchema,
} from './schema.js';

// ─── Types ──────────────────────────────────────────────────────────────────────
export type {
  SemVer,
  PropType,
  IPropDefinition,
  IPropsMap,
  ExpressionString,
  ITextNode,
  ISlotNode,
  IElementNode,
  IConditionalNode,
  ILoopNode,
  IComponentRefNode,
  ITemplateNode,
  ISlotDefinition,
  ISlotsMap,
  IEventDefinition,
  IEventsMap,
  StyleValue,
  IStyleMap,
  IAccessibility,
  IColorToken,
  ISpacingToken,
  ITypographyToken,
  IRadiusToken,
  IBreakpointToken,
  IDesignTokens,
  StyleAdapterType,
  IStyleAdapterConfig,
  IComponentDependency,
  ComponentCategory,
  IComponentIR,
} from './types.js';

// ─── Validators ─────────────────────────────────────────────────────────────────
export {
  validateComponentIR,
  validateDesignTokens,
  validateTemplateNode,
  validateStyleAdapterConfig,
} from './validators.js';

// ─── Error Handling ─────────────────────────────────────────────────────────────
export {
  type Result,
  type IFieldError,
  ValidationError,
  ok,
  err,
  isOk,
  isErr,
} from './errors.js';
