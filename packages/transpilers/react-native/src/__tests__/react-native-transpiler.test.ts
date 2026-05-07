import { describe, it, expect } from 'vitest';
import { ReactNativeTranspiler } from '../react-native-transpiler.js';

import buttonIR from '../../../../core/src/components/button.ir.json' with { type: 'json' };
import badgeIR from '../../../../core/src/components/badge.ir.json' with { type: 'json' };

describe('ReactNativeTranspiler', () => {
  const transpiler = new ReactNativeTranspiler();

  it('has correct framework metadata', () => {
    expect(transpiler.framework).toBe('react-native');
    expect(transpiler.fileExtension).toBe('.tsx');
    expect(transpiler.language).toBe('typescript');
  });

  it('transpiles button IR successfully', () => {
    const result = transpiler.transpile(buttonIR);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.framework).toBe('react-native');
      expect(result.data.filename).toBe('Button.tsx');
      expect(result.data.code).toContain("from 'react-native'");
      expect(result.data.code).toContain('TouchableOpacity');
      expect(result.data.code).toContain('StyleSheet.create');
    }
  });

  it('transpiles badge IR successfully', () => {
    const result = transpiler.transpile(badgeIR);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.filename).toBe('Badge.tsx');
      expect(result.data.code).toContain('StyleSheet.create');
    }
  });

  it('returns error for invalid input', () => {
    const result = transpiler.transpile(null);
    expect(result.success).toBe(false);
  });
});
