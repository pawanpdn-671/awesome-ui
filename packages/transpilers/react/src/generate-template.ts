import type { IStyleMap } from '@awesomeui/core';
import {
  parseExpression,
  isPureExpression,
  extractExpression,
  indent,
  toPascalCase,
} from '@awesomeui/transpiler-shared';

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

export function generateJSX(
  node: IRNode,
  styles: IStyleMap,
  depth: number,
  isRoot = false
): string {
  if (node.if !== undefined) {
    return generateConditional(node, styles, depth, isRoot);
  }
  if (node.each !== undefined) {
    return generateLoop(node, styles, depth, isRoot);
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
    return generateElement(node, styles, depth, isRoot);
  }

  return '';
}

function generateElement(
  node: IRNode,
  styles: IStyleMap,
  depth: number,
  isRoot: boolean
): string {
  const tag = node.tag!;
  const attrs = buildAttributes(node, styles, isRoot);
  const children = node.children;

  if (!children || children.length === 0) {
    return indent(`<${tag}${attrs} />`, depth);
  }

  const childrenJSX = children
    .map((child) => generateJSX(child, styles, depth + 1, false))
    .filter((s) => s.length > 0)
    .join('\n');

  return [
    indent(`<${tag}${attrs}>`, depth),
    childrenJSX,
    indent(`</${tag}>`, depth),
  ].join('\n');
}

function generateText(text: string, depth: number): string {
  const segments = parseExpression(text);

  if (segments.length === 1 && segments[0]?.type === 'static') {
    return indent(segments[0].value, depth);
  }

  if (segments.length === 1 && segments[0]?.type === 'expression') {
    return indent(`{${convertExprToReact(segments[0].value)}}`, depth);
  }

  const parts = segments.map((seg) => {
    if (seg.type === 'expression') {
      return `\${${convertExprToReact(seg.value)}}`;
    }
    return seg.value;
  });

  return indent(`{\`${parts.join('')}\`}`, depth);
}

function generateSlot(node: IRNode, depth: number): string {
  const slotName = node.slot!;
  const propName = slotName === 'default' ? 'children' : slotName;

  if (node.fallback) {
    return indent(`{${propName} ?? '${node.fallback}'}`, depth);
  }

  return indent(`{${propName}}`, depth);
}

function generateConditional(
  node: IRNode,
  styles: IStyleMap,
  depth: number,
  _isRoot: boolean
): string {
  const condition = convertExprToReact(node.if!);
  const thenJSX = node.then ? generateJSX(node.then, styles, 0, false) : '';

  if (node.else) {
    const elseJSX = generateJSX(node.else, styles, 0, false);
    return indent(`{${condition} ? (\n${indent(thenJSX, 1)}\n) : (\n${indent(elseJSX, 1)}\n)}`, depth);
  }

  return indent(`{${condition} && (\n${indent(thenJSX, 1)}\n)}`, depth);
}

function generateLoop(
  node: IRNode,
  styles: IStyleMap,
  depth: number,
  _isRoot: boolean
): string {
  const collection = convertExprToReact(node.each!);
  const itemVar = node.as ?? 'item';
  const keyExpr = node.key ? convertExprToReact(node.key) : `index`;
  const needsIndex = !node.key;

  const childrenJSX = (node.children ?? [])
    .map((child) => generateJSX(child, styles, depth + 2, false))
    .join('\n');

  const params = needsIndex ? `(${itemVar}, index)` : `(${itemVar})`;

  return indent(
    `{${collection}.map(${params} => (\n${indent(`<React.Fragment key={${keyExpr}}>`, depth + 1)}\n${childrenJSX}\n${indent('</React.Fragment>', depth + 1)}\n${indent(')', depth)}))}`,
    depth
  );
}

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

function buildAttributes(node: IRNode, _styles: IStyleMap, isRoot: boolean): string {
  const parts: string[] = [];

  if (node.class) {
    const classExpr = buildClassExpression(node.class, isRoot);
    parts.push(`className={${classExpr}}`);
  }

  if (node.attributes) {
    for (const [key, value] of Object.entries(node.attributes)) {
      if (key === 'class') continue;

      const reactKey = convertAttrName(key);

      if (isPureExpression(value)) {
        parts.push(`${reactKey}={${convertExprToReact(extractExpression(value))}}`);
      } else {
        parts.push(`${reactKey}="${value}"`);
      }
    }
  }

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

function buildClassExpression(classStr: string, includeClassName: boolean): string {
  const segments = parseExpression(classStr);

  if (segments.length === 1 && segments[0]?.type === 'static') {
    const staticVal = segments[0].value.trim();
    if (includeClassName && staticVal) {
      return `cn('${staticVal}', className)`;
    }
    if (includeClassName) {
      return 'className';
    }
    return `'${staticVal}'`;
  }

  if (segments.length === 1 && segments[0]?.type === 'expression') {
    const expr = convertExprToReact(segments[0].value);
    if (includeClassName) {
      return `cn(${expr}, className)`;
    }
    return expr;
  }

  const args: string[] = [];
  let staticBuf = '';

  for (const seg of segments) {
    if (seg.type === 'static') {
      staticBuf += seg.value;
    } else {
      if (staticBuf.trim()) {
        args.push(`'${staticBuf.trim()}'`);
      }
      staticBuf = '';
      args.push(toCnArg(convertExprToReact(seg.value)));
    }
  }

  if (staticBuf.trim()) {
    args.push(`'${staticBuf.trim()}'`);
  }

  if (includeClassName) {
    args.push('className');
  }

  if (args.length === 0) {
    return includeClassName ? 'className' : "''";
  }

  if (args.length === 1) {
    return args[0]!;
  }

  return `cn(${args.join(', ')})`;
}

function toCnArg(expr: string): string {
  const ternaryMatch = expr.match(/^(.+?)\s*\?\s*(styles\.[^\s]+)\s*:\s*''$/);
  if (ternaryMatch) {
    return `${ternaryMatch[1]} && ${ternaryMatch[2]}`;
  }

  return expr;
}

function convertExprToReact(expr: string): string {
  let result = expr.replace(/props\.(\w+)/g, '$1');
  result = result.replace(/props\.(\w+)/g, '$1');
  return result;
}

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
