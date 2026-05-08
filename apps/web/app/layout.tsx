import type { Metadata } from "next";
import "./globals.css";
import { layout as t } from "@/texts";

export const metadata: Metadata = {
  title: {
    default: t.title.default,
    template: t.title.template,
  },
  description: t.description,
  keywords: [...t.keywords],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: t.openGraph.siteName,
    title: t.openGraph.title,
    description: t.openGraph.description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: t.twitter.title,
    description: t.twitter.description,
    images: ["/og.png"],
  },
  icons: [
    { rel: "icon", url: "/logo-main.png" },
    { rel: "apple-touch-icon", url: "/logo-main.png" },
  ],
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
