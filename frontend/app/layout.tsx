import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIH 2026 | IET DDUGU",
  description:
    "Official Smart India Hackathon 2026 portal for Institute of Engineering & Technology, Deen Dayal Upadhyay Gorakhpur University.",
  keywords: [
    "SIH 2026",
    "Smart India Hackathon",
    "IET DDUGU",
    "Gorakhpur University",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "SIH 2026 | IET DDUGU",
    description: "Official SIH 2026 portal for IET DDUGU",
    type: "website",
  },
  other: {
    "theme-color": "#0f172a",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
