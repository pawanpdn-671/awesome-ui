import { describe, it, expect } from 'vitest';
import { SvelteTranspiler } from '../svelte-transpiler.js';

import buttonIR from '../../../../core/src/components/button.ir.json' with { type: 'json' };
import badgeIR from '../../../../core/src/components/badge.ir.json' with { type: 'json' };

describe('SvelteTranspiler', () => {
  const transpiler = new SvelteTranspiler();

  it('has correct framework metadata', () => {
    expect(transpiler.framework).toBe('svelte');
    expect(transpiler.fileExtension).toBe('.svelte');
    expect(transpiler.language).toBe('svelte');
  });

  it('transpiles button IR successfully', () => {
    const result = transpiler.transpile(buttonIR);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.framework).toBe('svelte');
      expect(result.data.filename).toBe('Button.svelte');
      expect(result.data.code).toContain('$props()');
      expect(result.data.code).toContain('<script>');
      expect(result.data.code).toContain('{#if');
      expect(result.data.code).toContain('{@render children?.()');
      expect(result.data.code).toContain('</template>');
    }
  });

  it('transpiles badge IR successfully', () => {
    const result = transpiler.transpile(badgeIR);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.filename).toBe('Badge.svelte');
      expect(result.data.code).toContain('$props()');
      expect(result.data.code).toContain('{@render children?.()');
    }
  });

  it('returns error for invalid input', () => {
    const result = transpiler.transpile(null);
    expect(result.success).toBe(false);
  });
});
