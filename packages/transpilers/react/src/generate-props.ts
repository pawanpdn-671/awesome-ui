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

import type { IPropsMap, ISlotsMap, IEventsMap } from '@awesomeui/core';
import { irTypeToTSBase } from '@awesomeui/transpiler-shared';

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
export function generatePropsInterface(
  componentName: string,
  props: IPropsMap,
  slots?: ISlotsMap,
  events?: IEventsMap
): string {
  const lines: string[] = [];
  lines.push(`export interface ${componentName}Props {`);

  // Generate prop types
  for (const [name, def] of Object.entries(props)) {
    const description = def.description;
    if (description) {
      lines.push(`  /** ${description} */`);
    }

    const tsType = propToTSType(def.type, def.values);
    const optional = def.required ? '' : '?';
    lines.push(`  ${name}${optional}: ${tsType};`);
  }

  // Generate slot props as React.ReactNode
  if (slots) {
    for (const [name, def] of Object.entries(slots)) {
      if (name === 'default') {
        const description = typeof def === 'string' ? def : def.description;
        if (description) {
          lines.push(`  /** ${description} */`);
        }
        lines.push('  children?: React.ReactNode;');
      } else {
        const description = typeof def === 'string' ? def : def.description;
        if (description) {
          lines.push(`  /** ${description} */`);
        }
        lines.push(`  ${name}?: React.ReactNode;`);
      }
    }
  }

  // Generate event handler props
  if (events) {
    for (const [name, def] of Object.entries(events)) {
      const description = typeof def === 'string' ? def : def.description;
      if (description) {
        lines.push(`  /** ${description} */`);
      }
      // React convention: onClick, onFocus, etc.
      lines.push(`  ${name}?: (...args: unknown[]) => void;`);
    }
  }

  // Add className and ref
  lines.push('  /** Additional CSS class names */');
  lines.push('  className?: string;');
  lines.push('  /** Ref forwarding */');
  lines.push('  ref?: React.Ref<HTMLElement>;');

  lines.push('}');

  return lines.join('\n');
}

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
export function generatePropsDestructure(
  props: IPropsMap,
  slots?: ISlotsMap,
  events?: IEventsMap
): string {
  const parts: string[] = [];

  for (const [name, def] of Object.entries(props)) {
    if (def.default !== undefined) {
      const defaultValue = formatDefault(def.default);
      parts.push(`${name} = ${defaultValue}`);
    } else {
      parts.push(name);
    }
  }

  // Slots → prop names
  if (slots) {
    for (const slotName of Object.keys(slots)) {
      if (slotName === 'default') {
        parts.push('children');
      } else {
        parts.push(slotName);
      }
    }
  }

  // Events → handler prop names
  if (events) {
    for (const eventName of Object.keys(events)) {
      parts.push(eventName);
    }
  }

  parts.push('className');
  parts.push('ref');
  parts.push('...restProps');

  return `{ ${parts.join(', ')} }`;
}

/**
 * Maps an IR prop type to a TypeScript type string, handling enums as union types.
 */
function propToTSType(type: string, values?: string[]): string {
  if (type === 'enum' && values) {
    return values.map((v) => `'${v}'`).join(' | ');
  }
  if (type === 'slot') {
    return 'React.ReactNode';
  }
  return irTypeToTSBase(type);
}

/**
 * Formats a default value for use in code generation.
 */
function formatDefault(value: unknown): string {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }
  return JSON.stringify(value);
}
