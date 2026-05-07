/**
 * @module validators.test
 * @description Unit tests for validation functions and Result-type error handling.
 */

import { describe, it, expect } from 'vitest';
import {
  validateComponentIR,
  validateDesignTokens,
  validateTemplateNode,
  validateStyleAdapterConfig,
  isOk,
  isErr,
  ok,
  err,
  ValidationError,
} from '../index.js';

// eslint-disable-next-line @typescript-eslint/no-require-imports -- JSON fixture
import buttonIR from '../components/button.ir.json';

// ─── Result Type Helpers ────────────────────────────────────────────────────────

describe('Result type helpers', () => {
  it('ok() creates a success result', () => {
    const result = ok(42);
    expect(result.success).toBe(true);
    expect(isOk(result)).toBe(true);
    expect(isErr(result)).toBe(false);
    if (isOk(result)) {
      expect(result.data).toBe(42);
    }
  });

  it('err() creates a failed result', () => {
    const error = new Error('fail');
    const result = err(error);
    expect(result.success).toBe(false);
    expect(isErr(result)).toBe(true);
    expect(isOk(result)).toBe(false);
    if (isErr(result)) {
      expect(result.error).toBe(error);
    }
  });

  it('Result types are narrowed by type guards', () => {
    const success = ok({ name: 'button' });
    const failure = err(new ValidationError('fail', []));

    // Type narrowing should work correctly
    if (isOk(success)) {
      expect(success.data.name).toBe('button');
    }
    if (isErr(failure)) {
      expect(failure.error).toBeInstanceOf(ValidationError);
    }
  });
});

// ─── ValidationError ────────────────────────────────────────────────────────────

describe('ValidationError', () => {
  it('stores field errors and message', () => {
    const error = new ValidationError('Validation failed', [
      { path: 'props.variant.type', message: 'Invalid enum value', code: 'invalid_enum_value' },
      { path: 'version', message: 'Expected string', code: 'invalid_type' },
    ]);

    expect(error.message).toBe('Validation failed');
    expect(error.name).toBe('ValidationError');
    expect(error.fieldErrors).toHaveLength(2);
    expect(error.fieldErrors[0]?.path).toBe('props.variant.type');
  });

  it('formatErrors returns readable string', () => {
    const error = new ValidationError('Validation failed', [
      { path: 'name', message: 'Required', code: 'invalid_type' },
    ]);

    const formatted = error.formatErrors();
    expect(formatted).toContain('name');
    expect(formatted).toContain('Required');
    expect(formatted).toContain('•');
  });

  it('fieldErrors are frozen (immutable)', () => {
    const error = new ValidationError('fail', [
      { path: 'a', message: 'b', code: 'c' },
    ]);

    expect(Object.isFrozen(error.fieldErrors)).toBe(true);
  });
});

// ─── validateComponentIR ────────────────────────────────────────────────────────

describe('validateComponentIR', () => {
  it('returns success for valid button IR', () => {
    const result = validateComponentIR(buttonIR);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.data.name).toBe('button');
      expect(result.data.version).toBe('1.0.0');
    }
  });

  it('returns success for a minimal valid IR', () => {
    const result = validateComponentIR({
      name: 'badge',
      version: '0.1.0',
      props: {
        label: { type: 'string', required: true },
      },
      template: { tag: 'span', children: [{ text: '{{props.label}}' }] },
      styles: { base: 'inline-flex rounded-full px-2 py-1 text-xs font-medium' },
    });
    expect(isOk(result)).toBe(true);
  });

  it('returns error for null input', () => {
    const result = validateComponentIR(null);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
    }
  });

  it('returns error for empty object', () => {
    const result = validateComponentIR({});
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.fieldErrors.length).toBeGreaterThan(0);
    }
  });

  it('returns error with descriptive paths for nested issues', () => {
    const result = validateComponentIR({
      name: 'test',
      version: '1.0.0',
      props: {
        variant: { type: 'enum' }, // Missing "values"
      },
      template: { tag: 'div' },
      styles: {},
    });
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      const paths = result.error.fieldErrors.map((e) => e.path);
      // Should include a path mentioning "props" or "variant"
      expect(paths.some((p) => p.includes('props') || p.includes('values'))).toBe(true);
    }
  });

  it('returns error for non-kebab-case name', () => {
    const result = validateComponentIR({
      name: 'MyButton',
      version: '1.0.0',
      props: {},
      template: { tag: 'button' },
      styles: {},
    });
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.fieldErrors.some((e) => e.path.includes('name'))).toBe(true);
    }
  });
});

// ─── validateDesignTokens ───────────────────────────────────────────────────────

describe('validateDesignTokens', () => {
  it('returns success for valid tokens', () => {
    const result = validateDesignTokens({
      colors: [{ name: 'primary', light: '#2563eb', dark: '#3b82f6' }],
      spacing: { '0': '0px', '4': '1rem' },
    });
    expect(isOk(result)).toBe(true);
  });

  it('returns success for empty tokens', () => {
    const result = validateDesignTokens({});
    expect(isOk(result)).toBe(true);
  });

  it('returns error for invalid color token', () => {
    const result = validateDesignTokens({
      colors: [{ name: 'primary' }], // Missing light/dark
    });
    expect(isErr(result)).toBe(true);
  });
});

// ─── validateTemplateNode ───────────────────────────────────────────────────────

describe('validateTemplateNode', () => {
  it('returns success for an element node', () => {
    const result = validateTemplateNode({
      tag: 'div',
      class: 'container',
      children: [{ text: 'Hello' }],
    });
    expect(isOk(result)).toBe(true);
  });

  it('returns success for a slot node', () => {
    const result = validateTemplateNode({ slot: 'default' });
    expect(isOk(result)).toBe(true);
  });

  it('returns success for a conditional node', () => {
    const result = validateTemplateNode({
      if: 'props.visible',
      then: { tag: 'div' },
    });
    expect(isOk(result)).toBe(true);
  });

  it('returns success for a loop node', () => {
    const result = validateTemplateNode({
      each: 'props.items',
      as: 'item',
      children: [{ text: '{{item}}' }],
    });
    expect(isOk(result)).toBe(true);
  });

  it('returns error for invalid input', () => {
    const result = validateTemplateNode(42);
    expect(isErr(result)).toBe(true);
  });
});

// ─── validateStyleAdapterConfig ─────────────────────────────────────────────────

describe('validateStyleAdapterConfig', () => {
  it('returns success for valid config', () => {
    const result = validateStyleAdapterConfig({ type: 'tailwind' });
    expect(isOk(result)).toBe(true);
  });

  it('returns error for unknown adapter', () => {
    const result = validateStyleAdapterConfig({ type: 'less' });
    expect(isErr(result)).toBe(true);
  });
});
