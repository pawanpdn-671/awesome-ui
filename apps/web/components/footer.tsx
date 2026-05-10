import Image from "next/image";
import Link from "next/link";
import { footer as t } from "@/texts";

export function Footer() {
	return (
		<footer className="relative border-t border-border bg-surface-950">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{Object.entries(t.columns).map(([category, links]) => (
						<div key={category}>
							<h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
								{category}
							</h3>
							<ul className="space-y-2.5">
								{links.map((link) => (
									<li key={link.label}>
										{link.href.startsWith("http") ? (
											<a
												href={link.href}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-surface-500 hover:text-surface-300 transition-colors">
												{link.label}
											</a>
										) : (
											<Link
												href={link.href}
												className="text-sm text-surface-500 hover:text-surface-300 transition-colors">
												{link.label}
											</Link>
										)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2.5">
						<Image
							src="/logo-white.png"
							alt={t.logoAlt}
							width={140}
							height={21}
							className="h-6 w-auto logo-dark"
						/>
						<Image
							src="/logo-black.png"
							alt={t.logoAlt}
							width={140}
							height={21}
							className="h-6 w-auto logo-light"
						/>
					</div>
					<p className="text-xs text-surface-600">
						&copy; {new Date().getFullYear()} {t.copyright}
					</p>
				</div>
			</div>
		</footer>
	);
}
