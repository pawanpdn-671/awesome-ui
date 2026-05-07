/**
 * @module base-transpiler
 * @description Abstract base class for all framework transpilers.
 * Handles validation, error wrapping, and the common transpile pipeline.
 *
 * @example
 * ```typescript
 * class ReactTranspiler extends BaseTranspiler {
 *   readonly framework = 'react';
 *   readonly fileExtension = '.tsx';
 *   // ... implement abstract methods
 * }
 * ```
 */

import {
  validateComponentIR,
  isOk,
  ok,
  err,
  type Result,
  type IComponentIR,
  ValidationError,
} from '@awesomeui/core';

/**
 * The output of a successful transpilation.
 */
export interface ITranspileOutput {
  /** The generated source code */
  code: string;
  /** Suggested filename (e.g., "Button.tsx", "Button.vue") */
  filename: string;
  /** The programming language of the output */
  language: string;
  /** The framework that was targeted */
  framework: string;
  /** The original component name from the IR */
  componentName: string;
}

/**
 * Options that can be passed to the transpiler.
 */
export interface ITranspileOptions {
  /** Style adapter to use (default: 'tailwind') */
  styleAdapter?: 'tailwind' | 'css' | 'css-in-js' | 'panda';
  /** Whether to include TypeScript types (default: true) */
  typescript?: boolean;
  /** Custom indent size in spaces (default: 2) */
  indentSize?: number;
}

/** Default transpile options */
const DEFAULT_OPTIONS: Required<ITranspileOptions> = {
  styleAdapter: 'tailwind',
  typescript: true,
  indentSize: 2,
};

/**
 * Abstract base class that all framework transpilers extend.
 * Provides the main `transpile()` method which orchestrates validation
 * and delegates to framework-specific abstract methods.
 *
 * @example
 * ```typescript
 * const transpiler = new ReactTranspiler();
 * const result = transpiler.transpile(buttonIR);
 * if (isOk(result)) {
 *   console.log(result.data.code); // React component source
 * }
 * ```
 */
export abstract class BaseTranspiler {
  /** The target framework name */
  abstract readonly framework: string;
  /** The file extension for generated files */
  abstract readonly fileExtension: string;
  /** The output language identifier */
  abstract readonly language: string;

  /**
   * Main transpilation method. Validates the IR, then generates framework code.
   *
   * @param input - A validated IComponentIR or raw unknown data
   * @param options - Optional transpilation options
   * @returns Result with the transpiled output or a validation error
   */
  transpile(
    input: IComponentIR | unknown,
    options?: ITranspileOptions
  ): Result<ITranspileOutput, ValidationError> {
    // Validate if raw input
    let ir: IComponentIR;
    const validationResult = validateComponentIR(input);
    if (isOk(validationResult)) {
      ir = validationResult.data;
    } else {
      return err(validationResult.error);
    }

    const mergedOptions: Required<ITranspileOptions> = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    try {
      const code = this.generate(ir, mergedOptions);
      const componentName = this.getComponentName(ir.name);

      return ok({
        code,
        filename: `${componentName}${this.fileExtension}`,
        language: this.language,
        framework: this.framework,
        componentName,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown transpilation error';
      return err(new ValidationError(`Transpilation failed: ${message}`, []));
    }
  }

  /**
   * Generate the complete component code. Subclasses must implement this.
   *
   * @param ir - The validated component IR
   * @param options - Resolved transpilation options
   * @returns The generated source code string
   */
  protected abstract generate(ir: IComponentIR, options: Required<ITranspileOptions>): string;

  /**
   * Converts a kebab-case IR component name to the framework's naming convention.
   * Default implementation returns PascalCase. Override for different conventions.
   *
   * @param name - The kebab-case component name from IR
   * @returns The framework-appropriate component name
   */
  protected getComponentName(name: string): string {
    return name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
  }
}
