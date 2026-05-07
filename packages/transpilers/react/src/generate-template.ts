/**
 * @module generate-template
 * @description Converts IR template AST nodes to React JSX strings.
 * Handles all 6 node types: element, text, slot, conditional, loop, component ref.
 *
 * @example
 * ```typescript
 * import { generateJSX } from './generate-template.js';
 *
 * const jsx = generateJSX(ir.template, ir.styles, 1);
 * ```
 */

import type { IStyleMap } from '@awesomeui/core';
import {
  parseExpression,
  isPureExpression,
  extractExpression,
  indent,
  toPascalCase,
} from '@awesomeui/transpiler-shared';

/** Shape of a generic template node from the IR (loosely typed for recursive walking) */
interface IRNode {
  // Element
  tag?: string;
  attributes?: Record<string, string>;
  class?: string;
  style?: Record<string, string>;
  children?: IRNode[];
  // Text
  text?: string;
  // Slot
  slot?: string;
  fallback?: string;
  // Conditional
  if?: string;
  then?: IRNode;
  else?: IRNode;
  // Loop
  each?: string;
  as?: string;
  key?: string;
  // Component ref
  component?: string;
  props?: Record<string, string>;
}

/**
 * Converts an IR template node (and its children) to a React JSX string.
 *
 * @param node - The IR template node to convert
 * @param styles - The component's style map
 * @param depth - Current indentation depth
 * @returns The generated JSX string
 *
 * @example
 * ```typescript
 * const jsx = generateJSX({ tag: 'div', children: [{ text: 'Hello' }] }, {}, 1);
 * // '  <div>\n    Hello\n  </div>'
 * ```
 */
export function generateJSX(
  node: IRNode,
  styles: IStyleMap,
  depth: number
): string {
  // Determine node type by checking discriminant keys
  if (node.if !== undefined) {
    return generateConditional(node, styles, depth);
  }
  if (node.each !== undefined) {
    return generateLoop(node, styles, depth);
  }
  if (node.slot !== undefined) {
    return generateSlot(node, depth);
  }
  if (node.text !== undefined) {
    return generateText(node.text, depth);
  }
  if (node.component !== undefined) {
    return generateComponentRef(node, depth);
  }
  if (node.tag !== undefined) {
    return generateElement(node, styles, depth);
  }

  return '';
}

/**
 * Generates JSX for an element node.
 */
function generateElement(
  node: IRNode,
  styles: IStyleMap,
  depth: number
): string {
  const tag = node.tag!;
  const attrs = buildAttributes(node, styles);
  const children = node.children;

  if (!children || children.length === 0) {
    return indent(`<${tag}${attrs} />`, depth);
  }

  const childrenJSX = children
    .map((child) => generateJSX(child, styles, depth + 1))
    .filter((s) => s.length > 0)
    .join('\n');

  return [
    indent(`<${tag}${attrs}>`, depth),
    childrenJSX,
    indent(`</${tag}>`, depth),
  ].join('\n');
}

/**
 * Generates JSX for a text node with expression interpolation.
 */
function generateText(text: string, depth: number): string {
  const segments = parseExpression(text);

  if (segments.length === 1 && segments[0]?.type === 'static') {
    return indent(segments[0].value, depth);
  }

  if (segments.length === 1 && segments[0]?.type === 'expression') {
    return indent(`{${convertExprToReact(segments[0].value)}}`, depth);
  }

  // Mixed: use template literal
  const parts = segments.map((seg) => {
    if (seg.type === 'expression') {
      return `\${${convertExprToReact(seg.value)}}`;
    }
    return seg.value;
  });

  return indent(`{\`${parts.join('')}\`}`, depth);
}

/**
 * Generates JSX for a slot reference.
 * "default" slot → {children}, named slot → {slotName}
 */
function generateSlot(node: IRNode, depth: number): string {
  const slotName = node.slot!;
  const propName = slotName === 'default' ? 'children' : slotName;

  if (node.fallback) {
    return indent(`{${propName} ?? '${node.fallback}'}`, depth);
  }

  return indent(`{${propName}}`, depth);
}

/**
 * Generates JSX for a conditional node.
 * if/then → {condition && (<Then />)}
 * if/then/else → {condition ? (<Then />) : (<Else />)}
 */
function generateConditional(
  node: IRNode,
  styles: IStyleMap,
  depth: number
): string {
  const condition = convertExprToReact(node.if!);
  const thenJSX = node.then ? generateJSX(node.then, styles, 0) : '';

  if (node.else) {
    const elseJSX = generateJSX(node.else, styles, 0);
    return indent(`{${condition} ? (\n${indent(thenJSX, 1)}\n) : (\n${indent(elseJSX, 1)}\n)}`, depth);
  }

  return indent(`{${condition} && (\n${indent(thenJSX, 1)}\n)}`, depth);
}

/**
 * Generates JSX for a loop node.
 */
function generateLoop(
  node: IRNode,
  styles: IStyleMap,
  depth: number
): string {
  const collection = convertExprToReact(node.each!);
  const itemVar = node.as ?? 'item';
  const keyExpr = node.key ? convertExprToReact(node.key) : `index`;
  const needsIndex = !node.key;

  const childrenJSX = (node.children ?? [])
    .map((child) => generateJSX(child, styles, depth + 2))
    .join('\n');

  const params = needsIndex ? `(${itemVar}, index)` : `(${itemVar})`;

  return indent(
    `{${collection}.map(${params} => (\n${indent(`<React.Fragment key={${keyExpr}}>`, depth + 1)}\n${childrenJSX}\n${indent('</React.Fragment>', depth + 1)}\n${indent(')', depth)}))}`,
    depth
  );
}

/**
 * Generates JSX for a component reference node.
 */
function generateComponentRef(node: IRNode, depth: number): string {
  const name = toPascalCase(node.component!);
  const props = node.props;

  if (!props || Object.keys(props).length === 0) {
    return indent(`<${name} />`, depth);
  }

  const propsStr = Object.entries(props)
    .map(([key, value]) => {
      if (isPureExpression(value)) {
        return `${key}={${convertExprToReact(extractExpression(value))}}`;
      }
      return `${key}="${value}"`;
    })
    .join(' ');

  return indent(`<${name} ${propsStr} />`, depth);
}

/**
 * Builds the JSX attribute string for an element node.
 */
function buildAttributes(node: IRNode, _styles: IStyleMap): string {
  const parts: string[] = [];

  // Class binding
  if (node.class) {
    const classExpr = buildClassExpression(node.class);
    parts.push(`className={${classExpr}}`);
  }

  // Static/dynamic attributes
  if (node.attributes) {
    for (const [key, value] of Object.entries(node.attributes)) {
      // Skip 'class' since we handle it above
      if (key === 'class') continue;

      const reactKey = convertAttrName(key);

      if (isPureExpression(value)) {
        parts.push(`${reactKey}={${convertExprToReact(extractExpression(value))}}`);
      } else {
        parts.push(`${reactKey}="${value}"`);
      }
    }
  }

  // Inline style
  if (node.style) {
    const styleEntries = Object.entries(node.style)
      .map(([prop, val]) => {
        const camelProp = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        if (isPureExpression(val)) {
          return `${camelProp}: ${convertExprToReact(extractExpression(val))}`;
        }
        return `${camelProp}: '${val}'`;
      })
      .join(', ');
    parts.push(`style={{ ${styleEntries} }}`);
  }

  if (parts.length === 0) return '';
  return ' ' + parts.join(' ');
}

/**
 * Builds a className expression from IR class binding.
 * Handles {{expr}} interpolation and static strings.
 */
function buildClassExpression(classStr: string): string {
  const segments = parseExpression(classStr);

  if (segments.length === 1 && segments[0]?.type === 'static') {
    return `'${segments[0].value.trim()}'`;
  }

  if (segments.length === 1 && segments[0]?.type === 'expression') {
    return convertExprToReact(segments[0].value);
  }

  // Build template literal for mixed content
  const parts = segments.map((seg) => {
    if (seg.type === 'expression') {
      return `\${${convertExprToReact(seg.value)}}`;
    }
    return seg.value;
  });

  return `\`${parts.join('')}\`.trim()`;
}

/**
 * Converts an IR expression to React-compatible JavaScript.
 * Strips `props.` prefix since React uses destructured props.
 * Converts `styles.x` to the styles object reference.
 */
function convertExprToReact(expr: string): string {
  // Replace props.X with just X (destructured)
  let result = expr.replace(/props\.(\w+)/g, '$1');

  // styles references stay as-is (they reference the styles object)
  // But we need to handle styles.variant[props.variant] → styles.variant[variant]
  result = result.replace(/props\.(\w+)/g, '$1');

  return result;
}

/**
 * Converts HTML attribute names to React JSX attribute names.
 */
function convertAttrName(name: string): string {
  const attrMap: Record<string, string> = {
    class: 'className',
    for: 'htmlFor',
    tabindex: 'tabIndex',
    readonly: 'readOnly',
    maxlength: 'maxLength',
    'aria-hidden': 'aria-hidden',
    'aria-disabled': 'aria-disabled',
    'aria-busy': 'aria-busy',
  };

  return attrMap[name] ?? name;
}
