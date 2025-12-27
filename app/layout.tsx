import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import "./globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { Geist, Source_Sans_3 } from "next/font/google";
import { AppShell } from "../components/app-shell";
import { ViewTransitions } from "next-view-transitions";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  applicationName: siteConfig.name,
  authors: [{ name: "Paths Within" }],
  creator: "Paths Within",
  publisher: "Paths Within",
  category: "Self-knowledge",

  referrer: "origin-when-cross-origin",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
  icon: [
    { url: "/favicon.ico" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
},


  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: "/opengraph-image.png", 
        width: 1200,
        height: 630,
        alt: "Paths Within",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/twitter-image.png"], 
    creator: siteConfig.twitter.handle || undefined,
    site: siteConfig.twitter.site || undefined,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
    <html
      lang="en"
      className={`${geist.variable} ${sourceSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <ThemeProvider>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
    </ViewTransitions>
  );
}
