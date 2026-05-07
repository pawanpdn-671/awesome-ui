'use strict';

var transpilerShared = require('@awesomeui/transpiler-shared');

// src/svelte-transpiler.ts
var SvelteTranspiler = class extends transpilerShared.BaseTranspiler {
  framework = "svelte";
  fileExtension = ".svelte";
  language = "svelte";
  generate(ir, _options) {
    const sections = [];
    sections.push(this.generateScript(ir));
    sections.push(this.generateTemplate(ir));
    return sections.join("\n\n") + "\n";
  }
  generateScript(ir) {
    const lines = [];
    lines.push("<script>");
    const propNames = Object.keys(ir.props);
    const eventNames = ir.events ? Object.keys(ir.events) : [];
    if (propNames.length > 0 || eventNames.length > 0) {
      const allProps = [];
      for (const [name, def] of Object.entries(ir.props)) {
        if (def.default !== void 0) {
          const defVal = typeof def.default === "string" ? `'${def.default}'` : String(def.default);
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
      allProps.push("children");
      allProps.push("...restProps");
      lines.push(`  let { ${allProps.join(", ")} } = $props();`);
    }
    lines.push("");
    lines.push(this.generateStylesObject(ir.styles));
    lines.push("</script>");
    return lines.join("\n");
  }
  eventToHandler(eventName) {
    const map = {
      onClick: "onclick",
      onDismiss: "ondismiss",
      onFocus: "onfocus",
      onBlur: "onblur",
      onInput: "oninput",
      onChange: "onchange",
      onToggle: "ontoggle",
      onSelect: "onselect"
    };
    return map[eventName] ?? eventName;
  }
  generateStylesObject(stylesMap) {
    const lines = [];
    lines.push("  const styles = {");
    for (const [key, value] of Object.entries(stylesMap)) {
      if (typeof value === "string") {
        lines.push(`    ${key}: '${value}',`);
      } else if (typeof value === "object" && value !== null) {
        lines.push(`    ${key}: {`);
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === "string") {
            lines.push(`      ${subKey}: '${subValue}',`);
          } else {
            lines.push(`      ${subKey}: ${JSON.stringify(subValue)},`);
          }
        }
        lines.push("    },");
      }
    }
    lines.push("  } as const;");
    return lines.join("\n");
  }
  generateTemplate(ir) {
    const lines = [];
    lines.push("<template>");
    lines.push(this.generateNode(ir.template, ir.styles, 1));
    lines.push("</template>");
    return lines.join("\n");
  }
  generateNode(node, styles, depth) {
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
    const attrs = this.buildSvelteAttributes(node);
    const children = node.children;
    if (!children || children.length === 0) {
      return transpilerShared.indent(`<${tag}${attrs} />`, depth);
    }
    const childrenHTML = children.map((child) => this.generateNode(child, styles, depth + 1)).filter((s) => s.length > 0).join("\n");
    return [
      transpilerShared.indent(`<${tag}${attrs}>`, depth),
      childrenHTML,
      transpilerShared.indent(`</${tag}>`, depth)
    ].join("\n");
  }
  generateText(text, depth) {
    const segments = transpilerShared.parseExpression(text);
    if (segments.length === 1 && segments[0]?.type === "static") {
      return transpilerShared.indent(segments[0].value, depth);
    }
    const parts = segments.map((seg) => {
      if (seg.type === "expression") {
        return `{${this.convertExprToSvelte(seg.value)}}`;
      }
      return seg.value;
    });
    return transpilerShared.indent(parts.join(""), depth);
  }
  generateSlot(node, depth) {
    const slotName = node.slot;
    if (slotName === "default") {
      if (node.fallback) {
        return [
          transpilerShared.indent("{#if children}", depth),
          transpilerShared.indent("{@render children?.()}", depth + 1),
          transpilerShared.indent("{:else}", depth),
          transpilerShared.indent(node.fallback, depth + 1),
          transpilerShared.indent("{/if}", depth)
        ].join("\n");
      }
      return transpilerShared.indent("{@render children?.()}", depth);
    }
    if (node.fallback) {
      return [
        transpilerShared.indent(`{#if ${slotName}}`, depth),
        transpilerShared.indent(`{@render ${slotName}?.()}`, depth + 1),
        transpilerShared.indent("{:else}", depth),
        transpilerShared.indent(node.fallback, depth + 1),
        transpilerShared.indent("{/if}", depth)
      ].join("\n");
    }
    return transpilerShared.indent(`{@render ${slotName}?.()}`, depth);
  }
  generateConditional(node, styles, depth) {
    const condition = this.convertExprToSvelte(node.if);
    if (!node.then) return "";
    const thenHTML = this.generateNode(node.then, styles, depth + 1);
    let result = [
      transpilerShared.indent(`{#if ${condition}}`, depth),
      thenHTML
    ].join("\n");
    if (node.else) {
      const elseHTML = this.generateNode(node.else, styles, depth + 1);
      result += "\n" + [
        transpilerShared.indent("{:else}", depth),
        elseHTML
      ].join("\n");
    }
    result += "\n" + transpilerShared.indent("{/if}", depth);
    return result;
  }
  generateLoop(node, styles, depth) {
    const collection = this.convertExprToSvelte(node.each);
    const itemVar = node.as ?? "item";
    const keyExpr = node.key ? `(${itemVar}) => ${this.convertExprToSvelte(node.key)}` : `(${itemVar}) => ${itemVar}`;
    const children = node.children ?? [];
    const childrenHTML = children.map((child) => this.generateNode(child, styles, depth + 1)).join("\n");
    return [
      transpilerShared.indent(`{#each ${collection} as ${itemVar} (${keyExpr})}`, depth),
      childrenHTML,
      transpilerShared.indent("{/each}", depth)
    ].join("\n");
  }
  generateComponentRef(node, depth) {
    const name = transpilerShared.toPascalCase(node.component);
    const props = node.props;
    if (!props || Object.keys(props).length === 0) {
      return transpilerShared.indent(`<${name} />`, depth);
    }
    const propsStr = Object.entries(props).map(([key, value]) => {
      if (transpilerShared.isPureExpression(value)) {
        return `${key}={${this.convertExprToSvelte(transpilerShared.extractExpression(value))}}`;
      }
      return `${key}="${value}"`;
    }).join(" ");
    return transpilerShared.indent(`<${name} ${propsStr} />`, depth);
  }
  buildSvelteAttributes(node) {
    const parts = [];
    if (node.class) {
      const classBinding = this.buildSvelteClassBinding(node.class);
      parts.push(classBinding);
    }
    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        if (key === "class") continue;
        if (key === "style") continue;
        if (transpilerShared.isPureExpression(value)) {
          parts.push(`${key}={${this.convertExprToSvelte(transpilerShared.extractExpression(value))}}`);
        } else {
          if (value === "true" || value === "false") {
            parts.push(`${key}={${value}}`);
          } else {
            parts.push(`${key}="${value}"`);
          }
        }
      }
    }
    if (node.style) {
      const entries = Object.entries(node.style).map(([prop, val]) => {
        const cssProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
        if (transpilerShared.isPureExpression(val)) {
          return `${cssProp}: ${this.convertExprToSvelte(transpilerShared.extractExpression(val))}`;
        }
        return `${cssProp}: ${val}`;
      }).join("; ");
      parts.push(`style="${entries}"`);
    }
    if (parts.length === 0) return "";
    return " " + parts.join(" ");
  }
  buildSvelteClassBinding(classStr) {
    const segments = transpilerShared.parseExpression(classStr);
    if (segments.length === 1 && segments[0]?.type === "static") {
      return `class="${segments[0].value.trim()}"`;
    }
    if (segments.length === 1 && segments[0]?.type === "expression") {
      const expr = segments[0].value;
      if (expr.includes("?")) {
        const ternary = this.convertExprToSvelte(expr);
        return `class={${ternary}}`;
      }
      return `class={${this.convertExprToSvelte(expr)}}`;
    }
    const staticClasses = [];
    const dynamicClasses = [];
    for (const seg of segments) {
      if (seg.type === "expression") {
        dynamicClasses.push(this.convertExprToSvelte(seg.value));
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
  convertExprToSvelte(expr) {
    return expr.replace(/props\.(\w+)/g, "$1").replace(/styles\.(\w+)/g, "styles.$1");
  }
};

exports.SvelteTranspiler = SvelteTranspiler;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map