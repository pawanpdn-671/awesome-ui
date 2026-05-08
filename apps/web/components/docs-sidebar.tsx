"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarSection {
  title: string;
  links: { href: string; label: string }[];
}

const sections: SidebarSection[] = [
  {
    title: "Getting Started",
    links: [
      { href: "/docs/getting-started", label: "Installation" },
      { href: "/docs/getting-started#quick-start", label: "Quick Start" },
      { href: "/docs/getting-started#frameworks", label: "Framework Setup" },
    ],
  },
  {
    title: "Components",
    links: [
      { href: "/docs/components", label: "Overview" },
      { href: "/docs/components/button", label: "Button" },
      { href: "/docs/components/dialog", label: "Dialog" },
      { href: "/docs/components/card", label: "Card" },
      { href: "/docs/components/form", label: "Form" },
      { href: "/docs/components/table", label: "Table" },
    ],
  },
  {
    title: "Theming",
    links: [
      { href: "/docs/theming", label: "Overview" },
      { href: "/docs/theming#tokens", label: "Design Tokens" },
      { href: "/docs/theming#dark-mode", label: "Dark Mode" },
      { href: "/docs/theming#customization", label: "Customization" },
    ],
  },
  {
    title: "CLI",
    links: [
      { href: "/docs/cli", label: "Overview" },
      { href: "/docs/cli#init", label: "Init" },
      { href: "/docs/cli#add", label: "Add" },
      { href: "/docs/cli#list", label: "List" },
    ],
  },
  {
    title: "API Reference",
    links: [
      { href: "/docs/api-reference", label: "Overview" },
      { href: "/docs/api-reference#props", label: "Common Props" },
      { href: "/docs/api-reference#types", label: "TypeScript Types" },
      { href: "/docs/api-reference#events", label: "Events" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/docs/guides", label: "Overview" },
      { href: "/docs/guides#migration", label: "Migration Guide" },
      { href: "/docs/guides#performance", label: "Performance" },
      { href: "/docs/guides#accessibility", label: "Accessibility" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <nav className="sticky top-20 space-y-1">
        {sections.map((section) => {
          const isCollapsed = collapsed[section.title];

          return (
            <div key={section.title}>
              <button
                onClick={() => toggle(section.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider hover:text-surface-200 transition-colors"
              >
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
                          : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/30"
                      )}
                    >
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
