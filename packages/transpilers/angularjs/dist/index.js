import { BaseTranspiler, toPascalCase, toCamelCase, indent, parseExpression, isPureExpression, extractExpression } from '@awesomeui/transpiler-shared';

// src/angularjs-transpiler.ts
var AngularJSTranspiler = class extends BaseTranspiler {
  framework = "angularjs";
  fileExtension = ".js";
  language = "javascript";
  generate(ir, _options) {
    const componentName = toPascalCase(ir.name);
    const bindings = this.generateBindings(ir.props, ir.events);
    const template = this.generateTemplateString(ir);
    const controller = this.generateController(ir, componentName);
    return [
      `'use strict';`,
      ``,
      `angular.module('awesomeui').component('${toCamelCase(ir.name)}', {`,
      `  bindings: {`,
      ...bindings,
      `  },`,
      `  template: ${template},`,
      `  controller: [${controller}`,
      `});`,
      ``
    ].join("\n");
  }
  generateBindings(props, events) {
    const lines = [];
    for (const [name, def] of Object.entries(props)) {
      const bindingType = this.getBindingType(def.type);
      const description = def.description ? `  // ${def.description}` : "";
      if (description) lines.push(description);
      lines.push(`    ${toCamelCase(name)}: '${bindingType}',`);
    }
    if (events) {
      for (const eventName of Object.keys(events)) {
        const handlerName = toCamelCase(eventName.replace(/^on/, ""));
        lines.push(`    on${toPascalCase(handlerName)}: '&',`);
      }
    }
    return lines;
  }
  getBindingType(propType) {
    switch (propType) {
      case "string":
        return "@";
      case "number":
        return "@";
      case "boolean":
        return "<";
      case "enum":
        return "@";
      case "object":
        return "<";
      case "array":
        return "<";
      default:
        return "@";
    }
  }
  generateTemplateString(ir) {
    const node = ir.template;
    const html = this.generateNode(node, ir.styles, 0);
    const escaped = html.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$").replace(/'/g, "\\'");
    return `'${escaped}'`;
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
    const attrs = this.buildAngularAttributes(node);
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
  generateText(text, depth) {
    const segments = parseExpression(text);
    if (segments.length === 1 && segments[0]?.type === "static") {
      return indent(segments[0].value, depth);
    }
    const parts = segments.map((seg) => {
      if (seg.type === "expression") {
        return `{{ ${this.convertExpr(seg.value)} }}`;
      }
      return seg.value;
    });
    return indent(parts.join(""), depth);
  }
  generateSlot(node, depth) {
    const slotName = node.slot;
    if (slotName === "default") {
      return indent(`<ng-transclude></ng-transclude>`, depth);
    }
    return indent(`<ng-transclude ng-if="$ctrl.${toCamelCase(slotName)}" ng-transclude-slot="${slotName}"></ng-transclude>`, depth);
  }
  generateConditional(node, styles, depth) {
    const condition = this.convertExpr(node.if);
    const thenHTML = node.then ? this.generateNode(node.then, styles, depth + 1) : "";
    let result = [
      indent(`<!-- ngIf: ${condition} -->`, depth),
      indent(`<span ng-if="${condition}">`, depth),
      thenHTML,
      indent(`</span>`, depth)
    ].join("\n");
    if (node.else) {
      const elseHTML = this.generateNode(node.else, styles, depth + 1);
      result += "\n" + [
        indent(`<span ng-if="!(${condition})">`, depth),
        elseHTML,
        indent(`</span>`, depth)
      ].join("\n");
    }
    return result;
  }
  generateLoop(node, styles, depth) {
    const collection = this.convertExpr(node.each);
    const itemVar = node.as ?? "item";
    const children = node.children ?? [];
    const childrenHTML = children.map((child) => this.generateNode(child, styles, depth + 1)).join("\n");
    return [
      indent(`<span ng-repeat="${itemVar} in ${collection}">`, depth),
      childrenHTML,
      indent(`</span>`, depth)
    ].join("\n");
  }
  generateComponentRef(node, depth) {
    const name = toCamelCase(node.component);
    const props = node.props;
    if (!props || Object.keys(props).length === 0) {
      return indent(`<${name}></${name}>`, depth);
    }
    const propsStr = Object.entries(props).map(([key, value]) => {
      if (isPureExpression(value)) {
        return `${toCamelCase(key)}="$ctrl.${this.convertExpr(extractExpression(value))}"`;
      }
      return `${toCamelCase(key)}="${value}"`;
    }).join(" ");
    return indent(`<${name} ${propsStr}></${name}>`, depth);
  }
  buildAngularAttributes(node) {
    const parts = [];
    if (node.class) {
      const classBinding = this.buildAngularClassBinding(node.class);
      parts.push(classBinding);
    }
    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        if (key === "class") continue;
        if (key === "style") continue;
        if (isPureExpression(value)) {
          const expr = this.convertExpr(extractExpression(value));
          parts.push(`ng-attr-${key}="{{ ${expr} }}"`);
        } else {
          parts.push(`${key}="${value}"`);
        }
      }
    }
    if (node.style) {
      const styleEntries = Object.entries(node.style).map(([prop, val]) => {
        if (isPureExpression(val)) {
          return `${prop}: ${this.convertExpr(extractExpression(val))}`;
        }
        return `${prop}: ${val}`;
      }).join("; ");
      parts.push(`style="${styleEntries}"`);
    }
    if (parts.length === 0) return "";
    return " " + parts.join(" ");
  }
  buildAngularClassBinding(classStr) {
    const segments = parseExpression(classStr);
    if (segments.length === 1 && segments[0]?.type === "static") {
      return `class="${segments[0].value.trim()}"`;
    }
    if (segments.length === 1 && segments[0]?.type === "expression") {
      return `ng-class="${this.convertExpr(segments[0].value)}"`;
    }
    const dynamicParts = [];
    const staticParts = [];
    for (const seg of segments) {
      if (seg.type === "expression") {
        dynamicParts.push(this.convertExpr(seg.value));
      } else {
        staticParts.push(seg.value.trim());
      }
    }
    const classAttr = staticParts.filter(Boolean).join(" ");
    const result = [];
    if (classAttr) {
      result.push(`class="${classAttr}"`);
    }
    if (dynamicParts.length > 0) {
      const ngClassExpr = `[${dynamicParts.map((p) => `'${p}'`).join(", ")}].join(' ')`;
      result.push(`ng-class="{{ ${ngClassExpr} }}"`);
    }
    return result.join(" ");
  }
  generateController(_ir, _componentName) {
    const lines = [];
    lines.push(`function $ctrl() {`);
    lines.push(`}`);
    const protoLines = [];
    protoLines.push(`');
  return $ctrl;
}]`);
    return lines.join("\n") + protoLines.join("\n");
  }
  convertExpr(expr) {
    return expr.replace(/props\.(\w+)/g, "$ctrl.$1").replace(/styles\.(\w+)/g, "$ctrl.styles.$1");
  }
};

export { AngularJSTranspiler };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map