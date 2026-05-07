import { BaseTranspiler, indent, parseExpression, toPascalCase, isPureExpression, extractExpression, irTypeToTSBase } from '@awesomeui/transpiler-shared';

// src/vue-transpiler.ts
var VueTranspiler = class extends BaseTranspiler {
  framework = "vue";
  fileExtension = ".vue";
  language = "vue";
  /**
   * Generates the complete Vue SFC code from validated IR.
   */
  generate(ir, _options) {
    const sections = [];
    sections.push(this.generateScript(ir));
    sections.push(this.generateTemplate(ir));
    return sections.join("\n\n") + "\n";
  }
  /**
   * Generates the `<script setup lang="ts">` block.
   */
  generateScript(ir) {
    const lines = [];
    lines.push('<script setup lang="ts">');
    lines.push("");
    lines.push(this.generatePropsInterface(ir.props));
    lines.push("");
    lines.push(this.generateDefineProps(ir.props));
    if (ir.events && Object.keys(ir.events).length > 0) {
      lines.push("");
      lines.push(this.generateDefineEmits(ir.events));
    }
    lines.push("");
    lines.push(this.generateStylesObject(ir.styles));
    lines.push("</script>");
    return lines.join("\n");
  }
  /**
   * Generates TypeScript interface for props.
   */
  generatePropsInterface(props) {
    const lines = [];
    lines.push("interface Props {");
    for (const [name, def] of Object.entries(props)) {
      const description = def.description;
      if (description) {
        lines.push(`  /** ${description} */`);
      }
      const tsType = this.propToTSType(def.type, def.values);
      const optional = def.required ? "" : "?";
      lines.push(`  ${name}${optional}: ${tsType};`);
    }
    lines.push("}");
    return lines.join("\n");
  }
  /**
   * Generates defineProps with withDefaults.
   */
  generateDefineProps(props) {
    const defaults = [];
    for (const [name, def] of Object.entries(props)) {
      if (def.default !== void 0) {
        const value = typeof def.default === "string" ? `'${def.default}'` : String(def.default);
        defaults.push(`  ${name}: ${value},`);
      }
    }
    if (defaults.length > 0) {
      return [
        "const props = withDefaults(defineProps<Props>(), {",
        ...defaults,
        "});"
      ].join("\n");
    }
    return "const props = defineProps<Props>();";
  }
  /**
   * Generates defineEmits.
   */
  generateDefineEmits(events) {
    const eventNames = Object.keys(events).map((name) => {
      const vueName = name.replace(/^on/, "").toLowerCase();
      return `  (e: '${vueName}', ...args: unknown[]): void;`;
    });
    return [
      "const emit = defineEmits<{",
      ...eventNames,
      "}>();"
    ].join("\n");
  }
  /**
   * Generates the styles constant object.
   */
  generateStylesObject(stylesMap) {
    const lines = [];
    lines.push("const styles = {");
    for (const [key, value] of Object.entries(stylesMap)) {
      if (typeof value === "string") {
        lines.push(`  ${key}: '${value}',`);
      } else if (typeof value === "object" && value !== null) {
        lines.push(`  ${key}: {`);
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === "string") {
            lines.push(`    ${subKey}: '${subValue}',`);
          } else {
            lines.push(`    ${subKey}: ${JSON.stringify(subValue)},`);
          }
        }
        lines.push("  },");
      }
    }
    lines.push("} as const;");
    return lines.join("\n");
  }
  /**
   * Generates the `<template>` block.
   */
  generateTemplate(ir) {
    const lines = [];
    lines.push("<template>");
    lines.push(this.generateNode(ir.template, ir.styles, 1));
    lines.push("</template>");
    return lines.join("\n");
  }
  /**
   * Recursively generates Vue template HTML from IR nodes.
   */
  generateNode(node, styles, depth) {
    if (node.if !== void 0) {
      return this.generateConditional(node, styles, depth);
    }
    if (node.each !== void 0) {
      return this.generateLoop(node, styles, depth);
    }
    if (node.slot !== void 0) {
      return this.generateSlot(node, depth);
    }
    if (node.text !== void 0) {
      return this.generateText(node.text, depth);
    }
    if (node.component !== void 0) {
      return this.generateComponentRef(node, depth);
    }
    if (node.tag !== void 0) {
      return this.generateElement(node, styles, depth);
    }
    return "";
  }
  /**
   * Generates an HTML element with Vue bindings.
   */
  generateElement(node, styles, depth) {
    const tag = node.tag;
    const attrs = this.buildVueAttributes(node);
    const children = node.children;
    if (!children || children.length === 0) {
      return indent(`<${tag}${attrs} />`, depth);
    }
    const childrenHTML = children.map((child) => this.generateNode(child, styles, depth + 1)).filter((s) => s.length > 0).join("\n");
    return [
      indent(`<${tag}${attrs}>`, depth),
      childrenHTML,
      indent(`</${tag}>`, depth)
    ].join("\n");
  }
  /**
   * Generates Vue text with {{ }} interpolation.
   */
  generateText(text, depth) {
    const segments = parseExpression(text);
    if (segments.length === 1 && segments[0]?.type === "static") {
      return indent(segments[0].value, depth);
    }
    const parts = segments.map((seg) => {
      if (seg.type === "expression") {
        return `{{ ${this.convertExprToVue(seg.value)} }}`;
      }
      return seg.value;
    });
    return indent(parts.join(""), depth);
  }
  /**
   * Generates a Vue slot element.
   */
  generateSlot(node, depth) {
    const slotName = node.slot;
    if (slotName === "default") {
      if (node.fallback) {
        return [
          indent("<slot>", depth),
          indent(node.fallback, depth + 1),
          indent("</slot>", depth)
        ].join("\n");
      }
      return indent("<slot />", depth);
    }
    if (node.fallback) {
      return [
        indent(`<slot name="${slotName}">`, depth),
        indent(node.fallback, depth + 1),
        indent("</slot>", depth)
      ].join("\n");
    }
    return indent(`<slot name="${slotName}" />`, depth);
  }
  /**
   * Generates Vue v-if/v-else conditional.
   */
  generateConditional(node, styles, depth) {
    const condition = this.convertExprToVue(node.if);
    if (!node.then) return "";
    const thenNode = node.then;
    if (thenNode.tag) {
      const thenAttrs = this.buildVueAttributes(thenNode);
      const vIfAttr = ` v-if="${condition}"`;
      const children = thenNode.children;
      let thenHTML2;
      if (!children || children.length === 0) {
        thenHTML2 = indent(`<${thenNode.tag}${vIfAttr}${thenAttrs} />`, depth);
      } else {
        const childrenHTML = children.map((child) => this.generateNode(child, styles, depth + 1)).join("\n");
        thenHTML2 = [
          indent(`<${thenNode.tag}${vIfAttr}${thenAttrs}>`, depth),
          childrenHTML,
          indent(`</${thenNode.tag}>`, depth)
        ].join("\n");
      }
      if (node.else) {
        const elseHTML = this.generateNodeWithDirective(node.else, styles, depth, "v-else");
        return thenHTML2 + "\n" + elseHTML;
      }
      return thenHTML2;
    }
    const thenHTML = this.generateNode(thenNode, styles, depth + 1);
    let result = [
      indent(`<template v-if="${condition}">`, depth),
      thenHTML,
      indent("</template>", depth)
    ].join("\n");
    if (node.else) {
      const elseHTML = this.generateNode(node.else, styles, depth + 1);
      result += "\n" + [
        indent("<template v-else>", depth),
        elseHTML,
        indent("</template>", depth)
      ].join("\n");
    }
    return result;
  }
  /**
   * Generates a node with an additional Vue directive.
   */
  generateNodeWithDirective(node, styles, depth, directive) {
    if (node.tag) {
      const attrs = this.buildVueAttributes(node);
      const children = node.children;
      if (!children || children.length === 0) {
        return indent(`<${node.tag} ${directive}${attrs} />`, depth);
      }
      const childrenHTML = children.map((child) => this.generateNode(child, styles, depth + 1)).join("\n");
      return [
        indent(`<${node.tag} ${directive}${attrs}>`, depth),
        childrenHTML,
        indent(`</${node.tag}>`, depth)
      ].join("\n");
    }
    const content = this.generateNode(node, styles, depth + 1);
    return [
      indent(`<template ${directive}>`, depth),
      content,
      indent("</template>", depth)
    ].join("\n");
  }
  /**
   * Generates Vue v-for loop.
   */
  generateLoop(node, styles, depth) {
    const collection = this.convertExprToVue(node.each);
    const itemVar = node.as ?? "item";
    const keyAttr = node.key ? ` :key="${this.convertExprToVue(node.key)}"` : "";
    const children = node.children ?? [];
    if (children.length === 1 && children[0]?.tag) {
      const child = children[0];
      const childAttrs = this.buildVueAttributes(child);
      const vForAttr = ` v-for="${itemVar} in ${collection}"${keyAttr}`;
      const grandchildren = child.children;
      if (!grandchildren || grandchildren.length === 0) {
        return indent(`<${child.tag}${vForAttr}${childAttrs} />`, depth);
      }
      const childrenHTML2 = grandchildren.map((gc) => this.generateNode(gc, styles, depth + 1)).join("\n");
      return [
        indent(`<${child.tag}${vForAttr}${childAttrs}>`, depth),
        childrenHTML2,
        indent(`</${child.tag}>`, depth)
      ].join("\n");
    }
    const childrenHTML = children.map((child) => this.generateNode(child, styles, depth + 1)).join("\n");
    return [
      indent(`<template v-for="${itemVar} in ${collection}"${keyAttr}>`, depth),
      childrenHTML,
      indent("</template>", depth)
    ].join("\n");
  }
  /**
   * Generates a component reference in Vue template.
   */
  generateComponentRef(node, depth) {
    const name = toPascalCase(node.component);
    const props = node.props;
    if (!props || Object.keys(props).length === 0) {
      return indent(`<${name} />`, depth);
    }
    const propsStr = Object.entries(props).map(([key, value]) => {
      if (isPureExpression(value)) {
        return `:${key}="${this.convertExprToVue(extractExpression(value))}"`;
      }
      return `${key}="${value}"`;
    }).join(" ");
    return indent(`<${name} ${propsStr} />`, depth);
  }
  /**
   * Builds Vue attribute string for an element node.
   */
  buildVueAttributes(node) {
    const parts = [];
    if (node.class) {
      const classExpr = this.buildVueClassBinding(node.class);
      parts.push(classExpr);
    }
    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        if (key === "class") continue;
        if (isPureExpression(value)) {
          parts.push(`:${key}="${this.convertExprToVue(extractExpression(value))}"`);
        } else {
          parts.push(`${key}="${value}"`);
        }
      }
    }
    if (node.style) {
      const entries = Object.entries(node.style).map(([prop, val]) => {
        if (isPureExpression(val)) {
          return `${prop}: ${this.convertExprToVue(extractExpression(val))}`;
        }
        return `${prop}: '${val}'`;
      }).join(", ");
      parts.push(`:style="{ ${entries} }"`);
    }
    if (parts.length === 0) return "";
    return " " + parts.join(" ");
  }
  /**
   * Builds a Vue class binding from an IR class expression.
   */
  buildVueClassBinding(classStr) {
    const segments = parseExpression(classStr);
    if (segments.length === 1 && segments[0]?.type === "static") {
      return `class="${segments[0].value.trim()}"`;
    }
    if (segments.length === 1 && segments[0]?.type === "expression") {
      return `:class="${this.convertExprToVue(segments[0].value)}"`;
    }
    const parts = segments.map((seg) => {
      if (seg.type === "expression") {
        return `\${${this.convertExprToVue(seg.value)}}`;
      }
      return seg.value;
    });
    return `:class="\`${parts.join("")}\`.trim()"`;
  }
  /**
   * Converts IR expression to Vue-compatible JavaScript.
   * Keeps `props.` prefix since Vue uses `props.X` in templates.
   */
  convertExprToVue(expr) {
    return expr;
  }
  /**
   * Maps an IR prop type to TypeScript type.
   */
  propToTSType(type, values) {
    if (type === "enum" && values) {
      return values.map((v) => `'${v}'`).join(" | ");
    }
    return irTypeToTSBase(type);
  }
};

export { VueTranspiler };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map