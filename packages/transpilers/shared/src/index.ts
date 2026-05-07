/**
 * @module @awesomeui/transpiler-shared
 * @description Shared transpiler infrastructure for AwesomeUI.
 * Provides the base transpiler class, expression parser, and utilities.
 */

export {
  BaseTranspiler,
  type ITranspileOutput,
  type ITranspileOptions,
} from './base-transpiler.js';

export {
  parseExpression,
  isExpression,
  isPureExpression,
  extractExpression,
  type IExpressionSegment,
} from './expression-parser.js';

export {
  toPascalCase,
  toCamelCase,
  indent,
  wrapInQuotes,
  wrapInSingleQuotes,
  irTypeToTSBase,
  resolvePropsExpression,
} from './utils.js';
