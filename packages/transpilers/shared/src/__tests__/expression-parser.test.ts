/**
 * @module expression-parser.test
 * @description Tests for the expression parser and shared utilities.
 */

import { describe, it, expect } from 'vitest';
import {
  parseExpression,
  isExpression,
  isPureExpression,
  extractExpression,
  toPascalCase,
  toCamelCase,
  indent,
  wrapInQuotes,
  wrapInSingleQuotes,
  irTypeToTSBase,
  resolvePropsExpression,
} from '../index.js';

// ─── parseExpression ────────────────────────────────────────────────────────────

describe('parseExpression', () => {
  it('parses a pure expression', () => {
    const segments = parseExpression('{{props.variant}}');
    expect(segments).toEqual([
      { type: 'expression', value: 'props.variant' },
    ]);
  });

  it('parses static text only', () => {
    const segments = parseExpression('hello world');
    expect(segments).toEqual([
      { type: 'static', value: 'hello world' },
    ]);
  });

  it('parses mixed static + expression', () => {
    const segments = parseExpression('btn {{styles.base}} active');
    expect(segments).toEqual([
      { type: 'static', value: 'btn ' },
      { type: 'expression', value: 'styles.base' },
      { type: 'static', value: ' active' },
    ]);
  });

  it('parses multiple expressions', () => {
    const segments = parseExpression('{{styles.base}} {{styles.variant[props.variant]}}');
    expect(segments).toHaveLength(3); // expr, static (space), expr
    expect(segments[0]?.type).toBe('expression');
    expect(segments[2]?.type).toBe('expression');
  });

  it('handles empty string', () => {
    expect(parseExpression('')).toEqual([]);
  });

  it('trims expression whitespace', () => {
    const segments = parseExpression('{{ props.name }}');
    expect(segments[0]?.value).toBe('props.name');
  });
});

// ─── isExpression / isPureExpression ────────────────────────────────────────────

describe('isExpression', () => {
  it('detects expressions', () => {
    expect(isExpression('{{props.name}}')).toBe(true);
    expect(isExpression('hello {{world}}')).toBe(true);
    expect(isExpression('no expressions here')).toBe(false);
  });
});

describe('isPureExpression', () => {
  it('detects pure expressions', () => {
    expect(isPureExpression('{{props.name}}')).toBe(true);
    expect(isPureExpression('hello {{world}}')).toBe(false);
    expect(isPureExpression('static')).toBe(false);
  });
});

describe('extractExpression', () => {
  it('extracts from pure expression', () => {
    expect(extractExpression('{{props.name}}')).toBe('props.name');
  });

  it('returns original for non-expression', () => {
    expect(extractExpression('hello')).toBe('hello');
  });
});

// ─── Case Conversion ───────────────────────────────────────────────────────────

describe('toPascalCase', () => {
  it('converts kebab-case', () => {
    expect(toPascalCase('button')).toBe('Button');
    expect(toPascalCase('data-table')).toBe('DataTable');
    expect(toPascalCase('my-cool-component')).toBe('MyCoolComponent');
  });
});

describe('toCamelCase', () => {
  it('converts kebab-case', () => {
    expect(toCamelCase('on-click')).toBe('onClick');
    expect(toCamelCase('full-width')).toBe('fullWidth');
  });
});

// ─── indent ─────────────────────────────────────────────────────────────────────

describe('indent', () => {
  it('indents single line', () => {
    expect(indent('hello', 1)).toBe('  hello');
    expect(indent('hello', 2)).toBe('    hello');
  });

  it('indents multi-line', () => {
    expect(indent('a\nb', 1)).toBe('  a\n  b');
  });

  it('preserves empty lines', () => {
    expect(indent('a\n\nb', 1)).toBe('  a\n\n  b');
  });
});

// ─── Quoting ────────────────────────────────────────────────────────────────────

describe('wrapInQuotes', () => {
  it('wraps in double quotes', () => {
    expect(wrapInQuotes('hello')).toBe('"hello"');
  });

  it('escapes inner quotes', () => {
    expect(wrapInQuotes('say "hi"')).toBe('"say \\"hi\\""');
  });
});

describe('wrapInSingleQuotes', () => {
  it('wraps in single quotes', () => {
    expect(wrapInSingleQuotes('hello')).toBe("'hello'");
  });
});

// ─── Type Mapping ───────────────────────────────────────────────────────────────

describe('irTypeToTSBase', () => {
  it('maps IR types to TypeScript', () => {
    expect(irTypeToTSBase('string')).toBe('string');
    expect(irTypeToTSBase('number')).toBe('number');
    expect(irTypeToTSBase('boolean')).toBe('boolean');
    expect(irTypeToTSBase('object')).toBe('Record<string, unknown>');
    expect(irTypeToTSBase('array')).toBe('unknown[]');
    expect(irTypeToTSBase('function')).toBe('(...args: unknown[]) => unknown');
    expect(irTypeToTSBase('unknown_type')).toBe('unknown');
  });
});

// ─── resolvePropsExpression ─────────────────────────────────────────────────────

describe('resolvePropsExpression', () => {
  it('strips props. prefix', () => {
    expect(resolvePropsExpression('props.variant')).toBe('variant');
    expect(resolvePropsExpression('props.disabled')).toBe('disabled');
  });

  it('preserves non-props expressions', () => {
    expect(resolvePropsExpression('styles.base')).toBe('styles.base');
  });
});
