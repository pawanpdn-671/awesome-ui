"use client";

import { useState, createElement, ReactNode, Fragment } from "react";
import { Sparkles, Wand2, Code2, Eye, Loader2, Copy, Check, AlertCircle, FileCode, Package, RefreshCw, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/code-block";
import { previewComponents } from "@/components/section-preview";
import { useTexts } from "@/components/text-provider";
import { builderPalettes, defaultPaletteId, getBuilderPalette } from "@/lib/builder-palettes";

type Mode = "generate" | "improve";

interface Result {
  code: string;
  title: string;
  description: string;
  componentsUsed: string[];
}

const NATIVE_HTML_TAGS = ['section', 'div', 'header', 'nav', 'main', 'footer', 'article', 'aside',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'ul', 'ol', 'li', 'a',
  'img', 'input', 'br', 'hr', 'strong', 'b', 'em', 'i'];

function isNativeTag(name: string): boolean {
  return NATIVE_HTML_TAGS.includes(name.toLowerCase());
}

function extractJSX(code: string): string {
  const returnMatch = code.match(/return\s*\(/);
  if (!returnMatch) return code;

  const start = returnMatch.index! + returnMatch[0].length;
  let depth = 1;
  let i = start;
  while (i < code.length && depth > 0) {
    if (code[i] === '(') depth++;
    if (code[i] === ')') depth--;
    if (code[i] === '{') {
      let braceDepth = 1;
      i++;
      while (i < code.length && braceDepth > 0) {
        if (code[i] === '{') braceDepth++;
        if (code[i] === '}') braceDepth--;
        i++;
      }
      continue;
    }
    i++;
  }

  const inner = code.slice(start, i - 1).trim();
  const semicolon = inner.lastIndexOf(';');
  return semicolon > 0 ? inner.slice(0, semicolon).trim() : inner;
}

function parseAttrs(tagStr: string): Record<string, any> {
  const props: Record<string, any> = {};
  const attrRe = /(\w+)=["]([^"]*)["]/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(tagStr)) !== null) {
    if (m[1] && m[1] !== 'key') props[m[1]] = m[2];
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
      if (nextChar === '>' || nextChar === ' ' || nextChar === '\n' || nextChar === '/') {
        openCount++;
        const gtIdx = content.indexOf('>', i);
        if (gtIdx === -1) return -1;
        if (content[gtIdx - 1] === '/') openCount--;
        i = gtIdx + 1;
        continue;
      }
    }
    if (content[i] === '{') {
      let braceDepth = 1; i++;
      while (i < content.length && braceDepth > 0) {
        if (content[i] === '{') braceDepth++;
        if (content[i] === '}') braceDepth--;
        i++;
      }
      continue;
    }
    i++;
  }
  return -1;
}

function parseTagName(tagStr: string): string {
  return (tagStr.split(/\s+/)[0] || '').replace(/\/$/, '');
}

function isSelfClosing(tagStr: string, tagName: string): boolean {
  return tagStr.endsWith('/') || /^(input|img|br|hr)$/.test(tagName);
}

function parseJsxExpression(content: string): ReactNode[] {
  const result: ReactNode[] = [];
  let i = 0;
  
  while (i < content.length) {
    if (content[i] === '<') {
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
  
  if (!trimmed.startsWith('<') || trimmed.startsWith('</')) {
    return null;
  }
  
  const tagEnd = trimmed.indexOf('>');
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
  const closeTag = `</${tagName}>`;
  
  const key = props.key || undefined;
  delete props.key;
  
  let node: ReactNode = null;
  const Comp = previewComponents[tagName];
  
  if (Comp) {
    node = createElement(Comp, { ...props, key }, ...children);
  } else if (isNativeTag(tagName)) {
    node = createElement(tagName as any, { ...props, key }, ...children);
  } else if (children.length > 0) {
    node = createElement('div', { className: props.className, key }, ...children);
  } else {
    node = null;
  }
  
  const totalLength = offset + tagEnd + 1 + closeIdx + closeTag.length;
  return { node, length: totalLength };
}

function parseChildrenAdvanced(content: string): ReactNode[] {
  if (!content) return [];
  
  const children: ReactNode[] = [];
  let i = 0;
  let textBuf = '';
  
  while (i < content.length) {
    if (content[i] === '{') {
      let braceDepth = 1;
      let exprStart = i + 1;
      i++;
      
      while (i < content.length && braceDepth > 0) {
        if (content[i] === '{') braceDepth++;
        if (content[i] === '}') braceDepth--;
        i++;
      }
      
      const expr = content.slice(exprStart, i - 1).trim();
      
      if (expr.startsWith('<') || expr.includes('.map(') || expr.includes('=>')) {
        const exprChildren = parseJsxExpression(expr);
        if (exprChildren.length > 0) {
          const trimmedText = textBuf.replace(/[\n\t]/g, ' ').trim();
          if (trimmedText) children.push(trimmedText);
          textBuf = '';
          
          if (exprChildren.length === 1) {
            children.push(exprChildren[0]);
          } else {
            children.push(createElement(Fragment, { key: `expr-${exprStart}` }, ...exprChildren));
          }
        }
      }
      continue;
    }
    
    if (content[i] === '<') {
      if (content[i + 1] === '/') {
        const trimmedText = textBuf.replace(/[\n\t]/g, ' ').trim();
        if (trimmedText) children.push(trimmedText);
        break;
      }
      
      const trimmedText = textBuf.replace(/[\n\t]/g, ' ').trim();
      if (trimmedText) children.push(trimmedText);
      textBuf = '';
      
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
  
  const trimmedText = textBuf.replace(/[\n\t]/g, ' ').trim();
  if (trimmedText) children.push(trimmedText);
  
  return children;
}

function renderJSXAdvanced(jsx: string): ReactNode {
  const element = parseSingleElement(jsx);
  return element?.node ?? null;
}

function JsxPreview({ code, previewPaletteId }: { code: string; previewPaletteId?: string }) {
  if (!code) {
    return (
      <div className="flex items-center justify-center py-12 text-surface-500">
        <span>No code to preview</span>
      </div>
    );
  }

   const jsx = extractJSX(code);
   let previewStyle: React.CSSProperties | undefined;
   
   if (previewPaletteId) {
     const palette = getBuilderPalette(previewPaletteId);
     if (palette) {
       previewStyle = palette.accentCssVars as React.CSSProperties;
     }
   }

  try {
    const rendered = renderJSXAdvanced(jsx);
    if (rendered === null) {
      return (
        <div className="border border-amber-500/20 rounded-lg p-4 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300">Preview couldn't render</p>
              <p className="text-xs text-amber-500/80 mt-1">
                The section uses patterns the simple preview can't handle. Copy the code and use it in your app.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="section-preview-root" style={previewStyle}>
        {rendered}
      </div>
    );
  } catch (e) {
    return (
      <div className="border border-amber-500/20 rounded-lg p-4 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300">Preview error</p>
            <p className="text-xs text-amber-500/80 mt-1">
              {(e as Error)?.message || 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export function SectionBuilder() {
	const { sectionBuilderUI: t, suggestionPrompts } = useTexts();
  const [mode, setMode] = useState<Mode>("generate");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
   const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
   const [previewPalette, setPreviewPalette] = useState<string>(defaultPaletteId);

   const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch("/api/section-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", prompt: prompt.trim(), palette: defaultPaletteId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

       setResult({
         code: data.code || "",
         title: data.title || "Generated Section",
         description: data.description || "",
         componentsUsed: Array.isArray(data.componentsUsed) ? data.componentsUsed : [],
       });
       setPreviewPalette(defaultPaletteId);
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!prompt.trim() || !result || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/section-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "improve", prompt: prompt.trim(), existingCode: result.code, palette: defaultPaletteId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

       setResult({
         code: data.code || result.code,
         title: data.title || result.title,
         description: data.description || result.description,
         componentsUsed: Array.isArray(data.componentsUsed) ? data.componentsUsed : result.componentsUsed,
       });
       setPreviewPalette(defaultPaletteId);
       setPrompt("");
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecolor = async (paletteId: string) => {
    setPreviewPalette(paletteId);
    
    if (!result) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/section-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recolor", palette: paletteId, existingCode: result.code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

       setResult({
         ...result,
         code: data.code || result.code,
       });
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

   return (
     <div className="max-w-4xl mx-auto space-y-8">
       {!result && (
         <div className="space-y-8">
           <div className="text-center space-y-4">
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-awesome-500/10 text-awesome-400 text-xs font-medium border border-awesome-500/20">
               <Sparkles className="w-3 h-3" />
               {t.badge}
             </span>
             <div className="space-y-2">
               <h1 className="text-3xl md:text-4xl font-bold text-surface-100">
                 {t.heading.line1} <span className="text-awesome-400">{t.heading.line2}</span>
               </h1>
               <p className="text-surface-400 max-w-2xl mx-auto">
                 {t.description}
               </p>
             </div>
           </div>

           <div className="space-y-6">
             <div className="flex items-center gap-4">
               <button
                 onClick={() => setMode("generate")}
                 className={cn(
                   "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                   mode === "generate"
                     ? "border-awesome-500/40 bg-awesome-500/10 text-awesome-400"
                     : "border-surface-700 text-surface-400 hover:border-surface-600 hover:text-surface-200"
                 )}
               >
                 <Sparkles className="w-4 h-4" />
                 {t.modes.generate.label}
               </button>
             </div>

             <div className="relative">
               <textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder={mode === "generate" ? t.modes.generate.textareaPlaceholder : t.modes.improve.textareaPlaceholder}
                 className="w-full h-32 px-4 py-3 bg-surface-900 border border-surface-800 rounded-xl text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-awesome-500/50 focus:ring-1 focus:ring-awesome-500/20 resize-none transition-all"
                 disabled={loading}
                 onKeyDown={(e) => {
                   if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                     mode === "generate" ? handleGenerate() : handleImprove();
                   }
                 }}
               />
               <div className="absolute bottom-3 right-3">
                 <button
                   onClick={mode === "generate" ? handleGenerate : handleImprove}
                   disabled={loading || !prompt.trim()}
                   className={cn(
                     "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all",
                     loading || !prompt.trim()
                       ? "bg-surface-800 text-surface-500 cursor-not-allowed"
                       : "bg-awesome-500 text-white hover:bg-awesome-600 shadow-lg shadow-awesome-500/20 active:scale-95"
                   )}
                 >
                   {loading ? (
                     <><Loader2 className="w-4 h-4 animate-spin" /> {t.generateButton.loading}</>
                   ) : (
                     <><Sparkles className="w-4 h-4" /> {mode === "generate" ? t.generateButton.idle : t.generateButton.improve}</>
                   )}
                 </button>
               </div>
             </div>

             {error && (
               <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                 <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-sm font-medium text-rose-300">{t.errorFallback}</p>
                   <p className="text-xs text-rose-500/80 mt-1">{error}</p>
                 </div>
               </div>
             )}

             <div className="space-y-3">
               <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">{t.modes.generate.suggestionsTitle}</p>
               <div className="grid gap-2">
                 {suggestionPrompts.map((s: any) => (
                   <button
                     key={s.label}
                     onClick={() => setPrompt(s.prompt)}
                     disabled={loading}
                     className={cn(
                       "flex items-center justify-between p-3 text-left rounded-xl border transition-all group",
                       loading
                         ? "border-surface-800/50 opacity-50 cursor-not-allowed"
                         : "border-surface-800 hover:border-surface-700 bg-surface-900/50 hover:bg-surface-800/30"
                     )}
                   >
                     <div className="flex items-center gap-3">
                       <span className="text-lg">{s.icon}</span>
                       <div>
                         <p className="text-sm font-medium text-surface-200">{s.label}</p>
                         <p className="text-xs text-surface-500">{s.description}</p>
                       </div>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
           </div>
         </div>
       )}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-awesome-500 to-awesome-600 flex items-center justify-center shadow-lg shadow-awesome-500/20">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-100">{result.title}</h2>
                {result.description && <p className="text-sm text-surface-500 mt-1">{result.description}</p>}
              </div>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                copied
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                  : "border-surface-700 text-surface-300 hover:border-surface-600 hover:text-surface-100"
              )}
            >
              {copied ? <><Check className="w-4 h-4" /> {t.results.copied}</> : <><Copy className="w-4 h-4" /> {t.results.copyCode}</>}
            </button>
          </div>

           <div className="flex items-center gap-2 flex-wrap">
             <div className="flex items-center gap-1.5 flex-wrap">
               <Palette className="w-3.5 h-3.5 text-surface-500 shrink-0" />
               <span className="text-xs text-surface-500">{t.results.recolorLabel}</span>
               {builderPalettes.map((p) => (
                 <button
                   key={p.id}
                   onClick={() => handleRecolor(p.id)}
                   disabled={loading}
                   className={cn(
                     "flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded-md border transition-all",
                     (previewPalette ?? defaultPaletteId) === p.id
                       ? "border-awesome-500/40 bg-awesome-500/10 text-awesome-400"
                       : "border-surface-700 text-surface-500 hover:border-surface-500 hover:text-surface-200",
                     loading && "opacity-50 cursor-not-allowed"
                   )}
                   title={p.description}
                 >
                   <span
                     className="w-2.5 h-2.5 rounded-full"
                     style={{ backgroundColor: p.previewColor }}
                   />
                   {p.label}
                 </button>
               ))}
             </div>
               <div className="ml-auto flex items-center gap-2 flex-wrap">
                 {loading ? (
                   <div className="flex items-center gap-1.5 text-xs text-surface-500">
                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
                     {t.generateButton.loading}
                   </div>
                 ) : result?.componentsUsed?.length > 0 ? (
                   <>
                     <Package className="w-3.5 h-3.5 text-surface-500" />
                     <span className="text-xs text-surface-500">{t.results.componentsLabel}</span>
                     {result.componentsUsed.map((c) => (
                       <span
                         key={c}
                         className="px-2 py-0.5 text-xs font-mono bg-awesome-500/10 text-awesome-400 rounded-md border border-awesome-500/20"
                       >
                         {c}
                       </span>
                     ))}
                   </>
                 ) : null}
               </div>
             </div>

           {error && (
             <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
               <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
               <div>
                 <p className="text-sm font-medium text-rose-300">{t.errorFallback}</p>
                 <p className="text-xs text-rose-500/80 mt-1">{error}</p>
               </div>
             </div>
           )}

          <div className="bg-surface-900 rounded-2xl border border-surface-800 overflow-hidden">
            <div className="flex items-center border-b border-surface-800">
              <button
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2",
                  activeTab === "preview"
                    ? "border-awesome-500 text-surface-100"
                    : "border-transparent text-surface-400 hover:text-surface-200"
                )}
              >
                <Eye className="w-4 h-4" />
                {t.results.previewTab}
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2",
                  activeTab === "code"
                    ? "border-awesome-500 text-surface-100"
                    : "border-transparent text-surface-400 hover:text-surface-200"
                )}
              >
                <Code2 className="w-4 h-4" />
                {t.results.codeTab}
              </button>
              <div className="flex-1" />
              {activeTab === "code" && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-3 text-xs text-surface-400 hover:text-surface-200 transition-all"
                >
                  {copied ? <><Check className="w-3 h-3" /> {t.results.copied}</> : <><Copy className="w-3 h-3" /> {t.results.copyCode}</>}
                </button>
              )}
            </div>

            {activeTab === "preview" ? (
              <div className="p-6 max-h-[600px] overflow-y-auto bg-surface-900">
                <JsxPreview code={result.code} previewPaletteId={previewPalette} />
              </div>
            ) : (
              <div className="max-h-[600px] overflow-y-auto">
                <CodeBlock code={result.code} language="tsx" showLineNumbers />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-surface-500" />
              <p className="text-sm font-medium text-surface-300">{t.results.improve.title}</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.results.improve.placeholder}
                className="flex-1 px-4 py-2.5 bg-surface-900 border border-surface-800 rounded-xl text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-awesome-500/50 focus:ring-1 focus:ring-awesome-500/20 transition-all"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleImprove();
                  }
                }}
              />
              <button
                onClick={handleImprove}
                disabled={loading || !prompt.trim()}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  loading || !prompt.trim()
                    ? "bg-surface-800 text-surface-500 cursor-not-allowed"
                    : "bg-awesome-500 text-white hover:bg-awesome-600 shadow-lg shadow-awesome-500/20 active:scale-95"
                )}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {t.results.improve.btn}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-awesome-500/5 border border-awesome-500/10">
            <div className="flex items-start gap-3">
              <FileCode className="w-5 h-5 text-awesome-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-surface-200 mb-1">{t.results.howToUse.title}</h3>
                <p className="text-xs text-surface-400 leading-relaxed">{t.results.howToUse.body}</p>
                <p className="text-xs text-surface-500 mt-1">
                  Tip: The code uses themeable tokens like <code className="bg-surface-800 px-1 rounded">bg-awesome-500</code> - these will automatically use your app's configured accent colors.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => {
                setMode("generate");
                setPrompt("");
                setResult(null);
                setError("");
                setCopied(false);
                setActiveTab("preview");
                setPreviewPalette(defaultPaletteId);
              }}
              disabled={loading}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl border transition-all mx-auto",
                loading
                  ? "border-surface-800/50 text-surface-500 cursor-not-allowed"
                  : "border-surface-700 text-surface-300 hover:border-surface-600 hover:bg-surface-800/30 hover:text-surface-100"
              )}
            >
              <Sparkles className="w-4 h-4" />
              {t.results.newSection}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
