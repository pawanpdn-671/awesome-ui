import { IComponentIR, Result, ValidationError } from '@awesomeui/core';

/**
 * @module base-transpiler
 * @description Abstract base class for all framework transpilers.
 * Handles validation, error wrapping, and the common transpile pipeline.
 *
 * @example
 * ```typescript
 * class ReactTranspiler extends BaseTranspiler {
 *   readonly framework = 'react';
 *   readonly fileExtension = '.tsx';
 *   // ... implement abstract methods
 * }
 * ```
 */

/**
 * The output of a successful transpilation.
 */
interface ITranspileOutput {
    /** The generated source code */
    code: string;
    /** Suggested filename (e.g., "Button.tsx", "Button.vue") */
    filename: string;
    /** The programming language of the output */
    language: string;
    /** The framework that was targeted */
    framework: string;
    /** The original component name from the IR */
    componentName: string;
}
/**
 * Options that can be passed to the transpiler.
 */
interface ITranspileOptions {
    /** Style adapter to use (default: 'tailwind') */
    styleAdapter?: 'tailwind' | 'css' | 'css-in-js' | 'panda';
    /** Whether to include TypeScript types (default: true) */
    typescript?: boolean;
    /** Custom indent size in spaces (default: 2) */
    indentSize?: number;
}
/**
 * Abstract base class that all framework transpilers extend.
 * Provides the main `transpile()` method which orchestrates validation
 * and delegates to framework-specific abstract methods.
 *
 * @example
 * ```typescript
 * const transpiler = new ReactTranspiler();
 * const result = transpiler.transpile(buttonIR);
 * if (isOk(result)) {
 *   console.log(result.data.code); // React component source
 * }
 * ```
 */
declare abstract class BaseTranspiler {
    /** The target framework name */
    abstract readonly framework: string;
    /** The file extension for generated files */
    abstract readonly fileExtension: string;
    /** The output language identifier */
    abstract readonly language: string;
    /**
     * Main transpilation method. Validates the IR, then generates framework code.
     *
     * @param input - A validated IComponentIR or raw unknown data
     * @param options - Optional transpilation options
     * @returns Result with the transpiled output or a validation error
     */
    transpile(input: IComponentIR | unknown, options?: ITranspileOptions): Result<ITranspileOutput, ValidationError>;
    /**
     * Generate the complete component code. Subclasses must implement this.
     *
     * @param ir - The validated component IR
     * @param options - Resolved transpilation options
     * @returns The generated source code string
     */
    protected abstract generate(ir: IComponentIR, options: Required<ITranspileOptions>): string;
    /**
     * Converts a kebab-case IR component name to the framework's naming convention.
     * Default implementation returns PascalCase. Override for different conventions.
     *
     * @param name - The kebab-case component name from IR
     * @returns The framework-appropriate component name
     */
    protected getComponentName(name: string): string;
}

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
interface IExpressionSegment {
    /** Whether this is a static text or a dynamic expression */
    type: 'static' | 'expression';
    /** The text or expression content */
    value: string;
}
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
declare function parseExpression(input: string): IExpressionSegment[];
/**
 * Checks whether a string contains any `{{expr}}` expressions.
 *
 * @example
 * ```typescript
 * isExpression('{{props.name}}');  // true
 * isExpression('hello world');     // false
 * ```
 */
declare function isExpression(input: string): boolean;
/**
 * Checks if a string is a single, pure expression (no surrounding static text).
 *
 * @example
 * ```typescript
 * isPureExpression('{{props.name}}');       // true
 * isPureExpression('hello {{props.name}}'); // false
 * ```
 */
declare function isPureExpression(input: string): boolean;
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
declare function extractExpression(input: string): string;

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
declare function toPascalCase(str: string): string;
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
declare function toCamelCase(str: string): string;
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
declare function indent(code: string, level: number): string;
/**
 * Wraps a string in double quotes, escaping inner quotes.
 *
 * @example
 * ```typescript
 * wrapInQuotes('hello');       // '"hello"'
 * wrapInQuotes('say "hi"');    // '"say \\"hi\\""'
 * ```
 */
declare function wrapInQuotes(str: string): string;
/**
 * Wraps a string in single quotes, escaping inner quotes.
 *
 * @example
 * ```typescript
 * wrapInSingleQuotes('hello');     // "'hello'"
 * wrapInSingleQuotes("it's");      // "'it\\'s'"
 * ```
 */
declare function wrapInSingleQuotes(str: string): string;
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
declare function irTypeToTSBase(type: string): string;
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
declare function resolvePropsExpression(expr: string): string;

export { BaseTranspiler, type IExpressionSegment, type ITranspileOptions, type ITranspileOutput, extractExpression, indent, irTypeToTSBase, isExpression, isPureExpression, parseExpression, resolvePropsExpression, toCamelCase, toPascalCase, wrapInQuotes, wrapInSingleQuotes };
