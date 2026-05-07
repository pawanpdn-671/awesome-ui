/**
 * @module expression-parser
 * @description Parses `{{expr}}` mustache-style expressions from IR template strings.
 * Each transpiler uses this to convert IR expressions into framework-native syntax.
 *
 * @example
 * ```typescript
 * import { parseExpression } from '@awesomeui/transpiler-shared';
 *
 * const segments = parseExpression('btn {{styles.base}} {{styles.variant[props.variant]}}');
 * // [
 * //   { type: 'static', value: 'btn ' },
 * //   { type: 'expression', value: 'styles.base' },
 * //   { type: 'static', value: ' ' },
 * //   { type: 'expression', value: 'styles.variant[props.variant]' },
 * // ]
 * ```
 */

/** A single segment of a parsed expression string. */
export interface IExpressionSegment {
  /** Whether this is a static text or a dynamic expression */
  type: 'static' | 'expression';
  /** The text or expression content */
  value: string;
}

/** Pattern matching `{{...}}` expressions */
const EXPRESSION_PATTERN = /\{\{(.+?)\}\}/g;

/**
 * Parses a string containing `{{expr}}` markers into an array of segments.
 * Static parts and expression parts are returned in order.
 *
 * @param input - The expression string to parse
 * @returns Array of static/expression segments
 *
 * @example
 * ```typescript
 * parseExpression('{{props.disabled}}');
 * // [{ type: 'expression', value: 'props.disabled' }]
 *
 * parseExpression('Hello {{props.name}}!');
 * // [
 * //   { type: 'static', value: 'Hello ' },
 * //   { type: 'expression', value: 'props.name' },
 * //   { type: 'static', value: '!' },
 * // ]
 * ```
 */
export function parseExpression(input: string): IExpressionSegment[] {
  const segments: IExpressionSegment[] = [];
  let lastIndex = 0;

  // Reset regex state for each call
  const regex = new RegExp(EXPRESSION_PATTERN.source, EXPRESSION_PATTERN.flags);
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    // Add static segment before the match
    if (match.index > lastIndex) {
      segments.push({
        type: 'static',
        value: input.slice(lastIndex, match.index),
      });
    }

    // Add the expression segment (trimmed)
    const expr = match[1];
    if (expr !== undefined) {
      segments.push({
        type: 'expression',
        value: expr.trim(),
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining static text
  if (lastIndex < input.length) {
    segments.push({
      type: 'static',
      value: input.slice(lastIndex),
    });
  }

  return segments;
}

/**
 * Checks whether a string contains any `{{expr}}` expressions.
 *
 * @example
 * ```typescript
 * isExpression('{{props.name}}');  // true
 * isExpression('hello world');     // false
 * ```
 */
export function isExpression(input: string): boolean {
  const regex = new RegExp(EXPRESSION_PATTERN.source, EXPRESSION_PATTERN.flags);
  return regex.test(input);
}

/**
 * Checks if a string is a single, pure expression (no surrounding static text).
 *
 * @example
 * ```typescript
 * isPureExpression('{{props.name}}');       // true
 * isPureExpression('hello {{props.name}}'); // false
 * ```
 */
export function isPureExpression(input: string): boolean {
  const segments = parseExpression(input);
  return segments.length === 1 && segments[0]?.type === 'expression';
}

/**
 * Extracts just the expression text from a pure `{{expr}}` string.
 * Returns the original string if it's not a pure expression.
 *
 * @example
 * ```typescript
 * extractExpression('{{props.name}}'); // 'props.name'
 * extractExpression('hello');          // 'hello'
 * ```
 */
export function extractExpression(input: string): string {
  const segments = parseExpression(input);
  if (segments.length === 1 && segments[0]?.type === 'expression') {
    return segments[0].value;
  }
  return input;
}
