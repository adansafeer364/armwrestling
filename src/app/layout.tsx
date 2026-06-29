import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { LanguageProvider } from "./i18n";
import WhatsAppButton from "../components/WhatsAppButton";
import AutoTranslate from "../components/AutoTranslate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "TITAN CLASH 2026 | Professional Armwrestling Championship",
  description: "Join the most intense armwrestling tournament. Big cash prizes, elite pullers, knockout brackets, and professional referees. Register to compete today!",
  keywords: ["armwrestling tournament", "titan clash 2026", "professional armwrestling", "weight class tournaments", "knockout tournament", "combat sports championship"],
  authors: [{ name: "Titan Sports Association" }],
  openGraph: {
    title: "TITAN CLASH 2026 | Professional Armwrestling Championship",
    description: "Witness the clash of titans. Professional armwrestling championship with live brackets, Rs 150k prize pool, and global competitors.",
    url: "https://titanclash2026.com",
    type: "website",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Titan Clash 2026 Tournament Cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TITAN CLASH 2026 | Professional Armwrestling Championship",
    description: "The ultimate test of upper body strength and technique. Over Rs 150,000 in cash prizes.",
    images: ["/images/hero-bg.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: 'dark' }}
    >
      <head>
        {/* Apply the saved theme before paint so there is no flash and no
            text/background mismatch. Dark is the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t!=='light';document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';var l=localStorage.getItem('lang');if(l==='ur'){document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ur');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-light-bg text-light-text-main dark:bg-dark-bg dark:text-dark-text-main transition-colors duration-300 overflow-x-hidden w-full">
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <WhatsAppButton />
            <AutoTranslate />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

