import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Portfolio OS`,
    template: `%s · ${SITE.name} Portfolio OS`,
  },
  description: SITE.description,
  keywords: ["portfolio", "AI engineer", "Next.js", "React", "TypeScript", "NestJS", SITE.name],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — Portfolio OS`,
    description: "A desktop you can click: projects, writing, stack, résumé.",
    url: "/",
    siteName: `${SITE.name} — Portfolio OS`,
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE.name} — Portfolio OS` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Portfolio OS`,
    description: "A desktop you can click: projects, writing, stack, résumé.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: SITE.name,
      jobTitle: SITE.role,
      url: SITE.url,
      sameAs: [SITE.github, SITE.linkedin, SITE.x],
      knowsAbout: ["Next.js", "React", "TypeScript", "NestJS", "PostgreSQL"],
    },
    { "@type": "WebSite", name: `${SITE.name} — Portfolio OS`, url: SITE.url },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
