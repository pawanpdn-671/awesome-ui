/**
 * @module vue-transpiler
 * @description Transpiles AwesomeUI IR to Vue 3 Single File Components (SFC).
 * Generates `<script setup lang="ts">` + `<template>` blocks with
 * defineProps, withDefaults, defineEmits, and Vue template directives.
 *
 * @example
 * ```typescript
 * import { VueTranspiler } from '@awesomeui/transpiler-vue';
 * import { isOk } from '@awesomeui/core';
 *
 * const transpiler = new VueTranspiler();
 * const result = transpiler.transpile(buttonIR);
 * if (isOk(result)) {
 *   fs.writeFileSync(result.data.filename, result.data.code);
 * }
 * ```
 */

import type { IComponentIR, IPropsMap, IEventsMap, IStyleMap } from '@awesomeui/core';
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

/** Loosely-typed IR node for recursive template walking */
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

/**
 * Vue 3 SFC transpiler that converts component IR to `.vue` files.
 *
 * **Generated output includes:**
 * - `<script setup lang="ts">` with defineProps/withDefaults/defineEmits
 * - `<template>` block with Vue directives (v-if, v-for, v-bind)
 * - Styles object for variant-based class composition
 *
 * @example
 * ```typescript
 * const transpiler = new VueTranspiler();
 * const result = transpiler.transpile(buttonIR);
 * ```
 */
export class VueTranspiler extends BaseTranspiler {
  readonly framework = 'vue';
  readonly fileExtension = '.vue';
  readonly language = 'vue';

  /**
   * Generates the complete Vue SFC code from validated IR.
   */
  protected generate(ir: IComponentIR, _options: Required<ITranspileOptions>): string {
    const sections: string[] = [];

    // <script setup lang="ts">
    sections.push(this.generateScript(ir));

    // <template>
    sections.push(this.generateTemplate(ir));

    return sections.join('\n\n') + '\n';
  }

  /**
   * Generates the `<script setup lang="ts">` block.
   */
  private generateScript(ir: IComponentIR): string {
    const lines: string[] = [];
    lines.push('<script setup lang="ts">');

    // Props interface
    lines.push('');
    lines.push(this.generatePropsInterface(ir.props));

    // defineProps + withDefaults
    lines.push('');
    lines.push(this.generateDefineProps(ir.props));

    // defineEmits
    if (ir.events && Object.keys(ir.events).length > 0) {
      lines.push('');
      lines.push(this.generateDefineEmits(ir.events));
    }

    // Styles object
    lines.push('');
    lines.push(this.generateStylesObject(ir.styles));

    lines.push('</script>');
    return lines.join('\n');
  }

  /**
   * Generates TypeScript interface for props.
   */
  private generatePropsInterface(props: IPropsMap): string {
    const lines: string[] = [];
    lines.push('interface Props {');

    for (const [name, def] of Object.entries(props)) {
      const description = def.description;
      if (description) {
        lines.push(`  /** ${description} */`);
      }

      const tsType = this.propToTSType(def.type, def.values);
      const optional = def.required ? '' : '?';
      lines.push(`  ${name}${optional}: ${tsType};`);
    }

    lines.push('}');
    return lines.join('\n');
  }

  /**
   * Generates defineProps with withDefaults.
   */
  private generateDefineProps(props: IPropsMap): string {
    const defaults: string[] = [];

    for (const [name, def] of Object.entries(props)) {
      if (def.default !== undefined) {
        const value = typeof def.default === 'string'
          ? `'${def.default}'`
          : String(def.default);
        defaults.push(`  ${name}: ${value},`);
      }
    }

    if (defaults.length > 0) {
      return [
        'const props = withDefaults(defineProps<Props>(), {',
        ...defaults,
        '});',
      ].join('\n');
    }

    return 'const props = defineProps<Props>();';
  }

  /**
   * Generates defineEmits.
   */
  private generateDefineEmits(events: IEventsMap): string {
    const eventNames = Object.keys(events).map((name) => {
      // Convert React-style "onClick" to Vue-style "click"
      const vueName = name.replace(/^on/, '').toLowerCase();
      return `  (e: '${vueName}', ...args: unknown[]): void;`;
    });

    return [
      'const emit = defineEmits<{',
      ...eventNames,
      '}>();',
    ].join('\n');
  }

  /**
   * Generates the styles constant object.
   */
  private generateStylesObject(stylesMap: IStyleMap): string {
    const lines: string[] = [];
    lines.push('const styles = {');

    for (const [key, value] of Object.entries(stylesMap)) {
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

  /**
   * Generates the `<template>` block.
   */
  private generateTemplate(ir: IComponentIR): string {
    const lines: string[] = [];
    lines.push('<template>');
    lines.push(this.generateNode(ir.template as IRNode, ir.styles, 1));
    lines.push('</template>');
    return lines.join('\n');
  }

  /**
   * Recursively generates Vue template HTML from IR nodes.
   */
  private generateNode(node: IRNode, styles: IStyleMap, depth: number): string {
    if (node.if !== undefined) {
      return this.generateConditional(node, styles, depth);
    }
    if (node.each !== undefined) {
      return this.generateLoop(node, styles, depth);
    }
    if (node.slot !== undefined) {
      return this.generateSlot(node, depth);
    }
    if (node.text !== undefined) {
      return this.generateText(node.text, depth);
    }
    if (node.component !== undefined) {
      return this.generateComponentRef(node, depth);
    }
    if (node.tag !== undefined) {
      return this.generateElement(node, styles, depth);
    }
    return '';
  }

  /**
   * Generates an HTML element with Vue bindings.
   */
  private generateElement(node: IRNode, styles: IStyleMap, depth: number): string {
    const tag = node.tag!;
    const attrs = this.buildVueAttributes(node);
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

  /**
   * Generates Vue text with {{ }} interpolation.
   */
  private generateText(text: string, depth: number): string {
    const segments = parseExpression(text);

    if (segments.length === 1 && segments[0]?.type === 'static') {
      return indent(segments[0].value, depth);
    }

    const parts = segments.map((seg) => {
      if (seg.type === 'expression') {
        return `{{ ${this.convertExprToVue(seg.value)} }}`;
      }
      return seg.value;
    });

    return indent(parts.join(''), depth);
  }

  /**
   * Generates a Vue slot element.
   */
  private generateSlot(node: IRNode, depth: number): string {
    const slotName = node.slot!;

    if (slotName === 'default') {
      if (node.fallback) {
        return [
          indent('<slot>', depth),
          indent(node.fallback, depth + 1),
          indent('</slot>', depth),
        ].join('\n');
      }
      return indent('<slot />', depth);
    }

    if (node.fallback) {
      return [
        indent(`<slot name="${slotName}">`, depth),
        indent(node.fallback, depth + 1),
        indent('</slot>', depth),
      ].join('\n');
    }

    return indent(`<slot name="${slotName}" />`, depth);
  }

  /**
   * Generates Vue v-if/v-else conditional.
   */
  private generateConditional(node: IRNode, styles: IStyleMap, depth: number): string {
    const condition = this.convertExprToVue(node.if!);

    if (!node.then) return '';

    // For element nodes, add v-if directly
    const thenNode = node.then;

    if (thenNode.tag) {
      const thenAttrs = this.buildVueAttributes(thenNode);
      const vIfAttr = ` v-if="${condition}"`;
      const children = thenNode.children;

      let thenHTML: string;
      if (!children || children.length === 0) {
        thenHTML = indent(`<${thenNode.tag}${vIfAttr}${thenAttrs} />`, depth);
      } else {
        const childrenHTML = children
          .map((child) => this.generateNode(child, styles, depth + 1))
          .join('\n');
        thenHTML = [
          indent(`<${thenNode.tag}${vIfAttr}${thenAttrs}>`, depth),
          childrenHTML,
          indent(`</${thenNode.tag}>`, depth),
        ].join('\n');
      }

      if (node.else) {
        const elseHTML = this.generateNodeWithDirective(node.else, styles, depth, 'v-else');
        return thenHTML + '\n' + elseHTML;
      }

      return thenHTML;
    }

    // Wrap in <template v-if>
    const thenHTML = this.generateNode(thenNode, styles, depth + 1);
    let result = [
      indent(`<template v-if="${condition}">`, depth),
      thenHTML,
      indent('</template>', depth),
    ].join('\n');

    if (node.else) {
      const elseHTML = this.generateNode(node.else, styles, depth + 1);
      result += '\n' + [
        indent('<template v-else>', depth),
        elseHTML,
        indent('</template>', depth),
      ].join('\n');
    }

    return result;
  }

  /**
   * Generates a node with an additional Vue directive.
   */
  private generateNodeWithDirective(
    node: IRNode,
    styles: IStyleMap,
    depth: number,
    directive: string
  ): string {
    if (node.tag) {
      const attrs = this.buildVueAttributes(node);
      const children = node.children;

      if (!children || children.length === 0) {
        return indent(`<${node.tag} ${directive}${attrs} />`, depth);
      }

      const childrenHTML = children
        .map((child) => this.generateNode(child, styles, depth + 1))
        .join('\n');

      return [
        indent(`<${node.tag} ${directive}${attrs}>`, depth),
        childrenHTML,
        indent(`</${node.tag}>`, depth),
      ].join('\n');
    }

    // Wrap in template
    const content = this.generateNode(node, styles, depth + 1);
    return [
      indent(`<template ${directive}>`, depth),
      content,
      indent('</template>', depth),
    ].join('\n');
  }

  /**
   * Generates Vue v-for loop.
   */
  private generateLoop(node: IRNode, styles: IStyleMap, depth: number): string {
    const collection = this.convertExprToVue(node.each!);
    const itemVar = node.as ?? 'item';
    const keyAttr = node.key ? ` :key="${this.convertExprToVue(node.key)}"` : '';

    const children = node.children ?? [];

    if (children.length === 1 && children[0]?.tag) {
      // Single child: put v-for on the child directly
      const child = children[0];
      const childAttrs = this.buildVueAttributes(child);
      const vForAttr = ` v-for="${itemVar} in ${collection}"${keyAttr}`;

      const grandchildren = child.children;
      if (!grandchildren || grandchildren.length === 0) {
        return indent(`<${child.tag}${vForAttr}${childAttrs} />`, depth);
      }

      const childrenHTML = grandchildren
        .map((gc) => this.generateNode(gc, styles, depth + 1))
        .join('\n');

      return [
        indent(`<${child.tag}${vForAttr}${childAttrs}>`, depth),
        childrenHTML,
        indent(`</${child.tag}>`, depth),
      ].join('\n');
    }

    // Multiple children: wrap in template
    const childrenHTML = children
      .map((child) => this.generateNode(child, styles, depth + 1))
      .join('\n');

    return [
      indent(`<template v-for="${itemVar} in ${collection}"${keyAttr}>`, depth),
      childrenHTML,
      indent('</template>', depth),
    ].join('\n');
  }

  /**
   * Generates a component reference in Vue template.
   */
  private generateComponentRef(node: IRNode, depth: number): string {
    const name = toPascalCase(node.component!);
    const props = node.props;

    if (!props || Object.keys(props).length === 0) {
      return indent(`<${name} />`, depth);
    }

    const propsStr = Object.entries(props)
      .map(([key, value]) => {
        if (isPureExpression(value)) {
          return `:${key}="${this.convertExprToVue(extractExpression(value))}"`;
        }
        return `${key}="${value}"`;
      })
      .join(' ');

    return indent(`<${name} ${propsStr} />`, depth);
  }

  /**
   * Builds Vue attribute string for an element node.
   */
  private buildVueAttributes(node: IRNode): string {
    const parts: string[] = [];

    // Class binding
    if (node.class) {
      const classExpr = this.buildVueClassBinding(node.class);
      parts.push(classExpr);
    }

    // Attributes
    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        if (key === 'class') continue;

        if (isPureExpression(value)) {
          parts.push(`:${key}="${this.convertExprToVue(extractExpression(value))}"`);
        } else {
          parts.push(`${key}="${value}"`);
        }
      }
    }

    // Inline style
    if (node.style) {
      const entries = Object.entries(node.style)
        .map(([prop, val]) => {
          if (isPureExpression(val)) {
            return `${prop}: ${this.convertExprToVue(extractExpression(val))}`;
          }
          return `${prop}: '${val}'`;
        })
        .join(', ');
      parts.push(`:style="{ ${entries} }"`);
    }

    if (parts.length === 0) return '';
    return ' ' + parts.join(' ');
  }

  /**
   * Builds a Vue class binding from an IR class expression.
   */
  private buildVueClassBinding(classStr: string): string {
    const segments = parseExpression(classStr);

    if (segments.length === 1 && segments[0]?.type === 'static') {
      return `class="${segments[0].value.trim()}"`;
    }

    if (segments.length === 1 && segments[0]?.type === 'expression') {
      return `:class="${this.convertExprToVue(segments[0].value)}"`;
    }

    // Mixed — build array or template literal
    const parts = segments.map((seg) => {
      if (seg.type === 'expression') {
        return `\${${this.convertExprToVue(seg.value)}}`;
      }
      return seg.value;
    });

    return `:class="\`${parts.join('')}\`.trim()"`;
  }

  /**
   * Converts IR expression to Vue-compatible JavaScript.
   * Keeps `props.` prefix since Vue uses `props.X` in templates.
   */
  private convertExprToVue(expr: string): string {
    // In Vue <script setup>, props are accessed via props.X
    // but in templates, we can use them directly
    // We keep props. prefix for consistency with the reactive props object
    return expr;
  }

  /**
   * Maps an IR prop type to TypeScript type.
   */
  private propToTSType(type: string, values?: string[]): string {
    if (type === 'enum' && values) {
      return values.map((v) => `'${v}'`).join(' | ');
    }
    return irTypeToTSBase(type);
  }
}
