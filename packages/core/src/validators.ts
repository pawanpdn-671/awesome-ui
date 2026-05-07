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

import { ZodError } from 'zod';
import {
  ComponentIRSchema,
  DesignTokensSchema,
  TemplateNodeSchema,
  StyleAdapterConfigSchema,
} from './schema.js';
import type { IComponentIR, IDesignTokens, ITemplateNode, IStyleAdapterConfig } from './types.js';
import { ok, err, type Result, ValidationError, type IFieldError } from './errors.js';

/**
 * Converts a ZodError into a structured ValidationError with field-level detail.
 *
 * @param zodError - The Zod validation error to convert
 * @param contextMessage - Human-readable context (e.g., "Component IR validation failed")
 * @returns A ValidationError with structured field errors
 *
 * @example
 * ```typescript
 * try {
 *   schema.parse(data);
 * } catch (e) {
 *   if (e instanceof ZodError) {
 *     throw zodErrorToValidationError(e, 'Parsing failed');
 *   }
 * }
 * ```
 */
function zodErrorToValidationError(zodError: ZodError, contextMessage: string): ValidationError {
  const fieldErrors: IFieldError[] = zodError.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

  return new ValidationError(contextMessage, fieldErrors);
}

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
export function validateComponentIR(input: unknown): Result<IComponentIR, ValidationError> {
  const parsed = ComponentIRSchema.safeParse(input);

  if (parsed.success) {
    return ok(parsed.data);
  }

  return err(zodErrorToValidationError(parsed.error, 'Component IR validation failed'));
}

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
export function validateDesignTokens(input: unknown): Result<IDesignTokens, ValidationError> {
  const parsed = DesignTokensSchema.safeParse(input);

  if (parsed.success) {
    return ok(parsed.data);
  }

  return err(zodErrorToValidationError(parsed.error, 'Design tokens validation failed'));
}

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
export function validateTemplateNode(input: unknown): Result<ITemplateNode, ValidationError> {
  const parsed = TemplateNodeSchema.safeParse(input);

  if (parsed.success) {
    return ok(parsed.data);
  }

  return err(zodErrorToValidationError(parsed.error, 'Template node validation failed'));
}

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
export function validateStyleAdapterConfig(
  input: unknown
): Result<IStyleAdapterConfig, ValidationError> {
  const parsed = StyleAdapterConfigSchema.safeParse(input);

  if (parsed.success) {
    return ok(parsed.data);
  }

  return err(zodErrorToValidationError(parsed.error, 'Style adapter config validation failed'));
}
