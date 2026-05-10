"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { sidebar as t } from "@/texts";

export function DocsSidebar() {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

	const toggle = (title: string) => {
		setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
	};

	return (
		<aside className="w-64 shrink-0 hidden lg:block border-r border-border/50">
			<nav className="sticky top-20 space-y-1 pl-2 pr-4 py-5">
				{t.sections.map((section) => {
					const isCollapsed = collapsed[section.title];

					return (
						<div key={section.title}>
							<button
								onClick={() => toggle(section.title)}
								className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider hover:text-surface-200 transition-colors">
								{section.title}
								<ChevronRight className={cn("w-3 h-3 transition-transform", isCollapsed ? "" : "rotate-90")} />
							</button>
							{!isCollapsed && (
								<div className="ml-1 space-y-0.5">
									{section.links.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className={cn(
												"block px-3 py-1.5 text-sm rounded-lg transition-all duration-200",
												pathname === link.href
													? "bg-awesome-500/10 text-awesome-300 font-medium"
													: "text-surface-400 hover:text-surface-200 hover:bg-surface-800/30",
											)}>
											{link.label}
										</Link>
									))}
								</div>
							)}
						</div>
					);
				})}
			</nav>
		</aside>
	);
}
