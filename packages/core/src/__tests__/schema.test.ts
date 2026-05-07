/**
 * @module schema.test
 * @description Unit tests for all AwesomeUI IR Zod schemas.
 * Tests valid parsing, rejection of invalid data, and edge cases.
 */

import { describe, it, expect } from 'vitest';
import {
  ComponentIRSchema,
  PropDefinitionSchema,
  TemplateNodeSchema,
  DesignTokensSchema,
  StyleAdapterConfigSchema,
  StyleMapSchema,
  SemVerSchema,
  SlotDefinitionSchema,
  EventDefinitionSchema,
  AccessibilitySchema,
  ComponentDependencySchema,
} from '../schema.js';

// eslint-disable-next-line @typescript-eslint/no-require-imports -- JSON fixture
import buttonIR from '../components/button.ir.json';

// ─── SemVer ─────────────────────────────────────────────────────────────────────

describe('SemVerSchema', () => {
  it('accepts valid semver strings', () => {
    expect(SemVerSchema.parse('1.0.0')).toBe('1.0.0');
    expect(SemVerSchema.parse('0.0.1')).toBe('0.0.1');
    expect(SemVerSchema.parse('12.34.56')).toBe('12.34.56');
  });

  it('rejects invalid semver strings', () => {
    expect(() => SemVerSchema.parse('1.0')).toThrow();
    expect(() => SemVerSchema.parse('v1.0.0')).toThrow();
    expect(() => SemVerSchema.parse('1.0.0-beta')).toThrow();
    expect(() => SemVerSchema.parse('')).toThrow();
  });
});

// ─── PropDefinition ─────────────────────────────────────────────────────────────

describe('PropDefinitionSchema', () => {
  it('accepts a simple boolean prop', () => {
    const result = PropDefinitionSchema.parse({
      type: 'boolean',
      default: false,
    });
    expect(result.type).toBe('boolean');
    expect(result.default).toBe(false);
  });

  it('accepts an enum prop with values', () => {
    const result = PropDefinitionSchema.parse({
      type: 'enum',
      values: ['sm', 'md', 'lg'],
      default: 'md',
      description: 'Size of the component',
    });
    expect(result.type).toBe('enum');
    expect(result.values).toEqual(['sm', 'md', 'lg']);
  });

  it('rejects an enum prop without values', () => {
    expect(() =>
      PropDefinitionSchema.parse({
        type: 'enum',
        default: 'sm',
      })
    ).toThrow();
  });

  it('rejects an enum prop with empty values array', () => {
    expect(() =>
      PropDefinitionSchema.parse({
        type: 'enum',
        values: [],
      })
    ).toThrow();
  });

  it('rejects an unknown prop type', () => {
    expect(() =>
      PropDefinitionSchema.parse({
        type: 'bigint',
      })
    ).toThrow();
  });

  it('accepts all valid prop types', () => {
    const types = ['string', 'number', 'boolean', 'object', 'array', 'function', 'slot'] as const;
    for (const type of types) {
      expect(PropDefinitionSchema.parse({ type }).type).toBe(type);
    }
  });
});

// ─── Template Nodes ─────────────────────────────────────────────────────────────

describe('TemplateNodeSchema', () => {
  it('parses a text node', () => {
    const node = TemplateNodeSchema.parse({ text: 'Hello world' });
    expect(node).toEqual({ text: 'Hello world' });
  });

  it('parses a text node with interpolation', () => {
    const node = TemplateNodeSchema.parse({ text: '{{props.label}}' });
    expect(node).toEqual({ text: '{{props.label}}' });
  });

  it('parses a slot node', () => {
    const node = TemplateNodeSchema.parse({ slot: 'default', fallback: 'Click me' });
    expect(node).toEqual({ slot: 'default', fallback: 'Click me' });
  });

  it('parses an element node with children', () => {
    const node = TemplateNodeSchema.parse({
      tag: 'div',
      class: 'container',
      children: [
        { text: 'Hello' },
        { tag: 'span', children: [{ text: 'World' }] },
      ],
    });
    expect(node).toHaveProperty('tag', 'div');
    expect(node).toHaveProperty('class', 'container');
  });

  it('parses a conditional node', () => {
    const node = TemplateNodeSchema.parse({
      if: 'props.loading',
      then: { tag: 'span', class: 'spinner' },
      else: { slot: 'default' },
    });
    expect(node).toHaveProperty('if', 'props.loading');
  });

  it('parses a conditional node without else', () => {
    const node = TemplateNodeSchema.parse({
      if: 'props.loading',
      then: { tag: 'span', class: 'spinner' },
    });
    expect(node).toHaveProperty('if', 'props.loading');
    expect(node).not.toHaveProperty('else');
  });

  it('parses a loop node', () => {
    const node = TemplateNodeSchema.parse({
      each: 'props.items',
      as: 'item',
      key: 'item.id',
      children: [{ tag: 'li', children: [{ text: '{{item.label}}' }] }],
    });
    expect(node).toHaveProperty('each', 'props.items');
    expect(node).toHaveProperty('as', 'item');
  });

  it('parses a component reference node', () => {
    const node = TemplateNodeSchema.parse({
      component: 'icon',
      props: { name: '{{props.iconName}}', size: '16' },
    });
    expect(node).toHaveProperty('component', 'icon');
  });

  it('parses deeply nested template trees', () => {
    const node = TemplateNodeSchema.parse({
      tag: 'div',
      children: [
        {
          if: 'props.show',
          then: {
            tag: 'ul',
            children: [
              {
                each: 'props.items',
                as: 'item',
                children: [
                  {
                    tag: 'li',
                    children: [
                      { component: 'icon', props: { name: '{{item.icon}}' } },
                      { text: '{{item.label}}' },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    });
    expect(node).toHaveProperty('tag', 'div');
  });
});

// ─── Style Map ──────────────────────────────────────────────────────────────────

describe('StyleMapSchema', () => {
  it('accepts utility-class string values', () => {
    const styles = StyleMapSchema.parse({
      base: 'flex items-center',
      primary: 'bg-blue-500 text-white',
    });
    expect(styles['base']).toBe('flex items-center');
  });

  it('accepts CSS property map values', () => {
    const styles = StyleMapSchema.parse({
      base: { display: 'flex', 'align-items': 'center' },
    });
    expect(styles['base']).toEqual({ display: 'flex', 'align-items': 'center' });
  });

  it('accepts variant group maps (nested record)', () => {
    const styles = StyleMapSchema.parse({
      base: 'flex',
      variant: {
        primary: 'bg-blue-500',
        secondary: 'bg-gray-100',
      },
    });
    expect(styles['variant']).toEqual({
      primary: 'bg-blue-500',
      secondary: 'bg-gray-100',
    });
  });
});

// ─── Design Tokens ──────────────────────────────────────────────────────────────

describe('DesignTokensSchema', () => {
  it('accepts a full token set', () => {
    const tokens = DesignTokensSchema.parse({
      colors: [
        { name: 'primary', light: '#2563eb', dark: '#3b82f6' },
        { name: 'secondary', light: '#6b7280', dark: '#9ca3af' },
      ],
      spacing: { '0': '0px', '1': '0.25rem', '2': '0.5rem', '4': '1rem' },
      typography: {
        fontFamilies: { sans: 'Inter, sans-serif' },
        fontSizes: { sm: '0.875rem', base: '1rem' },
        fontWeights: { normal: '400', bold: '700' },
        lineHeights: { normal: '1.5' },
      },
      radius: { none: '0', sm: '0.125rem', md: '0.375rem', full: '9999px' },
      breakpoints: { sm: '640px', md: '768px', lg: '1024px' },
    });
    expect(tokens.colors).toHaveLength(2);
    expect(tokens.spacing?.['1']).toBe('0.25rem');
  });

  it('accepts an empty token set', () => {
    const tokens = DesignTokensSchema.parse({});
    expect(tokens).toEqual({});
  });

  it('accepts a partial token set', () => {
    const tokens = DesignTokensSchema.parse({
      colors: [{ name: 'primary', light: '#fff', dark: '#000' }],
    });
    expect(tokens.colors).toHaveLength(1);
    expect(tokens.spacing).toBeUndefined();
  });
});

// ─── Style Adapter Config ───────────────────────────────────────────────────────

describe('StyleAdapterConfigSchema', () => {
  it('accepts a tailwind adapter', () => {
    const config = StyleAdapterConfigSchema.parse({
      type: 'tailwind',
      config: { prefix: 'aui-' },
    });
    expect(config.type).toBe('tailwind');
  });

  it('accepts all adapter types', () => {
    for (const type of ['tailwind', 'css', 'css-in-js', 'panda'] as const) {
      expect(StyleAdapterConfigSchema.parse({ type }).type).toBe(type);
    }
  });

  it('rejects unknown adapter types', () => {
    expect(() => StyleAdapterConfigSchema.parse({ type: 'sass' })).toThrow();
  });
});

// ─── Slot Definition ────────────────────────────────────────────────────────────

describe('SlotDefinitionSchema', () => {
  it('accepts a simple string description', () => {
    expect(SlotDefinitionSchema.parse('Button content')).toBe('Button content');
  });

  it('accepts a full definition object', () => {
    const slot = SlotDefinitionSchema.parse({
      description: 'Table row content',
      props: {
        index: { type: 'number' },
        item: { type: 'object' },
      },
    });
    expect(slot).toHaveProperty('description', 'Table row content');
  });
});

// ─── Event Definition ───────────────────────────────────────────────────────────

describe('EventDefinitionSchema', () => {
  it('accepts a simple string description', () => {
    expect(EventDefinitionSchema.parse('Click event')).toBe('Click event');
  });

  it('accepts a full definition object', () => {
    const event = EventDefinitionSchema.parse({
      description: 'Fired on click',
      payload: { type: 'MouseEvent' },
    });
    expect(event).toHaveProperty('description', 'Fired on click');
  });
});

// ─── Accessibility ──────────────────────────────────────────────────────────────

describe('AccessibilitySchema', () => {
  it('accepts full accessibility metadata', () => {
    const a11y = AccessibilitySchema.parse({
      role: 'button',
      ariaAttributes: { 'aria-disabled': '{{props.disabled}}' },
      keyboardInteractions: ['Enter: Activate', 'Space: Activate'],
    });
    expect(a11y.role).toBe('button');
    expect(a11y.keyboardInteractions).toHaveLength(2);
  });

  it('accepts empty accessibility', () => {
    expect(AccessibilitySchema.parse({})).toEqual({});
  });
});

// ─── Component Dependency ───────────────────────────────────────────────────────

describe('ComponentDependencySchema', () => {
  it('accepts a dependency with version', () => {
    const dep = ComponentDependencySchema.parse({ name: 'icon', version: '1.0.0' });
    expect(dep.name).toBe('icon');
    expect(dep.version).toBe('1.0.0');
  });

  it('accepts a dependency without version', () => {
    const dep = ComponentDependencySchema.parse({ name: 'tooltip' });
    expect(dep.name).toBe('tooltip');
    expect(dep.version).toBeUndefined();
  });
});

// ─── Component IR (Integration) ─────────────────────────────────────────────────

describe('ComponentIRSchema', () => {
  it('validates the button fixture successfully', () => {
    const result = ComponentIRSchema.safeParse(buttonIR);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('button');
      expect(result.data.version).toBe('1.0.0');
      expect(result.data.category).toBe('primitive');
      expect(Object.keys(result.data.props)).toContain('variant');
      expect(Object.keys(result.data.props)).toContain('size');
      expect(Object.keys(result.data.props)).toContain('disabled');
      expect(Object.keys(result.data.props)).toContain('loading');
    }
  });

  it('validates a minimal component IR', () => {
    const minimal = {
      name: 'divider',
      version: '1.0.0',
      props: {},
      template: { tag: 'hr' },
      styles: { base: 'border-t border-gray-200' },
    };
    const result = ComponentIRSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it('rejects a component with invalid name casing', () => {
    const result = ComponentIRSchema.safeParse({
      name: 'MyButton',
      version: '1.0.0',
      props: {},
      template: { tag: 'button' },
      styles: {},
    });
    expect(result.success).toBe(false);
  });

  it('rejects a component missing required fields', () => {
    const noProps = ComponentIRSchema.safeParse({
      name: 'test',
      version: '1.0.0',
      template: { tag: 'div' },
      styles: {},
    });
    expect(noProps.success).toBe(false);

    const noTemplate = ComponentIRSchema.safeParse({
      name: 'test',
      version: '1.0.0',
      props: {},
      styles: {},
    });
    expect(noTemplate.success).toBe(false);

    const noStyles = ComponentIRSchema.safeParse({
      name: 'test',
      version: '1.0.0',
      props: {},
      template: { tag: 'div' },
    });
    expect(noStyles.success).toBe(false);
  });

  it('accepts a component with all optional fields', () => {
    const full = {
      name: 'data-table',
      version: '2.0.0',
      description: 'A feature-rich data table',
      category: 'data-display',
      props: {
        columns: { type: 'array', required: true, description: 'Column definitions' },
        rows: { type: 'array', required: true, description: 'Row data' },
        sortable: { type: 'boolean', default: false },
      },
      slots: {
        header: { description: 'Custom header content' },
        cell: {
          description: 'Custom cell renderer',
          props: {
            row: { type: 'object' },
            column: { type: 'object' },
          },
        },
      },
      events: {
        onSort: {
          description: 'Fired when a column is sorted',
          payload: { column: 'string', direction: 'asc | desc' },
        },
        onRowClick: 'Fired when a row is clicked',
      },
      template: {
        tag: 'div',
        class: '{{styles.base}}',
        children: [
          { slot: 'header' },
          {
            tag: 'table',
            children: [
              {
                each: 'props.rows',
                as: 'row',
                key: 'row.id',
                children: [
                  {
                    tag: 'tr',
                    children: [{ text: '{{row.name}}' }],
                  },
                ],
              },
            ],
          },
        ],
      },
      styles: {
        base: 'overflow-hidden rounded-lg border border-gray-200',
      },
      tokens: {
        colors: [{ name: 'header-bg', light: '#f9fafb', dark: '#1f2937' }],
      },
      dependencies: [{ name: 'checkbox', version: '1.0.0' }],
      accessibility: {
        role: 'table',
        keyboardInteractions: ['Arrow keys: Navigate cells'],
      },
    };
    const result = ComponentIRSchema.safeParse(full);
    expect(result.success).toBe(true);
  });

  it('enforces kebab-case component names', () => {
    const valid = ['button', 'data-table', 'form-input', 'a', 'my-cool-component'];
    const invalid = ['Button', 'dataTable', 'BUTTON', 'my_button', '-leading', 'trailing-'];

    for (const name of valid) {
      expect(
        ComponentIRSchema.safeParse({
          name,
          version: '1.0.0',
          props: {},
          template: { tag: 'div' },
          styles: {},
        }).success
      ).toBe(true);
    }

    for (const name of invalid) {
      expect(
        ComponentIRSchema.safeParse({
          name,
          version: '1.0.0',
          props: {},
          template: { tag: 'div' },
          styles: {},
        }).success
      ).toBe(false);
    }
  });
});
