"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

interface TerminalProps {
  commands: string[];
  className?: string;
  autoPlay?: boolean;
  restartDelay?: number;
  onComplete?: () => void;
  resetKey?: number;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function TerminalBlock({ commands, className, autoPlay, restartDelay, onComplete, resetKey }: TerminalProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);
  const playingRef = useRef(false);
  const stoppedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const commandsRef = useRef(commands);
  const restartDelayRef = useRef(restartDelay);
  const autoPlayRef = useRef(autoPlay);
  onCompleteRef.current = onComplete;
  commandsRef.current = commands;
  restartDelayRef.current = restartDelay;
  autoPlayRef.current = autoPlay;

  const resetHard = useCallback(() => {
    setLineIndex(0);
    setCharIndex(0);
    setDone(false);
    playingRef.current = false;
    stoppedRef.current = true;
  }, []);

  const start = useCallback(async () => {
    if (playingRef.current) return;
    playingRef.current = true;
    stoppedRef.current = false;
    const cmds = commandsRef.current;

    for (let li = 0; li < cmds.length; li++) {
      if (stoppedRef.current) break;
      setLineIndex(li);
      setCharIndex(0);
      const line = cmds[li]!;
      const isCommand = li === 0 || !line.startsWith("✔");
      const delay = isCommand ? 65 : 30;

      await sleep(isCommand ? 400 : 180);
      if (stoppedRef.current) break;

      for (let ci = 0; ci <= line.length; ci++) {
        if (stoppedRef.current) break;
        setCharIndex(ci + 1);
        await sleep(delay + (isCommand ? Math.random() * 50 : 0));
      }

      if (stoppedRef.current) break;
      setCharIndex(line.length);
    }

    if (!stoppedRef.current) {
      setDone(true);
      onCompleteRef.current?.();
      playingRef.current = false;
      const rd = restartDelayRef.current;
      if (rd && autoPlayRef.current) {
        await sleep(rd);
        if (!stoppedRef.current) {
          resetHard();
          setTimeout(start, 300);
        }
      }
    } else {
      playingRef.current = false;
    }
  }, [resetHard]);

  const prevResetKey = useRef(resetKey);
  useEffect(() => {
    if (resetKey !== undefined && prevResetKey.current !== resetKey) {
      prevResetKey.current = resetKey;
      resetHard();
    }
  }, [resetKey, resetHard]);

  useEffect(() => {
    if (autoPlay) {
      stoppedRef.current = false;
      const timer = setTimeout(start, 400);
      return () => {
        clearTimeout(timer);
        stoppedRef.current = true;
      };
    }
    return () => { stoppedRef.current = true; };
  }, [autoPlay, start]);

  const typedLines = lineIndex > 0 ? commands.slice(0, lineIndex) : [];
  const currentLine = commands[lineIndex];
  const charCount = charIndex;

  return (
    <div
      className={cn("rounded-xl border border-surface-800 bg-surface-950 overflow-hidden font-mono text-sm", className)}
      onMouseEnter={autoPlay ? undefined : start}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-800 bg-surface-900/50">
        <span className="w-3 h-3 rounded-full bg-red-500/50" />
        <span className="w-3 h-3 rounded-full bg-amber-500/50" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
        <span className="ml-2 text-xs text-surface-500">terminal</span>
      </div>
      <div className="p-4 space-y-1.5 min-h-[100px]">
        {typedLines.map((cmd, i) => (
          <div key={i} className="flex items-center gap-2 animate-fade-in">
            <span className="text-emerald-400 shrink-0">{i === 0 ? "$" : ""}</span>
            <span className="text-surface-200">{cmd}</span>
          </div>
        ))}
        {currentLine && !done && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-emerald-400 shrink-0">{lineIndex === 0 ? "$" : ""}</span>
            <span className="text-surface-200">
              {currentLine.slice(0, charCount)}
              <span className="inline-block w-2 h-4 bg-awesome-400 animate-blink ml-0.5 align-middle" />
            </span>
          </div>
        )}
        {done && (
          <div className="flex items-center gap-2 text-surface-500 animate-fade-in">
            <span className="text-emerald-400 shrink-0">✓</span>
            <span>Ready</span>
          </div>
        )}
      </div>
    </div>
  );
}
