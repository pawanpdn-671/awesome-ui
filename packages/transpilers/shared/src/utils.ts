/**
 * @module utils
 * @description String and code-generation utility functions shared across transpilers.
 *
 * @example
 * ```typescript
 * import { toPascalCase, toCamelCase, indent } from '@awesomeui/transpiler-shared';
 *
 * toPascalCase('data-table'); // 'DataTable'
 * toCamelCase('on-click');    // 'onClick'
 * indent('<div>hello</div>', 2); // '    <div>hello</div>'
 * ```
 */

/**
 * Converts a kebab-case string to PascalCase.
 *
 * @example
 * ```typescript
 * toPascalCase('button');     // 'Button'
 * toPascalCase('data-table'); // 'DataTable'
 * toPascalCase('my-cool-component'); // 'MyCoolComponent'
 * ```
 */
export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/**
 * Converts a kebab-case or PascalCase string to camelCase.
 *
 * @example
 * ```typescript
 * toCamelCase('on-click');   // 'onClick'
 * toCamelCase('full-width'); // 'fullWidth'
 * toCamelCase('Button');     // 'button'
 * ```
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Indents each line of a multi-line string by a given level.
 * Uses 2 spaces per indent level.
 *
 * @param code - The code string to indent
 * @param level - Number of indent levels (2 spaces each)
 * @returns Indented code string
 *
 * @example
 * ```typescript
 * indent('<div>hello</div>', 1); // '  <div>hello</div>'
 * indent('line1\nline2', 2);     // '    line1\n    line2'
 * ```
 */
export function indent(code: string, level: number): string {
  const spaces = '  '.repeat(level);
  return code
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : spaces + line))
    .join('\n');
}

/**
 * Wraps a string in double quotes, escaping inner quotes.
 *
 * @example
 * ```typescript
 * wrapInQuotes('hello');       // '"hello"'
 * wrapInQuotes('say "hi"');    // '"say \\"hi\\""'
 * ```
 */
export function wrapInQuotes(str: string): string {
  return `"${str.replace(/"/g, '\\"')}"`;
}

/**
 * Wraps a string in single quotes, escaping inner quotes.
 *
 * @example
 * ```typescript
 * wrapInSingleQuotes('hello');     // "'hello'"
 * wrapInSingleQuotes("it's");      // "'it\\'s'"
 * ```
 */
export function wrapInSingleQuotes(str: string): string {
  return `'${str.replace(/'/g, "\\'")}'`;
}

/**
 * Maps an IR prop type to its corresponding TypeScript type string.
 *
 * @example
 * ```typescript
 * irTypeToTS('string');  // 'string'
 * irTypeToTS('boolean'); // 'boolean'
 * irTypeToTS('slot');    // 'React.ReactNode' (framework dependent)
 * ```
 */
export function irTypeToTSBase(type: string): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    object: 'Record<string, unknown>',
    array: 'unknown[]',
    function: '(...args: unknown[]) => unknown',
  };

  return typeMap[type] ?? 'unknown';
}

/**
 * Converts an IR expression reference to a local variable name.
 * E.g., `props.variant` → `variant`, `props.disabled` → `disabled`
 *
 * @example
 * ```typescript
 * resolvePropsExpression('props.variant');  // 'variant'
 * resolvePropsExpression('props.loading');  // 'loading'
 * resolvePropsExpression('styles.base');    // 'styles.base' (unchanged)
 * ```
 */
export function resolvePropsExpression(expr: string): string {
  if (expr.startsWith('props.')) {
    return expr.slice(6);
  }
  return expr;
}
