import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Product: [
    { href: "/docs/getting-started", label: "Getting Started" },
    { href: "/components", label: "Components" },
    { href: "/docs/theming", label: "Theming" },
    { href: "/docs/cli", label: "CLI" },
    { href: "/docs/api-reference", label: "API Reference" },
  ],
  Frameworks: [
    { href: "/docs/getting-started?framework=react", label: "React" },
    { href: "/docs/getting-started?framework=nextjs", label: "Next.js" },
    { href: "/docs/getting-started?framework=vue", label: "Vue" },
    { href: "/docs/getting-started?framework=angular", label: "Angular" },
    { href: "/docs/getting-started?framework=svelte", label: "Svelte" },
    { href: "/docs/getting-started?framework=solid", label: "SolidJS" },
    { href: "/docs/getting-started?framework=react-native", label: "React Native" },
  ],
  Resources: [
    { href: "/docs/guides", label: "Guides" },
    { href: "/docs/accessibility", label: "Accessibility" },
    { href: "/docs/api-reference", label: "API Reference" },
    { href: "/docs/migration", label: "Migration" },
    { href: "https://github.com", label: "GitHub" },
  ],
  Company: [
    { href: "/", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "https://twitter.com", label: "Twitter" },
    { href: "https://discord.gg", label: "Discord" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-surface-800 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-surface-500 hover:text-surface-300 transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-surface-500 hover:text-surface-300 transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-white.png" alt="AwesomeUI" width={140} height={21} className="h-6 w-auto logo-dark" />
            <Image src="/logo.png" alt="AwesomeUI" width={140} height={21} className="h-6 w-auto logo-light" />
          </div>
          <p className="text-xs text-surface-600">
            &copy; {new Date().getFullYear()} AwesomeUI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
