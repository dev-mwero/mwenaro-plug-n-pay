import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mwenaro PlugPay | Developer-First M-Pesa Payments",
  description: "A seamless, developer-first SaaS platform for integrating Safaricom M-Pesa APIs (STK Push, B2C, C2B) with modern dashboards.",
  keywords: ["M-Pesa", "Payments", "Safaricom", "Daraja API", "PlugPay", "Kenya Fintech", "Next.js"],
  authors: [{ name: "Mwenaro" }],
  openGraph: {
    title: "Mwenaro PlugPay",
    description: "The modern developer platform for M-Pesa payments.",
    type: "website",
  }
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
