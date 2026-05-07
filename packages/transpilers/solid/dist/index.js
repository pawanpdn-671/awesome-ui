import { BaseTranspiler, irTypeToTSBase, indent, parseExpression, toPascalCase, isPureExpression, extractExpression } from '@awesomeui/transpiler-shared';

// src/solid-transpiler.ts
var SolidTranspiler = class extends BaseTranspiler {
  framework = "solid";
  fileExtension = ".tsx";
  language = "typescript";
  generate(ir, _options) {
    const componentName = this.getComponentName(ir.name);
    const sections = [];
    sections.push(this.generateImports());
    sections.push(this.generateStylesObject(ir));
    sections.push(this.generatePropsInterface(componentName, ir.props, ir.slots, ir.events));
    sections.push(this.generateComponent(ir, componentName));
    return sections.join("\n\n") + "\n";
  }
  generateImports() {
    return [
      "import { createSignal, createEffect, Show, For, Switch, Match, type Component } from 'solid-js';"
    ].join("\n");
  }
  generateStylesObject(ir) {
    const lines = [];
    lines.push("const styles = {");
    for (const [key, value] of Object.entries(ir.styles)) {
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
  generatePropsInterface(name, props, slots, events) {
    const lines = [];
    lines.push(`interface ${name}Props {`);
    for (const [propName, def] of Object.entries(props)) {
      const description = def.description;
      if (description) lines.push(`  /** ${description} */`);
      const tsType = this.propToSolidType(def.type, def.values);
      const optional = def.required ? "" : "?";
      lines.push(`  ${propName}${optional}: ${tsType};`);
    }
    if (slots) {
      for (const [slotName] of Object.entries(slots)) {
        const prop = slotName === "default" ? "children" : slotName;
        lines.push(`  ${prop}?: JSX.Element;`);
      }
    }
    if (events) {
      for (const eventName of Object.keys(events)) {
        const handler = this.eventToSolid(eventName);
        lines.push(`  ${handler}?: (...args: unknown[]) => void;`);
      }
    }
    lines.push("  class?: string;");
    lines.push("}");
    return lines.join("\n");
  }
  eventToSolid(eventName) {
    return eventName;
  }
  propToSolidType(type, values) {
    if (type === "enum" && values) {
      return values.map((v) => `'${v}'`).join(" | ");
    }
    if (type === "slot") {
      return "JSX.Element";
    }
    return irTypeToTSBase(type);
  }
  generateComponent(ir, componentName) {
    const propsStr = this.generatePropsDestructure(ir.props, ir.slots, ir.events);
    const jsxBody = this.generateJSX(ir.template, ir.styles, 2);
    const lines = [];
    lines.push(
      `const ${componentName}: Component<${componentName}Props> = (${propsStr}) => {`
    );
    lines.push(`  return (`);
    lines.push(jsxBody);
    lines.push(`  );`);
    lines.push(`};`);
    lines.push("");
    lines.push(`export default ${componentName};`);
    return lines.join("\n");
  }
  generatePropsDestructure(props, slots, events) {
    const parts = [];
    for (const [name, def] of Object.entries(props)) {
      if (def.default !== void 0) {
        const defaultValue = typeof def.default === "string" ? `'${def.default}'` : String(def.default);
        parts.push(`${name} = ${defaultValue}`);
      } else {
        parts.push(name);
      }
    }
    if (slots) {
      for (const slotName of Object.keys(slots)) {
        parts.push(slotName === "default" ? "children" : slotName);
      }
    }
    if (events) {
      for (const eventName of Object.keys(events)) {
        parts.push(eventName);
      }
    }
    parts.push("class");
    return `{ ${parts.join(", ")} }`;
  }
  generateJSX(node, styles, depth) {
    if (node.if !== void 0) return this.generateConditional(node, styles, depth);
    if (node.each !== void 0) return this.generateLoop(node, styles, depth);
    if (node.slot !== void 0) return this.generateSlot(node, depth);
    if (node.text !== void 0) return this.generateText(node.text, depth);
    if (node.component !== void 0) return this.generateComponentRef(node, depth);
    if (node.tag !== void 0) return this.generateElement(node, styles, depth);
    return "";
  }
  generateElement(node, styles, depth) {
    const tag = node.tag;
    const attrs = this.buildSolidAttributes(node);
    const children = node.children;
    if (!children || children.length === 0) {
      return indent(`<${tag}${attrs} />`, depth);
    }
    const childrenJSX = children.map((child) => this.generateJSX(child, styles, depth + 1)).filter((s) => s.length > 0).join("\n");
    return [
      indent(`<${tag}${attrs}>`, depth),
      childrenJSX,
      indent(`</${tag}>`, depth)
    ].join("\n");
  }
  generateText(text, depth) {
    const segments = parseExpression(text);
    if (segments.length === 1 && segments[0]?.type === "static") {
      return indent(segments[0].value, depth);
    }
    if (segments.length === 1 && segments[0]?.type === "expression") {
      return indent(`{${this.convertExprToSolid(segments[0].value)}}`, depth);
    }
    const parts = segments.map((seg) => {
      if (seg.type === "expression") {
        return `\${${this.convertExprToSolid(seg.value)}}`;
      }
      return seg.value;
    });
    return indent(`{\`${parts.join("")}\`}`, depth);
  }
  generateSlot(node, depth) {
    const slotName = node.slot;
    const propName = slotName === "default" ? "children" : slotName;
    if (node.fallback) {
      return indent(`{${propName} ?? '${node.fallback}'}`, depth);
    }
    return indent(`{${propName}}`, depth);
  }
  generateConditional(node, styles, depth) {
    const condition = this.convertExprToSolid(node.if);
    const thenContent = node.then ? this.generateJSX(node.then, styles, 0) : "";
    const elseContent = node.else ? this.generateJSX(node.else, styles, 0) : "";
    if (node.else) {
      return [
        indent(`<Switch>`, depth),
        indent(`<Match when={${condition}}>`, depth + 1),
        indent(thenContent, depth + 2),
        indent(`</Match>`, depth + 1),
        indent(`<Match when={!(${condition})}>`, depth + 1),
        indent(elseContent, depth + 2),
        indent(`</Match>`, depth + 1),
        indent(`</Switch>`, depth)
      ].join("\n");
    }
    return indent(`<Show when={${condition}}>${thenContent}</Show>`, depth);
  }
  generateLoop(node, styles, depth) {
    const collection = this.convertExprToSolid(node.each);
    const itemVar = node.as ?? "item";
    const children = node.children ?? [];
    const childrenJSX = children.map((child) => this.generateJSX(child, styles, 0)).join("\n");
    return indent(
      `<For each={${collection}}>{(item: typeof ${itemVar}) => (
${childrenJSX}
)}</For>`,
      depth
    );
  }
  generateComponentRef(node, depth) {
    const name = toPascalCase(node.component);
    const props = node.props;
    if (!props || Object.keys(props).length === 0) {
      return indent(`<${name} />`, depth);
    }
    const propsStr = Object.entries(props).map(([key, value]) => {
      if (isPureExpression(value)) {
        return `${key}={${this.convertExprToSolid(extractExpression(value))}}`;
      }
      return `${key}="${value}"`;
    }).join(" ");
    return indent(`<${name} ${propsStr} />`, depth);
  }
  buildSolidAttributes(node) {
    const parts = [];
    if (node.class) {
      const classBinding = this.buildSolidClassBinding(node.class);
      parts.push(classBinding);
    }
    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        if (key === "class") continue;
        if (key === "style") continue;
        const solidKey = this.attrToSolid(key);
        if (isPureExpression(value)) {
          const expr = this.convertExprToSolid(extractExpression(value));
          if (key === "disabled" || key === "checked" || key === "required" || key === "readonly") {
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
      const styleEntries = Object.entries(node.style).map(([prop, val]) => {
        const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        if (isPureExpression(val)) {
          return `${camelProp}: ${this.convertExprToSolid(extractExpression(val))}`;
        }
        return `${camelProp}: '${val}'`;
      }).join(", ");
      parts.push(`style={{ ${styleEntries} }}`);
    }
    if (parts.length === 0) return "";
    return " " + parts.join(" ");
  }
  buildSolidClassBinding(classStr) {
    const segments = parseExpression(classStr);
    if (segments.length === 1 && segments[0]?.type === "static") {
      return `class="${segments[0].value.trim()}"`;
    }
    if (segments.length === 1 && segments[0]?.type === "expression") {
      const expr = this.convertExprToSolid(segments[0].value);
      return `class={${expr}}`;
    }
    const staticClasses = [];
    const dynamicClasses = [];
    for (const seg of segments) {
      if (seg.type === "expression") {
        dynamicClasses.push(this.convertExprToSolid(seg.value));
      } else {
        staticClasses.push(seg.value.trim());
      }
    }
    const classParts = [];
    if (staticClasses.filter(Boolean).length > 0) {
      classParts.push(`'${staticClasses.filter(Boolean).join(" ")}'`);
    }
    classParts.push(...dynamicClasses);
    if (classParts.length === 1) {
      return `class={${classParts[0]}}`;
    }
    return `class={[${classParts.join(", ")}].filter(Boolean).join(' ')}`;
  }
  attrToSolid(attr) {
    const map = {
      class: "class",
      tabindex: "tabIndex",
      readonly: "readOnly",
      maxlength: "maxLength",
      colspan: "colspan"
    };
    return map[attr] ?? attr;
  }
  convertExprToSolid(expr) {
    return expr.replace(/props\.(\w+)/g, "$1").replace(/styles\.(\w+)(\[(\w+)\])?/g, "styles.$1$2");
  }
};

export { SolidTranspiler };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map