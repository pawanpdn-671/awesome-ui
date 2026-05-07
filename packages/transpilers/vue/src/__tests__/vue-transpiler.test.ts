/**
 * @module vue-transpiler.test
 * @description Tests for the Vue transpiler including snapshot tests.
 */

import { describe, it, expect } from 'vitest';
import { VueTranspiler } from '../vue-transpiler.js';
import { isOk, isErr } from '@awesomeui/core';

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

describe('VueTranspiler', () => {
  const transpiler = new VueTranspiler();

  it('transpiles button IR to Vue SFC', () => {
    const result = transpiler.transpile(buttonIR);
    expect(isOk(result)).toBe(true);

    if (isOk(result)) {
      expect(result.data.framework).toBe('vue');
      expect(result.data.filename).toBe('Button.vue');
      expect(result.data.language).toBe('vue');
      expect(result.data.componentName).toBe('Button');
    }
  });

  it('generates script setup block', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('<script setup lang="ts">');
      expect(result.data.code).toContain('</script>');
    }
  });

  it('generates template block', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('<template>');
      expect(result.data.code).toContain('</template>');
    }
  });

  it('generates Props interface', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('interface Props');
      expect(result.data.code).toContain("variant?: 'primary' | 'secondary' | 'outline'");
    }
  });

  it('generates defineProps with withDefaults', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('withDefaults(defineProps<Props>()');
      expect(result.data.code).toContain("variant: 'primary'");
    }
  });

  it('generates defineEmits', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('defineEmits');
      expect(result.data.code).toContain("'click'");
    }
  });

  it('generates Vue slots', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('<slot');
      expect(result.data.code).toContain('name="icon"');
    }
  });

  it('generates v-if directive', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('v-if=');
    }
  });

  it('generates styles object', () => {
    const result = transpiler.transpile(buttonIR);
    if (isOk(result)) {
      expect(result.data.code).toContain('const styles = {');
    }
  });

  it('snapshot: button SFC output', () => {
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
      expect(result.data.filename).toBe('Divider.vue');
    }
  });
});
