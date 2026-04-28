import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Gabarito, JetBrains_Mono } from "next/font/google";
import { SideNav } from "@/components/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "@/style/globals.css";
import { Providers } from "./providers";

const gabarito = Gabarito({ subsets: ["latin"], variable: "--font-gabarito" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans",
          gabarito.variable,
          jetbrains.variable,
        )}
      >
        <Providers>
          <div className="flex min-h-[100dvh]">
            <SideNav />
            <div className="flex-grow overflow-auto">{children}</div>
          </div>
        </Providers>
        {/* Vercel Analytics — privacy-friendly, zero-config traffic
            tracking. Surfaces visitors, page views, referrers, countries,
            devices, browsers, and OS in the Vercel dashboard's Analytics
            tab. Use it to monitor who's checking the site after demo. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
