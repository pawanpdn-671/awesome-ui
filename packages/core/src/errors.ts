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
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * A structured field-level error entry used in validation results.
 */
export interface IFieldError {
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
export class ValidationError extends Error {
  public readonly fieldErrors: ReadonlyArray<IFieldError>;

  constructor(message: string, fieldErrors: IFieldError[]) {
    super(message);
    this.name = 'ValidationError';
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
  formatErrors(): string {
    return this.fieldErrors
      .map((e) => `  • ${e.path}: ${e.message}`)
      .join('\n');
  }
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
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Creates a failed Result wrapping the given error.
 *
 * @example
 * ```typescript
 * const result = err(new Error('Something went wrong'));
 * // result.success === false, result.error.message === 'Something went wrong'
 * ```
 */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

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
export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true;
}

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
export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}
