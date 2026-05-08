import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DocsPage() {
  return (
    <div>
      <h1>AwesomeUI Documentation</h1>
      <p>
        Welcome to the AwesomeUI documentation. Here you&apos;ll find everything you need
        to build beautiful, cross-platform applications with a single design system.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8 not-prose">
        {[
          { title: "Getting Started", desc: "Install AwesomeUI in your project and start building.", href: "/docs/getting-started" },
          { title: "Components", desc: "Explore all available components and their APIs.", href: "/docs/components" },
          { title: "Theming", desc: "Customize the look and feel of your application.", href: "/docs/theming" },
          { title: "CLI Reference", desc: "Learn how to use the AwesomeUI CLI.", href: "/docs/cli" },
          { title: "API Reference", desc: "Complete API documentation for all packages.", href: "/docs/api-reference" },
          { title: "Guides", desc: "Migration, performance, accessibility guides.", href: "/docs/guides" },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="glass rounded-xl p-5 border border-surface-800/50 card-gradient-hover group"
          >
            <h3 className="text-base font-semibold text-surface-100 mb-1.5 group-hover:text-awesome-300 transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-surface-400">{card.desc}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-awesome-400 opacity-0 group-hover:opacity-100 transition-opacity">
              View docs <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
