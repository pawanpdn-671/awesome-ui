import { isOk, ValidationError } from '@awesomeui/core';
import type { IComponentIR, IPropsMap, ISlotsMap, IEventsMap, IStyleMap, Result } from '@awesomeui/core';
import {
  BaseTranspiler,
  parseExpression,
  isPureExpression,
  extractExpression,
  toPascalCase,
  toCamelCase,
  indent,
  irTypeToTSBase,
} from '@awesomeui/transpiler-shared';
import type { ITranspileOptions, ITranspileOutput } from '@awesomeui/transpiler-shared';

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

const HTML_TO_RN: Record<string, string> = {
  div: 'View',
  span: 'Text',
  button: 'TouchableOpacity',
  p: 'Text',
  h1: 'Text',
  h2: 'Text',
  h3: 'Text',
  h4: 'Text',
  h5: 'Text',
  h6: 'Text',
  img: 'Image',
  input: 'TextInput',
  textarea: 'TextInput',
  select: 'Picker',
  ul: 'View',
  ol: 'View',
  li: 'Text',
  a: 'Text',
  nav: 'View',
  header: 'View',
  footer: 'View',
  section: 'View',
  main: 'View',
  aside: 'View',
  label: 'Text',
  table: 'View',
  thead: 'View',
  tbody: 'View',
  tr: 'View',
  th: 'Text',
  td: 'Text',
  svg: 'View',
};

export class ReactNativeTranspiler extends BaseTranspiler {
  readonly framework = 'react-native';
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

  protected generate(ir: IComponentIR, options: Required<ITranspileOptions>): string {
    const componentName = this.getComponentName(ir.name);
    const sections: string[] = [];
    const isTs = options.typescript;

    sections.push(this.generateImports(isTs));
    sections.push(this.generateStyleSheet(ir, isTs));
    if (isTs) {
      sections.push(this.generatePropsInterface(componentName, ir.props, ir.slots, ir.events));
    }
    sections.push(this.generateComponent(ir, componentName, isTs));
    sections.push(`${componentName}.displayName = '${componentName}';`);

    return sections.join('\n\n') + '\n';
  }

  private generateImports(isTs: boolean): string {
    if (isTs) {
      return [
        "import React from 'react';",
        "import {",
        "  View,",
        "  Text,",
        "  TouchableOpacity,",
        "  TextInput,",
        "  Image,",
        "  StyleSheet,",
        "  type ViewStyle,",
        "  type TextStyle,",
        "} from 'react-native';",
      ].join('\n');
    }
    return [
      "import React from 'react';",
      "import {",
      "  View,",
      "  Text,",
      "  TouchableOpacity,",
      "  TextInput,",
      "  Image,",
      "  StyleSheet,",
      "} from 'react-native';",
    ].join('\n');
  }

  private generateStyleSheet(ir: IComponentIR, isTs: boolean): string {
    const flattenStyles = this.flattenStyles(ir.styles);
    const lines: string[] = [];
    lines.push('const styles = StyleSheet.create({');

    for (const [key, value] of Object.entries(flattenStyles)) {
      const css = this.tailwindToRN(key, value);
      if (css) {
        lines.push(`  ${key}: ${JSON.stringify(css)},`);
      }
    }

    lines.push(`}${isTs ? ' as const' : ''});`);
    return lines.join('\n');
  }

  private flattenStyles(styleMap: IStyleMap): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(styleMap)) {
      if (typeof value === 'string') {
        result[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === 'string') {
            result[`${key}_${subKey}`] = subValue;
          }
        }
      }
    }
    return result;
  }

  private tailwindToRN(_key: string, _classes: string): Record<string, unknown> | null {
    const rnStyles: Record<string, unknown> = {};
    const classes = _classes.split(/\s+/).filter(Boolean);

    for (const cls of classes) {
      if (cls.startsWith('flex')) {
        if (cls === 'flex') rnStyles.display = 'flex';
        else if (cls === 'flex-1') rnStyles.flex = 1;
        else if (cls === 'flex-row') rnStyles.flexDirection = 'row';
        else if (cls === 'flex-col') rnStyles.flexDirection = 'column';
        else if (cls === 'flex-wrap') rnStyles.flexWrap = 'wrap';
        else if (cls.startsWith('flex-')) rnStyles.flex = parseInt(cls.replace('flex-', ''), 10);
      } else if (cls.startsWith('items-')) {
        const val = cls.replace('items-', '');
        rnStyles.alignItems = val === 'start' ? 'flex-start' : val === 'end' ? 'flex-end' : val;
      } else if (cls.startsWith('justify-')) {
        const val = cls.replace('justify-', '');
        rnStyles.justifyContent = val === 'center' ? 'center' : val === 'between' ? 'space-between' : val === 'around' ? 'space-around' : val === 'evenly' ? 'space-evenly' : val;
      } else if (cls.startsWith('self-')) {
        const val = cls.replace('self-', '');
        rnStyles.alignSelf = val === 'start' ? 'flex-start' : val === 'end' ? 'flex-end' : val;
      } else if (cls.startsWith('gap-')) {
        const val = cls.replace('gap-', '');
        rnStyles.gap = this.parseSpacing(val);
      } else if (cls.startsWith('p') && cls.includes('-')) {
        const parts = cls.match(/^p([trblxy]?)-(\d+)/);
        const dir = parts?.[1] ?? '';
        const size = parts?.[2] ?? '0';
        const spacing = this.parseSpacing(size);
        if (dir === 't') rnStyles.paddingTop = spacing;
        else if (dir === 'b') rnStyles.paddingBottom = spacing;
        else if (dir === 'l') rnStyles.paddingLeft = spacing;
        else if (dir === 'r') rnStyles.paddingRight = spacing;
        else if (dir === 'x') { rnStyles.paddingLeft = spacing; rnStyles.paddingRight = spacing; }
        else if (dir === 'y') { rnStyles.paddingTop = spacing; rnStyles.paddingBottom = spacing; }
        else rnStyles.padding = spacing;
      } else if (cls.startsWith('m') && cls.includes('-')) {
        const parts = cls.match(/^m([trblxy]?)-(\d+)/);
        const dir = parts?.[1] ?? '';
        const size = parts?.[2] ?? '0';
        const spacing = this.parseSpacing(size);
        if (dir === 't') rnStyles.marginTop = spacing;
        else if (dir === 'b') rnStyles.marginBottom = spacing;
        else if (dir === 'l') rnStyles.marginLeft = spacing;
        else if (dir === 'r') rnStyles.marginRight = spacing;
        else if (dir === 'x') { rnStyles.marginLeft = spacing; rnStyles.marginRight = spacing; }
        else if (dir === 'y') { rnStyles.marginTop = spacing; rnStyles.marginBottom = spacing; }
        else rnStyles.margin = spacing;
      } else if (cls.startsWith('w-') && !cls.startsWith('w-(')) {
        const size = cls.replace('w-', '');
        if (size === 'full') rnStyles.width = '100%';
        else rnStyles.width = this.parseSpacing(size);
      } else if (cls.startsWith('h-') && !cls.startsWith('h-(')) {
        const size = cls.replace('h-', '');
        if (size === 'full') rnStyles.height = '100%';
        else rnStyles.height = this.parseSpacing(size);
      } else if (cls.startsWith('min-w-')) {
        rnStyles.minWidth = this.parseSpacing(cls.replace('min-w-', ''));
      } else if (cls.startsWith('min-h-')) {
        rnStyles.minHeight = this.parseSpacing(cls.replace('min-h-', ''));
      } else if (cls.startsWith('max-w-')) {
        rnStyles.maxWidth = this.parseSpacing(cls.replace('max-w-', ''));
      } else if (cls.startsWith('max-h-')) {
        rnStyles.maxHeight = this.parseSpacing(cls.replace('max-h-', ''));
      } else if (cls.startsWith('rounded')) {
        if (cls === 'rounded-full') rnStyles.borderRadius = 9999;
        else if (cls === 'rounded') rnStyles.borderRadius = 4;
        else if (cls.startsWith('rounded-')) {
          const val = cls.replace('rounded-', '');
          if (val === 'none') rnStyles.borderRadius = 0;
          else if (val === 'sm') rnStyles.borderRadius = 2;
          else if (val === 'md') rnStyles.borderRadius = 6;
          else if (val === 'lg') rnStyles.borderRadius = 8;
          else if (val === 'xl') rnStyles.borderRadius = 12;
          else if (val === '2xl') rnStyles.borderRadius = 16;
          else if (val === '3xl') rnStyles.borderRadius = 24;
        }
      } else if (cls.startsWith('border')) {
        if (cls === 'border') rnStyles.borderWidth = 1;
        else if (cls === 'border-0') rnStyles.borderWidth = 0;
        else if (cls === 'border-2') rnStyles.borderWidth = 2;
        else if (cls === 'border-4') rnStyles.borderWidth = 4;
        else if (cls.startsWith('border-t-')) rnStyles.borderTopWidth = parseInt(cls.replace('border-t-', ''), 10);
        else if (cls.startsWith('border-b-')) rnStyles.borderBottomWidth = parseInt(cls.replace('border-b-', ''), 10);
        else if (cls.startsWith('border-l-')) rnStyles.borderLeftWidth = parseInt(cls.replace('border-l-', ''), 10);
        else if (cls.startsWith('border-r-')) rnStyles.borderRightWidth = parseInt(cls.replace('border-r-', ''), 10);
      } else if (cls.startsWith('text-')) {
        const val = cls.replace('text-', '');
        if (['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'].includes(val)) {
          rnStyles.fontSize = this.fontSizeMap(val);
        } else if (val === 'left' || val === 'center' || val === 'right') {
          rnStyles.textAlign = val;
        }
      } else if (cls === 'font-medium') rnStyles.fontWeight = '500';
      else if (cls === 'font-semibold') rnStyles.fontWeight = '600';
      else if (cls === 'font-bold') rnStyles.fontWeight = 'bold';
      else if (cls === 'truncate') rnStyles.numberOfLines = 1;
      else if (cls.startsWith('opacity-')) rnStyles.opacity = parseInt(cls.replace('opacity-', ''), 10) / 100;
      else if (cls.startsWith('shadow')) {
        if (cls === 'shadow-sm') { rnStyles.shadowColor = '#000'; rnStyles.shadowOffset = { width: 0, height: 1 }; rnStyles.shadowOpacity = 0.05; rnStyles.shadowRadius = 2; rnStyles.elevation = 1; }
        else if (cls === 'shadow') { rnStyles.shadowColor = '#000'; rnStyles.shadowOffset = { width: 0, height: 1 }; rnStyles.shadowOpacity = 0.1; rnStyles.shadowRadius = 3; rnStyles.elevation = 2; }
        else if (cls === 'shadow-md') { rnStyles.shadowColor = '#000'; rnStyles.shadowOffset = { width: 0, height: 4 }; rnStyles.shadowOpacity = 0.1; rnStyles.shadowRadius = 6; rnStyles.elevation = 4; }
        else if (cls === 'shadow-lg') { rnStyles.shadowColor = '#000'; rnStyles.shadowOffset = { width: 0, height: 10 }; rnStyles.shadowOpacity = 0.1; rnStyles.shadowRadius = 15; rnStyles.elevation = 10; }
      } else if (cls.startsWith('bg-') || cls.startsWith('text-') || cls.startsWith('border-')) {
        const color = this.parseColor(cls);
        if (color) {
          if (cls.startsWith('bg-')) rnStyles.backgroundColor = color;
          else if (cls.startsWith('text-')) rnStyles.color = color;
          else if (cls.startsWith('border-')) rnStyles.borderColor = color;
        }
      }
    }

    return Object.keys(rnStyles).length > 0 ? rnStyles : null;
  }

  private fontSizeMap(size: string): number {
    const map: Record<string, number> = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48, '6xl': 60 };
    return map[size] ?? 16;
  }

  private parseSpacing(size: string): number {
    const num = parseInt(size, 10);
    if (isNaN(num)) return 0;
    return num * 4;
  }

  private parseColor(cls: string): string | null {
    const colorMap: Record<string, string> = {
      'gray-50': '#F9FAFB', 'gray-100': '#F3F4F6', 'gray-200': '#E5E7EB',
      'gray-300': '#D1D5DB', 'gray-400': '#9CA3AF', 'gray-500': '#6B7280',
      'gray-600': '#4B5563', 'gray-700': '#374151', 'gray-800': '#1F2937',
      'gray-900': '#111827',
      'red-50': '#FEF2F2', 'red-100': '#FEE2E2', 'red-200': '#FECACA',
      'red-500': '#EF4444', 'red-600': '#DC2626', 'red-700': '#B91C1C',
      'red-800': '#991B1B',
      'blue-50': '#EFF6FF', 'blue-100': '#DBEAFE', 'blue-200': '#BFDBFE',
      'blue-500': '#3B82F6', 'blue-600': '#2563EB', 'blue-700': '#1D4ED8',
      'blue-800': '#1E40AF',
      'green-50': '#F0FDF4', 'green-100': '#DCFCE7', 'green-200': '#BBF7D0',
      'green-500': '#22C55E', 'green-600': '#16A34A', 'green-700': '#15803D',
      'green-800': '#166534',
      'yellow-50': '#FEFCE8', 'yellow-100': '#FEF9C3', 'yellow-200': '#FEF08A',
      'yellow-500': '#EAB308', 'yellow-600': '#CA8A04', 'yellow-800': '#854D0E',
      'white': '#FFFFFF', 'black': '#000000', 'transparent': 'transparent',
      'current': 'currentColor',
    };

    const parts = cls.split('-');
    if (parts.length >= 2) {
      const candidate = parts.slice(1).join('-');
      if (colorMap[candidate]) return colorMap[candidate];
    }
    return null;
  }

  private generatePropsInterface(name: string, props: IPropsMap, slots?: ISlotsMap, events?: IEventsMap): string {
    const lines: string[] = [];
    lines.push(`export interface ${name}Props {`);

    for (const [propName, def] of Object.entries(props)) {
      const description = def.description;
      if (description) lines.push(`  /** ${description} */`);
      const tsType = this.propToRNType(def.type, def.values);
      const optional = def.required ? '' : '?';
      lines.push(`  ${propName}${optional}: ${tsType};`);
    }

    if (slots) {
      for (const [slotName] of Object.entries(slots)) {
        const prop = slotName === 'default' ? 'children' : slotName;
        lines.push(`  ${prop}?: React.ReactNode;`);
      }
    }

    if (events) {
      for (const eventName of Object.keys(events)) {
        const handler = this.eventToRN(eventName);
        lines.push(`  ${handler}?: (${this.eventPayload(eventName)}) => void;`);
      }
    }

    lines.push('  style?: ViewStyle | TextStyle;');
    lines.push('}');
    return lines.join('\n');
  }

  private eventToRN(eventName: string): string {
    const map: Record<string, string> = {
      onClick: 'onPress',
      onChange: 'onChangeText',
      onInput: 'onChangeText',
      onFocus: 'onFocus',
      onBlur: 'onBlur',
      onDismiss: 'onDismiss',
      onPress: 'onPress',
      onLongPress: 'onLongPress',
    };
    return map[eventName] ?? eventName;
  }

  private eventPayload(_eventName: string): string {
    return '...args: unknown[]';
  }

  private propToRNType(type: string, values?: string[]): string {
    if (type === 'enum' && values) {
      return values.map((v) => `'${v}'`).join(' | ');
    }
    return irTypeToTSBase(type);
  }

  private generateComponent(ir: IComponentIR, componentName: string, isTs: boolean): string {
    const propsDestructure = this.generatePropsDestructure(ir.props, ir.slots, ir.events);
    const jsxBody = this.generateJSX(ir.template as IRNode, ir.styles, 2);

    const typeAnnotation = isTs ? `: React.FC<${componentName}Props>` : '';
    const lines: string[] = [];
    lines.push(
      `export const ${componentName}${typeAnnotation} = (${propsDestructure}) => {`
    );
    lines.push(`  return (`);
    lines.push(jsxBody);
    lines.push(`  );`);
    lines.push(`};`);

    return lines.join('\n');
  }

  private isTextOnlyComponent(node: IRNode): boolean {
    if (node.tag === 'span' || node.tag === 'p' || node.tag === 'text') return true;
    if (node.text !== undefined) return true;
    if (node.children) {
      return node.children.every((c) => this.isTextOnlyComponent(c));
    }
    return false;
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
        const handler = this.eventToRN(eventName);
        if (handler !== eventName) {
          parts.push(`${handler}: ${eventName}`);
        } else {
          parts.push(eventName);
        }
      }
    }

    parts.push('style');

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
    const rnTag = HTML_TO_RN[node.tag!] ?? node.tag!;
    const isText = rnTag === 'Text';
    const attrs = this.buildRNAttributes(node, styles);
    const children = node.children;

    if (!children || children.length === 0) {
      return indent(`<${rnTag}${attrs} />`, depth);
    }

    const childrenJSX = children
      .map((child) => this.generateJSX(child, styles, depth + 1))
      .filter((s) => s.length > 0)
      .join('\n');

    const shouldWrapInText = !isText && this.childrenContainText(children);
    if (shouldWrapInText) {
      return [
        indent(`<${rnTag}${attrs}>`, depth),
        indent(`<Text>${childrenJSX}</Text>`, depth + 1),
        indent(`</${rnTag}>`, depth),
      ].join('\n');
    }

    return [
      indent(`<${rnTag}${attrs}>`, depth),
      childrenJSX,
      indent(`</${rnTag}>`, depth),
    ].join('\n');
  }

  private childrenContainText(children: IRNode[]): boolean {
    return children.some((c) => c.text !== undefined || c.slot !== undefined);
  }

  private generateText(text: string, depth: number): string {
    const segments = parseExpression(text);

    if (segments.length === 1 && segments[0]?.type === 'static') {
      return indent(segments[0].value, depth);
    }

    if (segments.length === 1 && segments[0]?.type === 'expression') {
      return indent(`{${this.convertExprToRN(segments[0].value)}}`, depth);
    }

    const parts = segments.map((seg) => {
      if (seg.type === 'expression') {
        return `\${${this.convertExprToRN(seg.value)}}`;
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
    const condition = this.convertExprToRN(node.if!);
    const thenJSX = node.then ? this.generateJSX(node.then, styles, 0) : '';

    if (node.else) {
      const elseJSX = this.generateJSX(node.else, styles, 0);
      return indent(`{${condition} ? (\n${indent(thenJSX, 1)}\n) : (\n${indent(elseJSX, 1)}\n)}`, depth);
    }

    return indent(`{${condition} && (\n${indent(thenJSX, 1)}\n)}`, depth);
  }

  private generateLoop(node: IRNode, styles: IStyleMap, depth: number): string {
    const collection = this.convertExprToRN(node.each!);
    const itemVar = node.as ?? 'item';
    const keyExpr = node.key ? this.convertExprToRN(node.key) : 'index';

    const childrenJSX = (node.children ?? [])
      .map((child) => this.generateJSX(child, styles, depth + 2))
      .join('\n');

    return indent(
      `{${collection}.map((${itemVar}, index) => (\n${indent(`<React.Fragment key={${keyExpr}}>`, depth + 1)}\n${childrenJSX}\n${indent('</React.Fragment>', depth + 1)}\n${indent(')', depth)}))}`,
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
          return `${key}={${this.convertExprToRN(extractExpression(value))}}`;
        }
        return `${key}="${value}"`;
      })
      .join(' ');

    return indent(`<${name} ${propsStr} />`, depth);
  }

  private buildRNAttributes(node: IRNode, styles: IStyleMap): string {
    const parts: string[] = [];

    const styleKeys = this.resolveStyleKeys(node, styles);
    if (styleKeys.length > 0) {
      parts.push(`style={[${styleKeys.join(', ')}]}`);
    }

    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        const rnKey = this.attrToRN(key, node.tag);
        if (!rnKey) continue;

        if (isPureExpression(value)) {
          parts.push(`${rnKey}={${this.convertExprToRN(extractExpression(value))}}`);
        } else if (value === 'true' || value === 'false') {
          parts.push(`${rnKey}={${value}}`);
        } else {
          parts.push(`${rnKey}="${value}"`);
        }
      }
    }

    if (node.style) {
      const inlineStyle = Object.entries(node.style)
        .map(([prop, val]) => {
          const camelProp = toCamelCase(prop);
          if (isPureExpression(val)) {
            return `${camelProp}: ${this.convertExprToRN(extractExpression(val))}`;
          }
          return `${camelProp}: '${val}'`;
        })
        .join(', ');
      parts.push(`style={{ ${inlineStyle} }}`);
    }

    if (parts.length === 0) return '';
    return ' ' + parts.join(' ');
  }

  private resolveStyleKeys(node: IRNode, _styles: IStyleMap): string[] {
    const keys: string[] = [];

    if (node.class) {
      const segments = parseExpression(node.class);
      for (const seg of segments) {
        if (seg.type === 'static') {
          const parts = seg.value.trim().split(/\s+/).filter(Boolean);
          for (const part of parts) {
            const styleKey = this.classToStyleKey(part);
            if (styleKey) keys.push(`styles.${styleKey}`);
          }
        } else if (seg.type === 'expression') {
          keys.push(this.convertExprToRN(seg.value));
        }
      }
    }

    if (keys.length === 0) return [];
    return keys;
  }

  private classToStyleKey(cls: string): string | null {
    const parts = cls.split(/(?=[A-Z])/);
    if (parts.length > 1) {
      const joined = parts.map((p) => p.toLowerCase()).join('_');
      return joined;
    }
    return cls;
  }

  private attrToRN(attr: string, _tag?: string): string | null {
    const map: Record<string, string> = {
      disabled: 'disabled',
      placeholder: 'placeholder',
      value: 'value',
      type: 'keyboardType',
      name: 'name',
      rows: 'numberOfLines',
      maxlength: 'maxLength',
      readonly: 'readOnly',
      required: 'required',
      checked: 'value',
      href: 'href',
      src: 'source',
      alt: 'accessibilityLabel',
      role: 'accessibilityRole',
      colspan: 'colspan',
    };
    return map[attr] ?? null;
  }

  private convertExprToRN(expr: string): string {
    return expr
      .replace(/props\.(\w+)/g, '$1')
      .replace(/styles\.(\w+)(\[(\w+)\])?/g, 'styles.$1$2');
  }
}
