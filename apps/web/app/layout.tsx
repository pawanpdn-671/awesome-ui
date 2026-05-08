import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AwesomeUI — Universal UI for Every Framework",
    template: "%s — AwesomeUI",
  },
  description:
    "Build once. Ship everywhere. One design system for React, Next.js, Vue, Angular, Svelte, SolidJS, and React Native.",
  keywords: [
    "UI library", "component library", "React", "Vue", "Angular",
    "Svelte", "SolidJS", "React Native", "Next.js", "design system",
    "cross-framework",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AwesomeUI",
    title: "AwesomeUI — Universal UI for Every Framework",
    description: "Build once. Ship everywhere. One design system for every framework.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AwesomeUI — Universal UI for Every Framework",
    description: "Build once. Ship everywhere. One design system for every framework.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://awesomeui.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("theme");
                  if (!theme || theme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.add("light");
                  }
                } catch(e) {
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-950 text-surface-100 antialiased">
        {children}
      </body>
    </html>
  );
}
