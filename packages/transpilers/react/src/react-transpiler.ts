/**
 * @module react-transpiler
 * @description Transpiles AwesomeUI IR to React TSX functional components.
 * Generates type-safe, production-ready React code with TypeScript interfaces,
 * forwardRef support, and className composition.
 *
 * @example
 * ```typescript
 * import { ReactTranspiler } from '@awesomeui/transpiler-react';
 * import { isOk } from '@awesomeui/core';
 *
 * const transpiler = new ReactTranspiler();
 * const result = transpiler.transpile(buttonIR);
 * if (isOk(result)) {
 *   fs.writeFileSync(result.data.filename, result.data.code);
 * }
 * ```
 */

import { isOk, type IComponentIR, type Result, ValidationError } from '@awesomeui/core';
import {
  BaseTranspiler,
  type ITranspileOptions,
  type ITranspileOutput,
} from '@awesomeui/transpiler-shared';
import { generatePropsInterface, generatePropsDestructure } from './generate-props.js';
import { generateJSX } from './generate-template.js';

/**
 * React/TSX transpiler that converts component IR to React functional components.
 *
 * **Generated output includes:**
 * - TypeScript interface for props
 * - Functional component with forwardRef
 * - Destructured props with defaults
 * - Tailwind CSS className strings (default) or CSS-in-JS
 * - Proper React imports
 *
 * @example
 * ```typescript
 * const transpiler = new ReactTranspiler();
 * const result = transpiler.transpile(buttonIR);
 * if (isOk(result)) {
 *   console.log(result.data.code);
 *   // import React from 'react';
 *   // export interface ButtonProps { ... }
 *   // export const Button = React.forwardRef<HTMLElement, ButtonProps>(...)
 * }
 * ```
 */
export class ReactTranspiler extends BaseTranspiler {
  readonly framework = 'react';
  readonly fileExtension = '.tsx';
  readonly language = 'typescript';

  /**
   * Override to support dynamic file extension and language for JS output.
   */
  transpile(
    input: IComponentIR | unknown,
    options?: ITranspileOptions
  ): Result<ITranspileOutput, ValidationError> {
    const res = super.transpile(input, options);
    if (!isOk(res)) return res;

    const mergedOptions: Required<ITranspileOptions> = {
      styleAdapter: 'tailwind',
      indentSize: 2,
      typescript: true,
      ...options,
    };

    if (!mergedOptions.typescript) {
      res.data.filename = res.data.filename.replace(/\.tsx$/, '.jsx');
      res.data.language = 'javascript';
    }
    return res;
  }

  /**
   * Generates the complete React component code from validated IR.
   */
  protected generate(ir: IComponentIR, options: Required<ITranspileOptions>): string {
    const componentName = this.getComponentName(ir.name);
    const sections: string[] = [];
    const isTs = options.typescript;

    // 1. Imports
    sections.push(this.generateImports());

    // 2. Styles object (for variant lookups in JSX)
    sections.push(this.generateStylesObject(ir, isTs));

    // 3. Props interface (TypeScript only)
    if (isTs) {
      sections.push(generatePropsInterface(componentName, ir.props, ir.slots, ir.events));
    }

    // 4. Component
    sections.push(this.generateComponent(ir, componentName, isTs));

    // 5. Display name
    sections.push(`${componentName}.displayName = '${componentName}';`);

    return sections.join('\n\n') + '\n';
  }

  /**
   * Generates React import statements.
   */
  private generateImports(): string {
    const lines: string[] = [];
    lines.push(`import React from 'react';`);
    lines.push(`import { cn } from '@/lib/utils';`);
    return lines.join('\n');
  }

  /**
   * Generates the styles constant object from IR styles.
   * This allows runtime access to variant-based class names.
   */
  private generateStylesObject(ir: IComponentIR, isTs: boolean): string {
    const lines: string[] = [];
    lines.push('const styles = {');

    for (const [key, value] of Object.entries(ir.styles)) {
      if (typeof value === 'string') {
        lines.push(`  ${key}: '${value}',`);
      } else if (typeof value === 'object' && value !== null) {
        lines.push(`  ${key}: {`);
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === 'string') {
            lines.push(`    ${subKey}: '${subValue}',`);
          } else {
            lines.push(`    ${subKey}: ${JSON.stringify(subValue)},`);
          }
        }
        lines.push('  },');
      }
    }

    lines.push(`}${isTs ? ' as const' : ''};`);
    return lines.join('\n');
  }

  /**
   * Generates the React functional component with forwardRef.
   */
  private generateComponent(ir: IComponentIR, componentName: string, isTs: boolean): string {
    const propsDestructure = generatePropsDestructure(ir.props, ir.slots, ir.events);
    const jsxBody = generateJSX(ir.template as Record<string, unknown>, ir.styles, 2, true);

    const typeParams = isTs ? `<HTMLElement, ${componentName}Props>` : '';
    const lines: string[] = [];
    lines.push(
      `export const ${componentName} = React.forwardRef${typeParams}(function ${componentName}(`
    );
    lines.push(`  ${propsDestructure},`);
    lines.push(`) {`);
    lines.push(`  return (`);
    lines.push(jsxBody);
    lines.push(`  );`);
    lines.push(`});`);

    return lines.join('\n');
  }
}
