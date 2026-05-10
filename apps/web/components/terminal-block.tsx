"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TerminalWindow } from "@/components/terminal-window";

interface TerminalBlockProps {
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

function TerminalBlockInner({ commands, className, autoPlay, restartDelay, onComplete, resetKey }: TerminalBlockProps) {
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
		const len = cmds.length;

		for (let li = 0; li < len; li++) {
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
		return () => {
			stoppedRef.current = true;
		};
	}, [autoPlay, start]);

	const typedLines = useMemo(() => (lineIndex > 0 ? commands.slice(0, lineIndex) : []), [commands, lineIndex]);

	const currentLine = commands[lineIndex];
	const charCount = charIndex;

	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = contentRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [lineIndex, charIndex, done]);

	const contentMinHeight = useMemo(() => {
		const lineH = 28;
		const pad = 32;
		return Math.min(Math.max(120, (commands.length + 1) * lineH + pad), 320);
	}, [commands.length]);

	return (
		<TerminalWindow className={cn("font-mono text-sm", className)}>
			<div ref={contentRef} className="p-4 space-y-1.5 overflow-y-auto" style={{ minHeight: contentMinHeight, maxHeight: 320 }}>
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
		</TerminalWindow>
	);
}

export const TerminalBlock = memo(TerminalBlockInner);
