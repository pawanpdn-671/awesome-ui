"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TerminalWindow } from "@/components/terminal-window";
import { Smartphone, Monitor, Check } from "lucide-react";
import { crossPlatform as t } from "@/texts";

const platforms = t.platforms.map((p) => {
	const icons: Record<string, React.ComponentType<{ className?: string }>> = {
		Web: Monitor,
		Mobile: Smartphone,
		Desktop: Monitor,
	};
	return { ...p, icon: icons[p.name] || Monitor };
});

export function CrossPlatform() {
	return (
		<section className="relative py-24 overflow-hidden">
			<div className="absolute inset-0 bg-surface-950" />
			<div className="absolute inset-0 grid-bg" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16 space-y-4">
					<Badge variant="primary" className="text-sm px-4 py-1.5">
						{t.badge}
					</Badge>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100">
						{t.heading.part1} <span className="text-gradient">{t.heading.part2}</span>
					</h2>
					<p className="text-lg text-surface-400 max-w-2xl mx-auto">{t.subheading}</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{platforms.map((p) => (
						<div key={p.name} className="glass rounded-2xl p-8 border border-surface-700/50 card-gradient-hover">
							<div className="w-12 h-12 rounded-xl bg-awesome-500/20 flex items-center justify-center mb-5">
								<p.icon className="w-6 h-6 text-awesome-400" />
							</div>
							<h3 className="text-xl font-semibold text-surface-100 mb-2">{p.name}</h3>
							<p className="text-sm text-surface-400 mb-6">{p.desc}</p>
							<ul className="space-y-3">
								{p.features.map((f) => (
									<li key={f} className="flex items-center gap-3 text-sm text-surface-300">
										<Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
										{f}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-16 glass rounded-2xl p-8 lg:p-12 border border-surface-700/50 overflow-hidden">
					<div className="grid lg:grid-cols-2 gap-8 items-center">
						<div>
							<h3 className="text-2xl font-bold text-surface-100 mb-4">{t.bottom.heading}</h3>
							<p className="text-surface-400 mb-6">{t.bottom.description}</p>
							<div className="flex flex-wrap gap-2">
								{t.bottom.tags.map((fw) => (
									<span
										key={fw}
										className="px-3 py-1 rounded-full bg-surface-800 text-surface-400 text-xs font-medium">
										{fw}
									</span>
								))}
							</div>
						</div>
						<div className="relative">
							<TerminalWindow label={t.bottom.preview.label} className="max-w-sm mx-auto">
								<div className="flex items-center justify-center p-4">
									<div className="text-center">
										<div className="mx-auto mb-3">
											<Image
												src="/logo-white.png"
												alt="AwesomeUI"
												width={120}
												height={18}
												className="h-6 w-auto logo-dark"
											/>
											<Image
												src="/logo-black.png"
												alt="AwesomeUI"
												width={120}
												height={18}
												className="h-6 w-auto logo-light"
											/>
										</div>
										<div className="text-xs text-surface-500 mb-4">{t.bottom.preview.subtitle}</div>
										<div className="flex gap-2 justify-center">
											<span className="px-2 py-1 rounded bg-awesome-500/20 text-awesome-300 text-xs">
												{t.bottom.preview.web}
											</span>
											<span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs">
												{t.bottom.preview.mobile}
											</span>
											<span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-xs">
												{t.bottom.preview.desktop}
											</span>
										</div>
									</div>
								</div>
							</TerminalWindow>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
