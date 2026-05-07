import { describe, it, expect } from 'vitest';
import { SolidTranspiler } from '../solid-transpiler.js';

import buttonIR from '../../../../core/src/components/button.ir.json' with { type: 'json' };
import badgeIR from '../../../../core/src/components/badge.ir.json' with { type: 'json' };

describe('SolidTranspiler', () => {
  const transpiler = new SolidTranspiler();

  it('has correct framework metadata', () => {
    expect(transpiler.framework).toBe('solid');
    expect(transpiler.fileExtension).toBe('.tsx');
    expect(transpiler.language).toBe('typescript');
  });

  it('transpiles button IR successfully', () => {
    const result = transpiler.transpile(buttonIR);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.framework).toBe('solid');
      expect(result.data.filename).toBe('Button.tsx');
      expect(result.data.code).toContain("from 'solid-js'");
      expect(result.data.code).toContain(': Component<');
      expect(result.data.code).toContain('<Show');
      expect(result.data.code).toContain('styles.spinner');
      expect(result.data.code).toContain('import {');
    }
  });

  it('transpiles badge IR successfully', () => {
    const result = transpiler.transpile(badgeIR);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.filename).toBe('Badge.tsx');
      expect(result.data.code).toContain(': Component<');
    }
  });

  it('returns error for invalid input', () => {
    const result = transpiler.transpile(null);
    expect(result.success).toBe(false);
  });
});
