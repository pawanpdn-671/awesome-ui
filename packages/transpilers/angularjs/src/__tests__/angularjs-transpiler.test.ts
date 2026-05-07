import { describe, it, expect } from 'vitest';
import { AngularJSTranspiler } from '../angularjs-transpiler.js';

import buttonIR from '../../../../core/src/components/button.ir.json' with { type: 'json' };
import badgeIR from '../../../../core/src/components/badge.ir.json' with { type: 'json' };

describe('AngularJSTranspiler', () => {
  const transpiler = new AngularJSTranspiler();

  it('has correct framework metadata', () => {
    expect(transpiler.framework).toBe('angularjs');
    expect(transpiler.fileExtension).toBe('.js');
    expect(transpiler.language).toBe('javascript');
  });

  it('transpiles button IR successfully', () => {
    const result = transpiler.transpile(buttonIR);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.framework).toBe('angularjs');
      expect(result.data.filename).toBe('Button.js');
      expect(result.data.code).toContain("angular.module('awesomeui').component('button'");
      expect(result.data.code).toContain('bindings');
      expect(result.data.code).toContain('template');
    }
  });

  it('transpiles badge IR successfully', () => {
    const result = transpiler.transpile(badgeIR);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.filename).toBe('Badge.js');
      expect(result.data.code).toContain('ng-class');
    }
  });

  it('returns error for invalid input', () => {
    const result = transpiler.transpile(null);
    expect(result.success).toBe(false);
  });
});
