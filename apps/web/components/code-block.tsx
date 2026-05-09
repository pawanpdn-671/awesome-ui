"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({ code, language = "tsx", showLineNumbers, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className={cn("group relative rounded-xl border border-surface-800 bg-surface-950 overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface-800 bg-surface-900/50">
        <span className="text-xs text-surface-500 font-mono">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-300 transition-colors">
          {copied ? (
            <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
          ) : (
            <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-6">
          <code className="font-mono">
            {lines.map((line, i) => (
              <span key={i} className="block">
                {showLineNumbers && (
                  <span className="inline-block w-8 mr-4 text-right text-surface-600 select-none">{i + 1}</span>
                )}
                <Highlight code={line} />
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function Highlight({ code }: { code: string }) {
  const parts = code.split(
    /(\b(?:import|from|export|default|function|return|const|let|var|class|extends|interface|type|async|await|new|throw|if|else|for|while|template|script|setup|lang|Component|@Component|@awesomeui)\b|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\/\/.*)|(\{|\}|\(|\)|\<|\>|\/))/g
  );

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith("//")) return <span key={i} className="text-surface-600 italic">{part}</span>;
        if (/^(import|from|export|default|function|return|const|let|var|class|extends|interface|type|async|await|new|throw|if|else|for|while|template|script|setup|lang|Component|@Component)$/.test(part))
          return <span key={i} className="text-awesome-400">{part}</span>;
        if (part.startsWith('"') || part.startsWith("'") || part.startsWith("`"))
          return <span key={i} className="text-emerald-300">{part}</span>;
        if (/^@awesomeui/.test(part))
          return <span key={i} className="text-awesome-300">{part}</span>;
        if (/^[{}()<>/]$/.test(part))
          return <span key={i} className="text-surface-500">{part}</span>;
        return <span key={i} className="text-surface-200">{part}</span>;
      })}
    </>
  );
}


