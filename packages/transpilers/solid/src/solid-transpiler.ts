import type { IComponentIR, IPropsMap, ISlotsMap, IEventsMap, IStyleMap } from '@awesomeui/core';
import {
  BaseTranspiler,
  type ITranspileOptions,
  parseExpression,
  isPureExpression,
  extractExpression,
  toPascalCase,
  indent,
  irTypeToTSBase,
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

const HTML_TO_SOLID: Record<string, string> = {
  svg: 'svg',
};

export class SolidTranspiler extends BaseTranspiler {
  readonly framework = 'solid';
  readonly fileExtension = '.tsx';
  readonly language = 'typescript';

  protected generate(ir: IComponentIR, _options: Required<ITranspileOptions>): string {
    const componentName = this.getComponentName(ir.name);
    const sections: string[] = [];

    sections.push(this.generateImports());
    sections.push(this.generateStylesObject(ir));
    sections.push(this.generatePropsInterface(componentName, ir.props, ir.slots, ir.events));
    sections.push(this.generateComponent(ir, componentName));

    return sections.join('\n\n') + '\n';
  }

  private generateImports(): string {
    return [
      "import { createSignal, createEffect, Show, For, Switch, Match, type Component } from 'solid-js';",
    ].join('\n');
  }

  private generateStylesObject(ir: IComponentIR): string {
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

    lines.push('} as const;');
    return lines.join('\n');
  }

  private generatePropsInterface(name: string, props: IPropsMap, slots?: ISlotsMap, events?: IEventsMap): string {
    const lines: string[] = [];
    lines.push(`interface ${name}Props {`);

    for (const [propName, def] of Object.entries(props)) {
      const description = def.description;
      if (description) lines.push(`  /** ${description} */`);
      const tsType = this.propToSolidType(def.type, def.values);
      const optional = def.required ? '' : '?';
      lines.push(`  ${propName}${optional}: ${tsType};`);
    }

    if (slots) {
      for (const [slotName] of Object.entries(slots)) {
        const prop = slotName === 'default' ? 'children' : slotName;
        lines.push(`  ${prop}?: JSX.Element;`);
      }
    }

    if (events) {
      for (const eventName of Object.keys(events)) {
        const handler = this.eventToSolid(eventName);
        lines.push(`  ${handler}?: (...args: unknown[]) => void;`);
      }
    }

    lines.push('  class?: string;');
    lines.push('}');
    return lines.join('\n');
  }

  private eventToSolid(eventName: string): string {
    return eventName;
  }

  private propToSolidType(type: string, values?: string[]): string {
    if (type === 'enum' && values) {
      return values.map((v) => `'${v}'`).join(' | ');
    }
    if (type === 'slot') {
      return 'JSX.Element';
    }
    return irTypeToTSBase(type);
  }

  private generateComponent(ir: IComponentIR, componentName: string): string {
    const propsStr = this.generatePropsDestructure(ir.props, ir.slots, ir.events);
    const jsxBody = this.generateJSX(ir.template as IRNode, ir.styles, 2);

    const lines: string[] = [];
    lines.push(
      `const ${componentName}: Component<${componentName}Props> = (${propsStr}) => {`
    );
    lines.push(`  return (`);
    lines.push(jsxBody);
    lines.push(`  );`);
    lines.push(`};`);
    lines.push('');
    lines.push(`export default ${componentName};`);

    return lines.join('\n');
  }

  private generatePropsDestructure(props: IPropsMap, slots?: ISlotsMap, events?: IEventsMap): string {
    const parts: string[] = [];

    for (const [name, def] of Object.entries(props)) {
      if (def.default !== undefined) {
        const defaultValue = typeof def.default === 'string' ? `'${def.default}'` : String(def.default);
        parts.push(`${name} = ${defaultValue}`);
      } else {
        parts.push(name);
      }
    }

    if (slots) {
      for (const slotName of Object.keys(slots)) {
        parts.push(slotName === 'default' ? 'children' : slotName);
      }
    }

    if (events) {
      for (const eventName of Object.keys(events)) {
        parts.push(eventName);
      }
    }

    parts.push('class');

    return `{ ${parts.join(', ')} }`;
  }

  private generateJSX(node: IRNode, styles: IStyleMap, depth: number): string {
    if (node.if !== undefined) return this.generateConditional(node, styles, depth);
    if (node.each !== undefined) return this.generateLoop(node, styles, depth);
    if (node.slot !== undefined) return this.generateSlot(node, depth);
    if (node.text !== undefined) return this.generateText(node.text, depth);
    if (node.component !== undefined) return this.generateComponentRef(node, depth);
    if (node.tag !== undefined) return this.generateElement(node, styles, depth);
    return '';
  }

  private generateElement(node: IRNode, styles: IStyleMap, depth: number): string {
    const tag = node.tag!;
    const attrs = this.buildSolidAttributes(node);
    const children = node.children;

    if (!children || children.length === 0) {
      return indent(`<${tag}${attrs} />`, depth);
    }

    const childrenJSX = children
      .map((child) => this.generateJSX(child, styles, depth + 1))
      .filter((s) => s.length > 0)
      .join('\n');

    return [
      indent(`<${tag}${attrs}>`, depth),
      childrenJSX,
      indent(`</${tag}>`, depth),
    ].join('\n');
  }

  private generateText(text: string, depth: number): string {
    const segments = parseExpression(text);

    if (segments.length === 1 && segments[0]?.type === 'static') {
      return indent(segments[0].value, depth);
    }

    if (segments.length === 1 && segments[0]?.type === 'expression') {
      return indent(`{${this.convertExprToSolid(segments[0].value)}}`, depth);
    }

    const parts = segments.map((seg) => {
      if (seg.type === 'expression') {
        return `\${${this.convertExprToSolid(seg.value)}}`;
      }
      return seg.value;
    });

    return indent(`{\`${parts.join('')}\`}`, depth);
  }

  private generateSlot(node: IRNode, depth: number): string {
    const slotName = node.slot!;
    const propName = slotName === 'default' ? 'children' : slotName;

    if (node.fallback) {
      return indent(`{${propName} ?? '${node.fallback}'}`, depth);
    }

    return indent(`{${propName}}`, depth);
  }

  private generateConditional(node: IRNode, styles: IStyleMap, depth: number): string {
    const condition = this.convertExprToSolid(node.if!);

    const thenContent = node.then ? this.generateJSX(node.then, styles, 0) : '';
    const elseContent = node.else ? this.generateJSX(node.else, styles, 0) : '';

    if (node.else) {
      return [
        indent(`<Switch>`, depth),
        indent(`<Match when={${condition}}>`, depth + 1),
        indent(thenContent, depth + 2),
        indent(`</Match>`, depth + 1),
        indent(`<Match when={!(${condition})}>`, depth + 1),
        indent(elseContent, depth + 2),
        indent(`</Match>`, depth + 1),
        indent(`</Switch>`, depth),
      ].join('\n');
    }

    return indent(`<Show when={${condition}}>${thenContent}</Show>`, depth);
  }

  private generateLoop(node: IRNode, styles: IStyleMap, depth: number): string {
    const collection = this.convertExprToSolid(node.each!);
    const itemVar = node.as ?? 'item';
    const keyExpr = node.key ? this.convertExprToSolid(node.key) : `${itemVar}`;

    const children = node.children ?? [];
    const childrenJSX = children
      .map((child) => this.generateJSX(child, styles, 0))
      .join('\n');

    return indent(
      `<For each={${collection}}>{(item: typeof ${itemVar}) => (\n${childrenJSX}\n)}</For>`,
      depth
    );
  }

  private generateComponentRef(node: IRNode, depth: number): string {
    const name = toPascalCase(node.component!);
    const props = node.props;

    if (!props || Object.keys(props).length === 0) {
      return indent(`<${name} />`, depth);
    }

    const propsStr = Object.entries(props)
      .map(([key, value]) => {
        if (isPureExpression(value)) {
          return `${key}={${this.convertExprToSolid(extractExpression(value))}}`;
        }
        return `${key}="${value}"`;
      })
      .join(' ');

    return indent(`<${name} ${propsStr} />`, depth);
  }

  private buildSolidAttributes(node: IRNode): string {
    const parts: string[] = [];

    if (node.class) {
      const classBinding = this.buildSolidClassBinding(node.class);
      parts.push(classBinding);
    }

    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        if (key === 'class') continue;
        if (key === 'style') continue;

        const solidKey = this.attrToSolid(key);

        if (isPureExpression(value)) {
          const expr = this.convertExprToSolid(extractExpression(value));
          if (key === 'disabled' || key === 'checked' || key === 'required' || key === 'readonly') {
            parts.push(`${solidKey}={${expr}}`);
          } else {
            parts.push(`${solidKey}={${expr}}`);
          }
        } else {
          parts.push(`${solidKey}="${value}"`);
        }
      }
    }

    if (node.style) {
      const styleEntries = Object.entries(node.style)
        .map(([prop, val]) => {
          const camelProp = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
          if (isPureExpression(val)) {
            return `${camelProp}: ${this.convertExprToSolid(extractExpression(val))}`;
          }
          return `${camelProp}: '${val}'`;
        })
        .join(', ');
      parts.push(`style={{ ${styleEntries} }}`);
    }

    if (parts.length === 0) return '';
    return ' ' + parts.join(' ');
  }

  private buildSolidClassBinding(classStr: string): string {
    const segments = parseExpression(classStr);

    if (segments.length === 1 && segments[0]?.type === 'static') {
      return `class="${segments[0].value.trim()}"`;
    }

    if (segments.length === 1 && segments[0]?.type === 'expression') {
      const expr = this.convertExprToSolid(segments[0].value);
      return `class={${expr}}`;
    }

    const staticClasses: string[] = [];
    const dynamicClasses: string[] = [];

    for (const seg of segments) {
      if (seg.type === 'expression') {
        dynamicClasses.push(this.convertExprToSolid(seg.value));
      } else {
        staticClasses.push(seg.value.trim());
      }
    }

    const classParts: string[] = [];
    if (staticClasses.filter(Boolean).length > 0) {
      classParts.push(`'${staticClasses.filter(Boolean).join(' ')}'`);
    }
    classParts.push(...dynamicClasses);

    if (classParts.length === 1) {
      return `class={${classParts[0]}}`;
    }

    return `class={[${classParts.join(', ')}].filter(Boolean).join(' ')}`;
  }

  private attrToSolid(attr: string): string {
    const map: Record<string, string> = {
      class: 'class',
      tabindex: 'tabIndex',
      readonly: 'readOnly',
      maxlength: 'maxLength',
      colspan: 'colspan',
    };
    return map[attr] ?? attr;
  }

  private convertExprToSolid(expr: string): string {
    return expr
      .replace(/props\.(\w+)/g, '$1')
      .replace(/styles\.(\w+)(\[(\w+)\])?/g, 'styles.$1$2');
  }
}
