/**
 * @module react-transpiler.test
 * @description Tests for the React transpiler including snapshot tests.
 */

import { describe, it, expect } from 'vitest';
import { ReactTranspiler } from '../react-transpiler.js';
import { isOk, isErr } from '@awesomeui/core';

// Button IR fixture (inline to avoid JSON import issues)
const buttonIR = {
  name: 'button',
  version: '1.0.0',
  description: 'Button component',
  category: 'primitive',
  props: {
    variant: { type: 'enum', values: ['primary', 'secondary', 'outline'], default: 'primary', description: 'Visual style' },
    size: { type: 'enum', values: ['sm', 'md', 'lg'], default: 'md', description: 'Size' },
    disabled: { type: 'boolean', default: false, description: 'Disabled state' },
    loading: { type: 'boolean', default: false, description: 'Loading state' },
  },
  slots: {
    default: { description: 'Button label' },
    icon: { description: 'Icon slot' },
  },
  events: {
    onClick: { description: 'Click handler' },
  },
  template: {
    tag: 'button',
    attributes: { type: 'button', disabled: '{{props.disabled}}' },
    class: '{{styles.base}} {{styles.variant[props.variant]}} {{styles.size[props.size]}}',
    children: [
      { if: 'props.loading', then: { tag: 'span', class: '{{styles.spinner}}' } },
      { slot: 'icon' },
      { slot: 'default', fallback: 'Button' },
    ],
  },
  styles: {
    base: 'inline-flex items-center justify-center rounded-md font-medium',
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
    },
    size: { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-base', lg: 'h-12 px-6 text-lg' },
    spinner: 'h-4 w-4 animate-spin',
  },
} as const;

describe('ReactTranspiler', () => {
  const transpiler = new ReactTranspiler();

  it('transpiles button IR to React TSX', () => {
    const result = transpiler.transpile(buttonIR);
    expect(isOk(result)).toBe(true);

    if (isOk(result)) {
      expect(result.data.framework).toBe('react');
      expect(result.data.filename).toBe('Button.tsx');
      expect(result.data.language).toBe('typescript');
      expect(result.data.componentName).toBe('Button');
    }
  });

  it('generates valid React import', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain("import React from 'react'");
    }
  });

  it('generates a props interface', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('export interface ButtonProps');
      expect(result.data.code).toContain("variant?: 'primary' | 'secondary' | 'outline'");
      expect(result.data.code).toContain("size?: 'sm' | 'md' | 'lg'");
      expect(result.data.code).toContain('disabled?: boolean');
      expect(result.data.code).toContain('loading?: boolean');
    }
  });

  it('generates slots as React.ReactNode props', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('children?: React.ReactNode');
      expect(result.data.code).toContain('icon?: React.ReactNode');
    }
  });

  it('generates event handlers in props', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('onClick?:');
    }
  });

  it('generates forwardRef component', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('React.forwardRef');
    }
  });

  it('generates styles object', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('const styles = {');
      expect(result.data.code).toContain("base: 'inline-flex items-center justify-center rounded-md font-medium'");
    }
  });

  it('generates displayName', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain("Button.displayName = 'Button'");
    }
  });

  it('snapshot: button component output', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toMatchSnapshot();
    }
  });

  it('returns error for invalid IR', () => {
    const result = transpiler.transpile({ invalid: true });
    expect(isErr(result)).toBe(true);
  });

  it('transpiles a minimal component', () => {
    const minimal = {
      name: 'divider',
      version: '1.0.0',
      props: {},
      template: { tag: 'hr' },
      styles: { base: 'border-t border-gray-200' },
    };
    const result = transpiler.transpile(minimal);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.data.filename).toBe('Divider.tsx');
      expect(result.data.code).toContain('Divider');
    }
  });
});
