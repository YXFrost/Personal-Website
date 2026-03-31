// app/layout.js
// ─────────────────────────────────────────────────────────────────
// Root layout — wraps every page. Sets metadata + global styles.
// Improved with font optimization and better structure
// ─────────────────────────────────────────────────────────────────

import { DM_Sans, Space_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Font Optimization ─────────────────────────────────────────────
// Using next/font for automatic font optimization
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// ── Metadata ──────────────────────────────────────────────────────
export const metadata = {
  title: {
    default: "Your Name — Portfolio",
    template: "%s | Your Name",
  },
  description: "I build simulations, software, and interactive experiences.",
  keywords: ["portfolio", "developer", "software engineer", "web development"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    title: "Your Name — Portfolio",
    description: "I build simulations, software, and interactive experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name — Portfolio",
    description: "I build simulations, software, and interactive experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── Viewport Configuration ────────────────────────────────────────
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
};

// ── Root Layout Component ─────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${dmSans.variable} ${spaceMono.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-void text-text-primary antialiased">
        {/* Ambient glow effect at the top */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] z-50"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(245,166,35,0.5), transparent)",
            boxShadow: "0 0 80px 20px rgba(245,166,35,0.07)",
          }}
        />

        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}