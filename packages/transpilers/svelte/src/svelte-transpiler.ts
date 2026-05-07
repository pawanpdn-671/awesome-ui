import type { IComponentIR, IStyleMap } from '@awesomeui/core';
import {
  BaseTranspiler,
  type ITranspileOptions,
  parseExpression,
  isPureExpression,
  extractExpression,
  toPascalCase,
  indent,
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

export class SvelteTranspiler extends BaseTranspiler {
  readonly framework = 'svelte';
  readonly fileExtension = '.svelte';
  readonly language = 'svelte';

  protected generate(ir: IComponentIR, _options: Required<ITranspileOptions>): string {
    const sections: string[] = [];
    sections.push(this.generateScript(ir));
    sections.push(this.generateTemplate(ir));
    return sections.join('\n\n') + '\n';
  }

  private generateScript(ir: IComponentIR): string {
    const lines: string[] = [];
    lines.push('<script>');

    const propNames = Object.keys(ir.props);
    const eventNames = ir.events ? Object.keys(ir.events) : [];

    if (propNames.length > 0 || eventNames.length > 0) {
      const allProps: string[] = [];

      for (const [name, def] of Object.entries(ir.props)) {
        if (def.default !== undefined) {
          const defVal = typeof def.default === 'string' ? `'${def.default}'` : String(def.default);
          allProps.push(`${name} = ${defVal}`);
        } else {
          allProps.push(name);
        }
      }

      if (eventNames.length > 0) {
        for (const evt of eventNames) {
          const handlerName = this.eventToHandler(evt);
          allProps.push(handlerName);
        }
      }

      allProps.push('children');
      allProps.push('...restProps');

      lines.push(`  let { ${allProps.join(', ')} } = $props();`);
    }

    lines.push('');
    lines.push(this.generateStylesObject(ir.styles));
    lines.push('</script>');

    return lines.join('\n');
  }

  private eventToHandler(eventName: string): string {
    const map: Record<string, string> = {
      onClick: 'onclick',
      onDismiss: 'ondismiss',
      onFocus: 'onfocus',
      onBlur: 'onblur',
      onInput: 'oninput',
      onChange: 'onchange',
      onToggle: 'ontoggle',
      onSelect: 'onselect',
    };
    return map[eventName] ?? eventName;
  }

  private generateStylesObject(stylesMap: IStyleMap): string {
    const lines: string[] = [];
    lines.push('  const styles = {');

    for (const [key, value] of Object.entries(stylesMap)) {
      if (typeof value === 'string') {
        lines.push(`    ${key}: '${value}',`);
      } else if (typeof value === 'object' && value !== null) {
        lines.push(`    ${key}: {`);
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === 'string') {
            lines.push(`      ${subKey}: '${subValue}',`);
          } else {
            lines.push(`      ${subKey}: ${JSON.stringify(subValue)},`);
          }
        }
        lines.push('    },');
      }
    }

    lines.push('  } as const;');
    return lines.join('\n');
  }

  private generateTemplate(ir: IComponentIR): string {
    const lines: string[] = [];
    lines.push('<template>');
    lines.push(this.generateNode(ir.template as IRNode, ir.styles, 1));
    lines.push('</template>');
    return lines.join('\n');
  }

  private generateNode(node: IRNode, styles: IStyleMap, depth: number): string {
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
    const attrs = this.buildSvelteAttributes(node);
    const children = node.children;

    if (!children || children.length === 0) {
      return indent(`<${tag}${attrs} />`, depth);
    }

    const childrenHTML = children
      .map((child) => this.generateNode(child, styles, depth + 1))
      .filter((s) => s.length > 0)
      .join('\n');

    return [
      indent(`<${tag}${attrs}>`, depth),
      childrenHTML,
      indent(`</${tag}>`, depth),
    ].join('\n');
  }

  private generateText(text: string, depth: number): string {
    const segments = parseExpression(text);

    if (segments.length === 1 && segments[0]?.type === 'static') {
      return indent(segments[0].value, depth);
    }

    const parts = segments.map((seg) => {
      if (seg.type === 'expression') {
        return `{${this.convertExprToSvelte(seg.value)}}`;
      }
      return seg.value;
    });

    return indent(parts.join(''), depth);
  }

  private generateSlot(node: IRNode, depth: number): string {
    const slotName = node.slot!;
    if (slotName === 'default') {
      if (node.fallback) {
        return [
          indent('{#if children}', depth),
          indent('{@render children?.()}', depth + 1),
          indent('{:else}', depth),
          indent(node.fallback, depth + 1),
          indent('{/if}', depth),
        ].join('\n');
      }
      return indent('{@render children?.()}', depth);
    }
    if (node.fallback) {
      return [
        indent(`{#if ${slotName}}`, depth),
        indent(`{@render ${slotName}?.()}`, depth + 1),
        indent('{:else}', depth),
        indent(node.fallback, depth + 1),
        indent('{/if}', depth),
      ].join('\n');
    }
    return indent(`{@render ${slotName}?.()}`, depth);
  }

  private generateConditional(node: IRNode, styles: IStyleMap, depth: number): string {
    const condition = this.convertExprToSvelte(node.if!);

    if (!node.then) return '';

    const thenHTML = this.generateNode(node.then, styles, depth + 1);
    let result = [
      indent(`{#if ${condition}}`, depth),
      thenHTML,
    ].join('\n');

    if (node.else) {
      const elseHTML = this.generateNode(node.else, styles, depth + 1);
      result += '\n' + [
        indent('{:else}', depth),
        elseHTML,
      ].join('\n');
    }

    result += '\n' + indent('{/if}', depth);
    return result;
  }

  private generateLoop(node: IRNode, styles: IStyleMap, depth: number): string {
    const collection = this.convertExprToSvelte(node.each!);
    const itemVar = node.as ?? 'item';
    const keyExpr = node.key ? `(${itemVar}) => ${this.convertExprToSvelte(node.key)}` : `(${itemVar}) => ${itemVar}`;

    const children = node.children ?? [];
    const childrenHTML = children
      .map((child) => this.generateNode(child, styles, depth + 1))
      .join('\n');

    return [
      indent(`{#each ${collection} as ${itemVar} (${keyExpr})}`, depth),
      childrenHTML,
      indent('{/each}', depth),
    ].join('\n');
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
          return `${key}={${this.convertExprToSvelte(extractExpression(value))}}`;
        }
        return `${key}="${value}"`;
      })
      .join(' ');

    return indent(`<${name} ${propsStr} />`, depth);
  }

  private buildSvelteAttributes(node: IRNode): string {
    const parts: string[] = [];

    if (node.class) {
      const classBinding = this.buildSvelteClassBinding(node.class);
      parts.push(classBinding);
    }

    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        if (key === 'class') continue;
        if (key === 'style') continue;

        if (isPureExpression(value)) {
          parts.push(`${key}={${this.convertExprToSvelte(extractExpression(value))}}`);
        } else {

          if (value === 'true' || value === 'false') {
            parts.push(`${key}={${value}}`);
          } else {
            parts.push(`${key}="${value}"`);
          }
        }
      }
    }

    if (node.style) {
      const entries = Object.entries(node.style)
        .map(([prop, val]) => {
          const cssProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
          if (isPureExpression(val)) {
            return `${cssProp}: ${this.convertExprToSvelte(extractExpression(val))}`;
          }
          return `${cssProp}: ${val}`;
        })
        .join('; ');
      parts.push(`style="${entries}"`);
    }

    if (parts.length === 0) return '';
    return ' ' + parts.join(' ');
  }

  private buildSvelteClassBinding(classStr: string): string {
    const segments = parseExpression(classStr);

    if (segments.length === 1 && segments[0]?.type === 'static') {
      return `class="${segments[0].value.trim()}"`;
    }

    if (segments.length === 1 && segments[0]?.type === 'expression') {
      const expr = segments[0].value;
      if (expr.includes('?')) {
        const ternary = this.convertExprToSvelte(expr);
        return `class={${ternary}}`;
      }
      return `class={${this.convertExprToSvelte(expr)}}`;
    }

    const staticClasses: string[] = [];
    const dynamicClasses: string[] = [];

    for (const seg of segments) {
      if (seg.type === 'expression') {
        dynamicClasses.push(this.convertExprToSvelte(seg.value));
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

  private convertExprToSvelte(expr: string): string {
    return expr
      .replace(/props\.(\w+)/g, '$1')
      .replace(/styles\.(\w+)/g, 'styles.$1');
  }
}
