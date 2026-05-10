"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export function Chatbot() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [maximized, setMaximized] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setMessages([
			{
				role: "assistant",
				content: "Hey! I'm Pawan from AwesomeUI. Ask me anything.",
				timestamp: new Date(),
			},
		]);
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage: Message = { role: "user", content: input, timestamp: new Date() };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: input,
					conversationHistory: messages.slice(-5).map((m) => ({
						role: m.role,
						content: m.content,
					})),
				}),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error);

			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: data.reply,
					timestamp: new Date(),
				},
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Sorry, I hit an error. Please try again.",
					timestamp: new Date(),
				},
			]);
		} finally {
			setIsLoading(false);
			inputRef.current?.focus();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full overflow-hidden transition-all duration-300",
					"bg-white hover:bg-surface-100",
					"shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]",
					"ring-1 ring-black/5",
					isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
				)}
				aria-label="Open chat">
				<div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-black/5">
					<Image src="/logo-main.png" alt="" fill className="object-cover" priority />
				</div>
			</button>

			{isOpen && (
				<div
					className={cn(
						"fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl bg-chat border border-border shadow-2xl overflow-hidden transition-all duration-300 ease-out",
						maximized ? "w-130 h-180" : "w-95 h-145",
					)}>
					<div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-chat-header shrink-0">
						<div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-awesome-500/30 shrink-0">
							<Image src="/about/pawanpdn.jpeg" alt="Pawan" fill className="object-cover" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-surface-100">AwesomeUI</p>
							<p className="text-[11px] text-surface-400 leading-none mt-0.5">Online</p>
						</div>
						<button
							onClick={() => setMaximized(!maximized)}
							className="p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700 transition-colors"
							aria-label={maximized ? "Minimize" : "Maximize"}>
							{maximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
						</button>
						<button
							onClick={() => setIsOpen(false)}
							className="p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700 transition-colors"
							aria-label="Close chat">
							<X className="w-3.5 h-3.5" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
						{messages.map((msg, idx) => (
							<div
								key={idx}
								className={cn(
									"flex items-start",
									msg.role === "user" ? "justify-end gap-2" : "justify-start gap-0",
								)}>
								{msg.role === "assistant" && (
									<>
										<div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-awesome-500/30 shrink-0 self-start z-10">
											<Image src="/about/pawanpdn.jpeg" alt="Pawan" fill className="object-cover" />
										</div>
										<div
											className="w-[6px] h-2 shrink-0 self-start bg-chat-assistant z-10 ml-0.5 mt-2"
											style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
										/>
									</>
								)}
								<div className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
									<div
										className={cn(
											"rounded-[18px] px-4 py-2.5 shadow-sm",
											msg.role === "user"
												? "bg-awesome-600 text-white rounded-br-[5px]"
												: "bg-chat-assistant text-surface-200 rounded-tl-none",
										)}>
										<p className="text-[13px] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
									</div>
									<p className="text-[10px] mt-1 px-1 leading-none text-surface-500">
										{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
									</p>
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex items-start justify-start gap-0">
								<div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-awesome-500/30 shrink-0 self-start z-10">
									<Image src="/about/pawanpdn.jpeg" alt="Pawan" fill className="object-cover" />
								</div>
								<div
									className="w-[6px] h-2 shrink-0 self-start bg-chat-assistant z-10 ml-0.5 mt-2"
									style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
								/>
								<div className="bg-chat-assistant rounded-[18px] rounded-tl-none px-4 py-2.5 shadow-sm">
									<div className="flex items-center gap-1">
										<span
											className="w-[5px] h-[5px] rounded-full bg-surface-400 animate-typing"
											style={{ animationDelay: "0ms" }}
										/>
										<span
											className="w-[5px] h-[5px] rounded-full bg-surface-400 animate-typing"
											style={{ animationDelay: "200ms" }}
										/>
										<span
											className="w-[5px] h-[5px] rounded-full bg-surface-400 animate-typing"
											style={{ animationDelay: "400ms" }}
										/>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					<div className="border-t border-border px-3 py-3 shrink-0">
						<div className="relative flex items-center">
							<input
								ref={inputRef}
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Ask about AwesomeUI..."
								className="w-full px-4 py-2.5 pr-11 text-[13px] bg-transparent border border-border rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-awesome-500/30 focus:border-awesome-500/40 transition-all"
								disabled={isLoading}
							/>
							<button
								onClick={sendMessage}
								disabled={isLoading || !input.trim()}
								className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-awesome-600 text-white hover:bg-awesome-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
								aria-label="Send message">
								<Send className="w-3.5 h-3.5" />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
