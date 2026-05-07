import { irTypeToTSBase, indent, parseExpression, toPascalCase, isPureExpression, extractExpression, BaseTranspiler } from '@awesomeui/transpiler-shared';

// src/react-transpiler.ts
function generatePropsInterface(componentName, props, slots, events) {
  const lines = [];
  lines.push(`export interface ${componentName}Props {`);
  for (const [name, def] of Object.entries(props)) {
    const description = def.description;
    if (description) {
      lines.push(`  /** ${description} */`);
    }
    const tsType = propToTSType(def.type, def.values);
    const optional = def.required ? "" : "?";
    lines.push(`  ${name}${optional}: ${tsType};`);
  }
  if (slots) {
    for (const [name, def] of Object.entries(slots)) {
      if (name === "default") {
        const description = typeof def === "string" ? def : def.description;
        if (description) {
          lines.push(`  /** ${description} */`);
        }
        lines.push("  children?: React.ReactNode;");
      } else {
        const description = typeof def === "string" ? def : def.description;
        if (description) {
          lines.push(`  /** ${description} */`);
        }
        lines.push(`  ${name}?: React.ReactNode;`);
      }
    }
  }
  if (events) {
    for (const [name, def] of Object.entries(events)) {
      const description = typeof def === "string" ? def : def.description;
      if (description) {
        lines.push(`  /** ${description} */`);
      }
      lines.push(`  ${name}?: (...args: unknown[]) => void;`);
    }
  }
  lines.push("  /** Additional CSS class names */");
  lines.push("  className?: string;");
  lines.push("  /** Ref forwarding */");
  lines.push("  ref?: React.Ref<HTMLElement>;");
  lines.push("}");
  return lines.join("\n");
}
function generatePropsDestructure(props, slots, events) {
  const parts = [];
  for (const [name, def] of Object.entries(props)) {
    if (def.default !== void 0) {
      const defaultValue = formatDefault(def.default);
      parts.push(`${name} = ${defaultValue}`);
    } else {
      parts.push(name);
    }
  }
  if (slots) {
    for (const slotName of Object.keys(slots)) {
      if (slotName === "default") {
        parts.push("children");
      } else {
        parts.push(slotName);
      }
    }
  }
  if (events) {
    for (const eventName of Object.keys(events)) {
      parts.push(eventName);
    }
  }
  parts.push("className");
  parts.push("ref");
  parts.push("...restProps");
  return `{ ${parts.join(", ")} }`;
}
function propToTSType(type, values) {
  if (type === "enum" && values) {
    return values.map((v) => `'${v}'`).join(" | ");
  }
  if (type === "slot") {
    return "React.ReactNode";
  }
  return irTypeToTSBase(type);
}
function formatDefault(value) {
  if (typeof value === "string") {
    return `'${value}'`;
  }
  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }
  return JSON.stringify(value);
}
function generateJSX(node, styles, depth, isRoot = false) {
  if (node.if !== void 0) {
    return generateConditional(node, styles, depth);
  }
  if (node.each !== void 0) {
    return generateLoop(node, styles, depth);
  }
  if (node.slot !== void 0) {
    return generateSlot(node, depth);
  }
  if (node.text !== void 0) {
    return generateText(node.text, depth);
  }
  if (node.component !== void 0) {
    return generateComponentRef(node, depth);
  }
  if (node.tag !== void 0) {
    return generateElement(node, styles, depth, isRoot);
  }
  return "";
}
function generateElement(node, styles, depth, isRoot) {
  const tag = node.tag;
  const attrs = buildAttributes(node, styles, isRoot);
  const children = node.children;
  if (!children || children.length === 0) {
    return indent(`<${tag}${attrs} />`, depth);
  }
  const childrenJSX = children.map((child) => generateJSX(child, styles, depth + 1, false)).filter((s) => s.length > 0).join("\n");
  return [
    indent(`<${tag}${attrs}>`, depth),
    childrenJSX,
    indent(`</${tag}>`, depth)
  ].join("\n");
}
function generateText(text, depth) {
  const segments = parseExpression(text);
  if (segments.length === 1 && segments[0]?.type === "static") {
    return indent(segments[0].value, depth);
  }
  if (segments.length === 1 && segments[0]?.type === "expression") {
    return indent(`{${convertExprToReact(segments[0].value)}}`, depth);
  }
  const parts = segments.map((seg) => {
    if (seg.type === "expression") {
      return `\${${convertExprToReact(seg.value)}}`;
    }
    return seg.value;
  });
  return indent(`{\`${parts.join("")}\`}`, depth);
}
function generateSlot(node, depth) {
  const slotName = node.slot;
  const propName = slotName === "default" ? "children" : slotName;
  if (node.fallback) {
    return indent(`{${propName} ?? '${node.fallback}'}`, depth);
  }
  return indent(`{${propName}}`, depth);
}
function generateConditional(node, styles, depth, _isRoot) {
  const condition = convertExprToReact(node.if);
  const thenJSX = node.then ? generateJSX(node.then, styles, 0, false) : "";
  if (node.else) {
    const elseJSX = generateJSX(node.else, styles, 0, false);
    return indent(`{${condition} ? (
${indent(thenJSX, 1)}
) : (
${indent(elseJSX, 1)}
)}`, depth);
  }
  return indent(`{${condition} && (
${indent(thenJSX, 1)}
)}`, depth);
}
function generateLoop(node, styles, depth, _isRoot) {
  const collection = convertExprToReact(node.each);
  const itemVar = node.as ?? "item";
  const keyExpr = node.key ? convertExprToReact(node.key) : `index`;
  const needsIndex = !node.key;
  const childrenJSX = (node.children ?? []).map((child) => generateJSX(child, styles, depth + 2, false)).join("\n");
  const params = needsIndex ? `(${itemVar}, index)` : `(${itemVar})`;
  return indent(
    `{${collection}.map(${params} => (
${indent(`<React.Fragment key={${keyExpr}}>`, depth + 1)}
${childrenJSX}
${indent("</React.Fragment>", depth + 1)}
${indent(")", depth)}))}`,
    depth
  );
}
function generateComponentRef(node, depth) {
  const name = toPascalCase(node.component);
  const props = node.props;
  if (!props || Object.keys(props).length === 0) {
    return indent(`<${name} />`, depth);
  }
  const propsStr = Object.entries(props).map(([key, value]) => {
    if (isPureExpression(value)) {
      return `${key}={${convertExprToReact(extractExpression(value))}}`;
    }
    return `${key}="${value}"`;
  }).join(" ");
  return indent(`<${name} ${propsStr} />`, depth);
}
function buildAttributes(node, _styles, isRoot) {
  const parts = [];
  if (node.class) {
    const classExpr = buildClassExpression(node.class, isRoot);
    parts.push(`className={${classExpr}}`);
  }
  if (node.attributes) {
    for (const [key, value] of Object.entries(node.attributes)) {
      if (key === "class") continue;
      const reactKey = convertAttrName(key);
      if (isPureExpression(value)) {
        parts.push(`${reactKey}={${convertExprToReact(extractExpression(value))}}`);
      } else {
        parts.push(`${reactKey}="${value}"`);
      }
    }
  }
  if (node.style) {
    const styleEntries = Object.entries(node.style).map(([prop, val]) => {
      const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (isPureExpression(val)) {
        return `${camelProp}: ${convertExprToReact(extractExpression(val))}`;
      }
      return `${camelProp}: '${val}'`;
    }).join(", ");
    parts.push(`style={{ ${styleEntries} }}`);
  }
  if (parts.length === 0) return "";
  return " " + parts.join(" ");
}
function buildClassExpression(classStr, includeClassName) {
  const segments = parseExpression(classStr);
  if (segments.length === 1 && segments[0]?.type === "static") {
    const staticVal = segments[0].value.trim();
    if (includeClassName && staticVal) {
      return `cn('${staticVal}', className)`;
    }
    if (includeClassName) {
      return "className";
    }
    return `'${staticVal}'`;
  }
  if (segments.length === 1 && segments[0]?.type === "expression") {
    const expr = convertExprToReact(segments[0].value);
    if (includeClassName) {
      return `cn(${expr}, className)`;
    }
    return expr;
  }
  const args = [];
  let staticBuf = "";
  for (const seg of segments) {
    if (seg.type === "static") {
      staticBuf += seg.value;
    } else {
      if (staticBuf.trim()) {
        args.push(`'${staticBuf.trim()}'`);
      }
      staticBuf = "";
      args.push(toCnArg(convertExprToReact(seg.value)));
    }
  }
  if (staticBuf.trim()) {
    args.push(`'${staticBuf.trim()}'`);
  }
  if (includeClassName) {
    args.push("className");
  }
  if (args.length === 0) {
    return includeClassName ? "className" : "''";
  }
  if (args.length === 1) {
    return args[0];
  }
  return `cn(${args.join(", ")})`;
}
function toCnArg(expr) {
  const ternaryMatch = expr.match(/^(.+?)\s*\?\s*(styles\.[^\s]+)\s*:\s*''$/);
  if (ternaryMatch) {
    return `${ternaryMatch[1]} && ${ternaryMatch[2]}`;
  }
  return expr;
}
function convertExprToReact(expr) {
  let result = expr.replace(/props\.(\w+)/g, "$1");
  result = result.replace(/props\.(\w+)/g, "$1");
  return result;
}
function convertAttrName(name) {
  const attrMap = {
    class: "className",
    for: "htmlFor",
    tabindex: "tabIndex",
    readonly: "readOnly",
    maxlength: "maxLength",
    "aria-hidden": "aria-hidden",
    "aria-disabled": "aria-disabled",
    "aria-busy": "aria-busy"
  };
  return attrMap[name] ?? name;
}

// src/react-transpiler.ts
var ReactTranspiler = class extends BaseTranspiler {
  framework = "react";
  fileExtension = ".tsx";
  language = "typescript";
  /**
   * Generates the complete React component code from validated IR.
   */
  generate(ir, _options) {
    const componentName = this.getComponentName(ir.name);
    const sections = [];
    sections.push(this.generateImports());
    sections.push(this.generateStylesObject(ir));
    sections.push(generatePropsInterface(componentName, ir.props, ir.slots, ir.events));
    sections.push(this.generateComponent(ir, componentName));
    sections.push(`${componentName}.displayName = '${componentName}';`);
    return sections.join("\n\n") + "\n";
  }
  /**
   * Generates React import statements.
   */
  generateImports() {
    const lines = [];
    lines.push(`import React from 'react';`);
    lines.push(`import { cn } from '@/lib/utils';`);
    return lines.join("\n");
  }
  /**
   * Generates the styles constant object from IR styles.
   * This allows runtime access to variant-based class names.
   */
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
  /**
   * Generates the React functional component with forwardRef.
   */
  generateComponent(ir, componentName) {
    const propsDestructure = generatePropsDestructure(ir.props, ir.slots, ir.events);
    const jsxBody = generateJSX(ir.template, ir.styles, 2, true);
    const lines = [];
    lines.push(
      `export const ${componentName} = React.forwardRef<HTMLElement, ${componentName}Props>(function ${componentName}(`
    );
    lines.push(`  ${propsDestructure},`);
    lines.push(`) {`);
    lines.push(`  return (`);
    lines.push(jsxBody);
    lines.push(`  );`);
    lines.push(`});`);
    return lines.join("\n");
  }
};

export { ReactTranspiler, generateJSX, generatePropsDestructure, generatePropsInterface };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map