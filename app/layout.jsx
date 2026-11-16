import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import Mascot2D from "@/components/Mascot2D";
import PortfolioArcade from "@/components/PortfolioArcade";
import { BackToTop, CursorGlow, Preloader, ScrollProgress, ThankYouToast } from "@/components/Chrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "Portofolio Software Engineer | Cedric Kilian",
  description:
    "Portofolio Cedric Kilian — Software Engineer & Web Developer, mahasiswa Teknik Elektro Universitas Negeri Yogyakarta.",
  keywords: ["Cedric Kilian", "portfolio", "software engineer", "teknik elektro", "web developer", "UNY"],
  openGraph: {
    title: "Cedric Kilian — Software Engineer",
    description: "Clean, fast, user-friendly web applications. Electrical Engineering × Web Development.",
    type: "website",
    locale: "id_ID",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon48.png",
  },
};

export const viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const fontVars = `${inter.variable} ${jetbrains.variable}`;
  return (
    <html lang="id" data-theme="dark" className={fontVars} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-200 antialiased">
        <Providers>
          <Starfield />
          <ScrollProgress />
          <CursorGlow />
          <Preloader />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <Mascot2D />
          <PortfolioArcade />
          <ThankYouToast />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
