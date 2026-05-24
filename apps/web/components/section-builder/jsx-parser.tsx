import { createElement, ReactNode, Fragment } from "react";
import { AlertCircle } from "lucide-react";
import { getBuilderPalette } from "@/lib/builder-palettes";
import { previewComponents } from "./preview-components";

const NATIVE_HTML_TAGS = [
  "section", "div", "header", "nav", "main", "footer", "article", "aside",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "ul", "ol", "li", "a", "img",
  "input", "br", "hr", "strong", "b", "em", "i",
];

function isNativeTag(name: string): boolean {
  return NATIVE_HTML_TAGS.includes(name.toLowerCase());
}

export function extractJSX(code: string): string {
  let cleaned = code.replace(/^import\s+.*?;?\s*$/gm, "").trim();

  const noParen = cleaned.match(/return\s*</);
  if (noParen) {
    const start = noParen.index! + noParen[0].length - 1;
    let rest = cleaned.slice(start);
    const semicolon = rest.lastIndexOf(";");
    if (semicolon > 0) rest = rest.slice(0, semicolon);
    return rest.trim();
  }

  const returnMatch = code.match(/return\s*\(/);
  if (returnMatch) {
    const start = returnMatch.index! + returnMatch[0].length;
    let depth = 1;
    let i = start;
    while (i < code.length && depth > 0) {
      if (code[i] === "(") depth++;
      if (code[i] === ")") depth--;
      if (code[i] === "{") {
        let braceDepth = 1;
        i++;
        while (i < code.length && braceDepth > 0) {
          if (code[i] === "{") braceDepth++;
          if (code[i] === "}") braceDepth--;
          i++;
        }
        continue;
      }
      i++;
    }
    const inner = code.slice(start, i - 1).trim();
    const semicolon = inner.lastIndexOf(";");
    return semicolon > 0 ? inner.slice(0, semicolon).trim() : inner;
  }

  if (cleaned.startsWith("<")) {
    return cleaned.replace(/;\s*$/, "").trim();
  }

  return code;
}

function parseAttrs(tagStr: string): Record<string, any> {
  const props: Record<string, any> = {};
  const attrRe = /(\w+)=["]([^"]*)["]/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(tagStr)) !== null) {
    if (m[1] && m[1] !== "key") props[m[1]] = m[2];
  }
  const classMatch = tagStr.match(/className=["]([^"]*)["]/);
  if (classMatch) props.className = classMatch[1];
  const variantMatch = tagStr.match(/variant=["]([^"]*)["]/);
  if (variantMatch) props.variant = variantMatch[1];
  const sizeMatch = tagStr.match(/size=["]([^"]*)["]/);
  if (sizeMatch) props.size = sizeMatch[1];
  const valueMatch = tagStr.match(/value=["]([^"]*)["]/);
  if (valueMatch) props.value = valueMatch[1];
  const checkedMatch = tagStr.match(/checked/);
  if (checkedMatch) props.checked = true;
  const selectedMatch = tagStr.match(/selected/);
  if (selectedMatch) props.selected = true;
  const disabledMatch = tagStr.match(/disabled/);
  if (disabledMatch) props.disabled = true;
  return props;
}

function findCloseTag(content: string, tagName: string): number {
  let openCount = 0;
  const openTag = `<${tagName}`;
  const closeTag = `</${tagName}>`;
  let i = 0;
  while (i < content.length) {
    if (content.startsWith(closeTag, i)) {
      if (openCount === 0) return i;
      openCount--;
      i += closeTag.length;
      continue;
    }
    if (content.startsWith(openTag, i)) {
      const nextChar = content[i + openTag.length];
      if (nextChar === ">" || nextChar === " " || nextChar === "\n" || nextChar === "/") {
        openCount++;
        const gtIdx = content.indexOf(">", i);
        if (gtIdx === -1) return -1;
        if (content[gtIdx - 1] === "/") openCount--;
        i = gtIdx + 1;
        continue;
      }
    }
    if (content[i] === "{") {
      let braceDepth = 1;
      i++;
      while (i < content.length && braceDepth > 0) {
        if (content[i] === "{") braceDepth++;
        if (content[i] === "}") braceDepth--;
        i++;
      }
      continue;
    }
    i++;
  }
  return -1;
}

function parseTagName(tagStr: string): string {
  return (tagStr.split(/\s+/)[0] || "").replace(/\/$/, "");
}

function isSelfClosing(tagStr: string, tagName: string): boolean {
  return tagStr.endsWith("/") || /^(input|img|br|hr)$/.test(tagName);
}

function parseJsxExpression(content: string): ReactNode[] {
  const result: ReactNode[] = [];
  let i = 0;
  while (i < content.length) {
    if (content[i] === "<") {
      const slice = content.slice(i);
      const element = parseSingleElement(slice);
      if (element) {
        result.push(element.node);
        i += element.length;
        continue;
      }
    }
    i++;
  }
  return result;
}

interface ParsedElement {
  node: ReactNode;
  length: number;
}

function parseSingleElement(content: string): ParsedElement | null {
  const trimmed = content.trimStart();
  const offset = content.length - trimmed.length;

  if (!trimmed.startsWith("<") || trimmed.startsWith("</")) {
    return null;
  }

  const tagEnd = trimmed.indexOf(">");
  if (tagEnd === -1) return null;

  const tagStr = trimmed.slice(1, tagEnd);
  const tagName = parseTagName(tagStr);
  if (!tagName) return null;

  const selfClosing = isSelfClosing(tagStr, tagName);
  const props = parseAttrs(tagStr);

  if (selfClosing) {
    const Comp = previewComponents[tagName] || (isNativeTag(tagName) ? tagName : null);
    const node = Comp ? createElement(Comp, props) : null;
    return { node, length: offset + tagEnd + 1 };
  }

  const rest = trimmed.slice(tagEnd + 1);
  const closeIdx = findCloseTag(rest, tagName);
  if (closeIdx === -1) return null;

  const innerContent = rest.slice(0, closeIdx).trim();
  const children = parseChildrenAdvanced(innerContent);

  const key = props.key || undefined;
  delete props.key;

  let node: ReactNode = null;
  const Comp = previewComponents[tagName];

  if (Comp) {
    node = createElement(Comp, { ...props, key }, ...children);
  } else if (isNativeTag(tagName)) {
    node = createElement(tagName as any, { ...props, key }, ...children);
  } else if (children.length > 0) {
    node = createElement("div", { className: props.className, key }, ...children);
  } else {
    node = null;
  }

  const totalLength = offset + tagEnd + 1 + closeIdx + `</${tagName}>`.length;
  return { node, length: totalLength };
}

function parseChildrenAdvanced(content: string): ReactNode[] {
  if (!content) return [];

  const children: ReactNode[] = [];
  let i = 0;
  let textBuf = "";

  while (i < content.length) {
    if (content[i] === "{") {
      let braceDepth = 1;
      const exprStart = i + 1;
      i++;

      while (i < content.length && braceDepth > 0) {
        if (content[i] === "{") braceDepth++;
        if (content[i] === "}") braceDepth--;
        i++;
      }

      const expr = content.slice(exprStart, i - 1).trim();

      if (expr.startsWith("<") || expr.includes(".map(") || expr.includes("=>")) {
        const exprChildren = parseJsxExpression(expr);
        if (exprChildren.length > 0) {
          const trimmedText = textBuf.replace(/[\n\t]/g, " ").trim();
          if (trimmedText) children.push(trimmedText);
          textBuf = "";

          if (exprChildren.length === 1) {
            children.push(exprChildren[0]);
          } else {
            children.push(createElement(Fragment, { key: `expr-${exprStart}` }, ...exprChildren));
          }
        }
      }
      continue;
    }

    if (content[i] === "<") {
      if (content[i + 1] === "/") {
        const trimmedText = textBuf.replace(/[\n\t]/g, " ").trim();
        if (trimmedText) children.push(trimmedText);
        break;
      }

      const trimmedText = textBuf.replace(/[\n\t]/g, " ").trim();
      if (trimmedText) children.push(trimmedText);
      textBuf = "";

      const element = parseSingleElement(content.slice(i));
      if (element && element.node !== null) {
        children.push(element.node);
        i += element.length;
        continue;
      }
    }

    textBuf += content[i];
    i++;
  }

  const trimmedText = textBuf.replace(/[\n\t]/g, " ").trim();
  if (trimmedText) children.push(trimmedText);

  return children;
}

export function renderJSXAdvanced(jsx: string): ReactNode {
  const element = parseSingleElement(jsx);
  return element?.node ?? null;
}

const LIGHT_SURFACE_VARS: Record<string, string> = {
  "--color-surface-50": "#1a1a1a",
  "--color-surface-100": "#2a2a2a",
  "--color-surface-200": "#3a3a3a",
  "--color-surface-300": "#555555",
  "--color-surface-400": "#888888",
  "--color-surface-500": "#aaaaaa",
  "--color-surface-600": "#cccccc",
  "--color-surface-700": "#e5e5e5",
  "--color-surface-800": "#f5f5f5",
  "--color-surface-900": "#ffffff",
  "--color-surface-950": "#f0f4f8",
  "--color-border": "#e0e0e0",
  "--color-chat": "#ffffff",
  "--color-chat-header": "#f0f0f0",
  "--color-chat-assistant": "#ebebeb",
};

export function JsxPreview({
  code,
  previewPaletteId,
  previewMode = "dark",
}: {
  code: string;
  previewPaletteId?: string;
  previewMode?: "dark" | "light";
}) {
  if (!code) {
    return (
      <div className="flex items-center justify-center py-12 text-surface-500">
        <span>No code to preview</span>
      </div>
    );
  }

  const jsx = extractJSX(code);
  let previewStyle: React.CSSProperties | undefined;

  const palette = previewPaletteId ? getBuilderPalette(previewPaletteId) : undefined;
  const baseStyle = palette?.accentCssVars as React.CSSProperties | undefined;

  if (previewMode === "light") {
    previewStyle = { ...LIGHT_SURFACE_VARS, ...baseStyle } as React.CSSProperties;
  } else {
    previewStyle = baseStyle;
  }

  try {
    const rendered = renderJSXAdvanced(jsx);
    if (rendered === null) {
      const previewSnippet = jsx.length > 200 ? jsx.slice(0, 200) + "..." : jsx;
      return (
        <div className="border border-amber-500/20 rounded-lg p-4 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300">Preview couldn't render</p>
              <p className="text-xs text-amber-500/80 mt-1">
                The section uses patterns the simple preview can't handle. Check the Code tab or copy the code to use
                in your app.
              </p>
              <pre className="mt-2 p-2 bg-surface-900/50 rounded text-[11px] text-amber-500/60 max-w-full overflow-x-auto">
                {previewSnippet}
              </pre>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="section-preview-root bg-surface-950" style={previewStyle}>
        {rendered}
      </div>
    );
  } catch (e) {
    const errMsg = (e as Error)?.message || "Unknown error";
    const previewSnippet = jsx.length > 200 ? jsx.slice(0, 200) + "..." : jsx;
    return (
      <div className="border border-amber-500/20 rounded-lg p-4 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300">Preview error</p>
            <p className="text-xs text-amber-500/80 mt-1">{errMsg}</p>
            <pre className="mt-2 p-2 bg-surface-900/50 rounded text-[11px] text-amber-500/60 max-w-full overflow-x-auto">
              {previewSnippet}
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
