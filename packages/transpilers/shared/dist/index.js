import { validateComponentIR, isOk, err, ok, ValidationError } from '@awesomeui/core';

// src/base-transpiler.ts
var DEFAULT_OPTIONS = {
  styleAdapter: "tailwind",
  typescript: true,
  indentSize: 2
};
var BaseTranspiler = class {
  /**
   * Main transpilation method. Validates the IR, then generates framework code.
   *
   * @param input - A validated IComponentIR or raw unknown data
   * @param options - Optional transpilation options
   * @returns Result with the transpiled output or a validation error
   */
  transpile(input, options) {
    let ir;
    const validationResult = validateComponentIR(input);
    if (isOk(validationResult)) {
      ir = validationResult.data;
    } else {
      return err(validationResult.error);
    }
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options
    };
    try {
      const code = this.generate(ir, mergedOptions);
      const componentName = this.getComponentName(ir.name);
      return ok({
        code,
        filename: `${componentName}${this.fileExtension}`,
        language: this.language,
        framework: this.framework,
        componentName
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown transpilation error";
      return err(new ValidationError(`Transpilation failed: ${message}`, []));
    }
  }
  /**
   * Converts a kebab-case IR component name to the framework's naming convention.
   * Default implementation returns PascalCase. Override for different conventions.
   *
   * @param name - The kebab-case component name from IR
   * @returns The framework-appropriate component name
   */
  getComponentName(name) {
    return name.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join("");
  }
};

// src/expression-parser.ts
var EXPRESSION_PATTERN = /\{\{(.+?)\}\}/g;
function parseExpression(input) {
  const segments = [];
  let lastIndex = 0;
  const regex = new RegExp(EXPRESSION_PATTERN.source, EXPRESSION_PATTERN.flags);
  let match;
  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "static",
        value: input.slice(lastIndex, match.index)
      });
    }
    const expr = match[1];
    if (expr !== void 0) {
      segments.push({
        type: "expression",
        value: expr.trim()
      });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < input.length) {
    segments.push({
      type: "static",
      value: input.slice(lastIndex)
    });
  }
  return segments;
}
function isExpression(input) {
  const regex = new RegExp(EXPRESSION_PATTERN.source, EXPRESSION_PATTERN.flags);
  return regex.test(input);
}
function isPureExpression(input) {
  const segments = parseExpression(input);
  return segments.length === 1 && segments[0]?.type === "expression";
}
function extractExpression(input) {
  const segments = parseExpression(input);
  if (segments.length === 1 && segments[0]?.type === "expression") {
    return segments[0].value;
  }
  return input;
}

// src/utils.ts
function toPascalCase(str) {
  return str.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join("");
}
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
function indent(code, level) {
  const spaces = "  ".repeat(level);
  return code.split("\n").map((line) => line.trim() === "" ? "" : spaces + line).join("\n");
}
function wrapInQuotes(str) {
  return `"${str.replace(/"/g, '\\"')}"`;
}
function wrapInSingleQuotes(str) {
  return `'${str.replace(/'/g, "\\'")}'`;
}
function irTypeToTSBase(type) {
  const typeMap = {
    string: "string",
    number: "number",
    boolean: "boolean",
    object: "Record<string, unknown>",
    array: "unknown[]",
    function: "(...args: unknown[]) => unknown"
  };
  return typeMap[type] ?? "unknown";
}
function resolvePropsExpression(expr) {
  if (expr.startsWith("props.")) {
    return expr.slice(6);
  }
  return expr;
}

export { BaseTranspiler, extractExpression, indent, irTypeToTSBase, isExpression, isPureExpression, parseExpression, resolvePropsExpression, toCamelCase, toPascalCase, wrapInQuotes, wrapInSingleQuotes };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map