import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/chrome/Navbar";
import Footer from "@/components/chrome/Footer";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import BackToTop from "@/components/chrome/BackToTop";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL("https://cekael.vercel.app"),
  title: "Cekael HQ — Cedric Kilian · Software Engineer & 3D Web",
  description:
    "Markas digital Cedric Kilian (Cekael) — Software Engineer & mahasiswa Teknik Elektro UNY. Kode, sirkuit, dan visual 3D ketemu di sini.",
  keywords: [
    "Cedric Kilian",
    "Cekael",
    "portfolio 3D",
    "software engineer",
    "teknik elektro",
    "UNY",
    "Three.js",
    "React Three Fiber",
  ],
  authors: [{ name: "Cedric Kilian Lasmana" }],
  openGraph: {
    title: "Cekael HQ — Cedric Kilian",
    description: "Kode, sirkuit, dan visual 3D ketemu di satu markas digital.",
    type: "website",
    locale: "id_ID",
    url: "https://cekael.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cekael HQ — Cedric Kilian",
    description: "Kode, sirkuit, dan visual 3D ketemu di satu markas digital.",
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
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <Providers>
          <div className="grid-backdrop" aria-hidden="true" />
          <div className="ambient-glow" aria-hidden="true" />
          <ScrollProgress />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
