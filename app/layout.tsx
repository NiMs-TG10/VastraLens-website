import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SnowfallEffect from "@/components/SnowfallEffect";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VastraLens",
  description: "Your Style. Perfected by AI.",
  generator: "Nishant",
  // icons: {
  //   icon: "/favicon.ico",
  // },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add suppressHydrationWarning={true} to the html tag
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${syne.variable} ${inter.variable} font-sans antialiased`}>
        <SnowfallEffect />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
