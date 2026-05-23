"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Github } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTexts } from "@/components/text-provider";

export function Header() {
	const { header: t } = useTexts();
	const [open, setOpen] = useState(false);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-surface-950/80 backdrop-blur-xl">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<Link href="/" className="flex items-center gap-2.5 group">
						<Image
							src="/logo-white.png"
							alt="AwesomeUI"
							width={120}
							height={18}
							className="h-6 w-auto logo-dark"
							priority
						/>
						<Image
							src="/logo-black.png"
							alt="AwesomeUI"
							width={120}
							height={18}
							className="h-6 w-auto logo-light"
							priority
						/>
					</Link>

					<nav className="hidden md:flex items-center gap-1">
						{t.links.map((l: any) => (
							<Link
								key={l.href}
								href={l.href}
								className="px-3 py-2 text-sm text-surface-400 hover:text-surface-100 rounded-lg hover:bg-surface-800/50 transition-all">
								{l.label}
							</Link>
						))}
						<Link
							href="/docs/getting-started"
							className="ml-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-awesome-500 text-white hover:bg-awesome-600 transition-all shadow-lg shadow-awesome-500/20">
							{t.cta}
						</Link>
						<a
							href="https://github.com/pawanpdn-671/awesome-ui"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={t.ariaLabel.github}
							className="ml-2 p-2 text-surface-400 hover:text-surface-100 rounded-lg hover:bg-surface-800/50 transition-all">
							<Github className="w-5 h-5" />
						</a>
						<ThemeToggle />
					</nav>

					<button
						onClick={() => setOpen(!open)}
						aria-label={open ? t.ariaLabel.closeMenu : t.ariaLabel.openMenu}
						className="md:hidden p-2 text-surface-400 hover:text-surface-100">
						{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
					</button>
				</div>
			</div>

			{open && (
				<div className="md:hidden border-t border-border bg-surface-950">
					<div className="px-4 py-4 space-y-1">
						{t.links.map((l: any) => (
							<Link
								key={l.href}
								href={l.href}
								onClick={() => setOpen(false)}
								className="block px-3 py-2 text-sm text-surface-400 hover:text-surface-100 rounded-lg hover:bg-surface-800/50">
								{l.label}
							</Link>
						))}
						<Link
							href="/docs/getting-started"
							onClick={() => setOpen(false)}
							className="block px-3 py-2 text-sm font-medium text-center rounded-lg bg-awesome-500 text-white hover:bg-awesome-600 mt-2">
							{t.cta}
						</Link>
					</div>
				</div>
			)}
		</header>
	);
}
