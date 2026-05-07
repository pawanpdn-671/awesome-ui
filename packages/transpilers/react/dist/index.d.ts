import { IComponentIR, IPropsMap, ISlotsMap, IEventsMap, IStyleMap } from '@awesomeui/core';
import { BaseTranspiler, ITranspileOptions } from '@awesomeui/transpiler-shared';

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
declare class ReactTranspiler extends BaseTranspiler {
    readonly framework = "react";
    readonly fileExtension = ".tsx";
    readonly language = "typescript";
    /**
     * Generates the complete React component code from validated IR.
     */
    protected generate(ir: IComponentIR, _options: Required<ITranspileOptions>): string;
    /**
     * Generates React import statements.
     */
    private generateImports;
    /**
     * Generates the styles constant object from IR styles.
     * This allows runtime access to variant-based class names.
     */
    private generateStylesObject;
    /**
     * Generates the React functional component with forwardRef.
     */
    private generateComponent;
}

/**
 * @module generate-props
 * @description Generates TypeScript interfaces from IR prop definitions for React components.
 *
 * @example
 * ```typescript
 * import { generatePropsInterface } from '@awesomeui/transpiler-react';
 *
 * const code = generatePropsInterface('Button', ir.props, ir.slots, ir.events);
 * // "export interface ButtonProps { variant?: 'primary' | 'secondary'; ... }"
 * ```
 */

/**
 * Generates a TypeScript interface string from IR prop, slot, and event definitions.
 *
 * @param componentName - PascalCase component name
 * @param props - IR prop definitions
 * @param slots - IR slot definitions (optional)
 * @param events - IR event definitions (optional)
 * @returns Generated TypeScript interface code
 *
 * @example
 * ```typescript
 * generatePropsInterface('Button', {
 *   variant: { type: 'enum', values: ['primary', 'secondary'], default: 'primary' },
 *   disabled: { type: 'boolean', default: false },
 * });
 * // export interface ButtonProps {
 * //   // Visual style variant of the button
 * //   variant?: 'primary' | 'secondary';
 * //   // Whether the button is disabled
 * //   disabled?: boolean;
 * // }
 * ```
 */
declare function generatePropsInterface(componentName: string, props: IPropsMap, slots?: ISlotsMap, events?: IEventsMap): string;
/**
 * Generates the destructured props with defaults for a React functional component.
 *
 * @example
 * ```typescript
 * generatePropsDestructure({
 *   variant: { type: 'enum', values: ['primary'], default: 'primary' },
 *   disabled: { type: 'boolean', default: false },
 * }, { default: 'Button content' });
 * // "{ variant = 'primary', disabled = false, children, className, ref, ...props }"
 * ```
 */
declare function generatePropsDestructure(props: IPropsMap, slots?: ISlotsMap, events?: IEventsMap): string;

interface IRNode {
    tag?: string;
    attributes?: Record<string, string>;
    class?: string;
    style?: Record<string, string>;
    children?: IRNode[];
    text?: string;
    slot?: string;
    fallback?: string;
    if?: string;
    then?: IRNode;
    else?: IRNode;
    each?: string;
    as?: string;
    key?: string;
    component?: string;
    props?: Record<string, string>;
}
declare function generateJSX(node: IRNode, styles: IStyleMap, depth: number, isRoot?: boolean): string;

export { ReactTranspiler, generateJSX, generatePropsDestructure, generatePropsInterface };
