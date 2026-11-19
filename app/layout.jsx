import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/chrome/Navbar";
import Footer from "@/components/chrome/Footer";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import BackToTop from "@/components/chrome/BackToTop";
import CommandPalette from "@/components/chrome/CommandPalette";
import UiSandbox from "@/components/chrome/UiSandbox";
import ScrollScene from "@/components/three/ScrollScene";

// Font di-host sendiri (variable, subset latin) supaya build tidak pernah
// gagal karena request ke fonts.googleapis.com, dan first paint lebih cepat.
const instrument = localFont({
  src: "./fonts/instrument-sans-latin.woff2",
  variable: "--font-instrument",
  display: "swap",
  weight: "400 700",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const plex400 = localFont({
  src: "./fonts/ibm-plex-mono-400-latin.woff2",
  variable: "--font-plex-400",
  display: "swap",
  weight: "400",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

const plex600 = localFont({
  src: "./fonts/ibm-plex-mono-600-latin.woff2",
  variable: "--font-plex-600",
  display: "swap",
  weight: "600",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata = {
  metadataBase: new URL("https://cekael.vercel.app"),
  title: "Cedric Kilian — Front-End Developer",
  description:
    "Front-end developer. Bikin tampilan web yang cepat, rapi, dan interaktif dengan Next.js, React, Tailwind, dan Three.js.",
  keywords: [
    "Cedric Kilian",
    "Cekael",
    "front-end developer",
    "portfolio",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Three.js",
    "React Three Fiber",
  ],
  authors: [{ name: "Cedric Kilian" }],
  openGraph: {
    title: "Cedric Kilian — Front-End Developer",
    description: "Tampilan web yang cepat, rapi, dan interaktif.",
    type: "website",
    locale: "id_ID",
    url: "https://cekael.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cedric Kilian — Front-End Developer",
    description: "Tampilan web yang cepat, rapi, dan interaktif.",
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
  themeColor: "#0A0B0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`dark ${instrument.variable} ${plex400.variable} ${plex600.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-canvas text-ink antialiased">
        <Providers>
          {/* Satu canvas 3D persistent buat seluruh halaman (fixed, z-0, pointer-events-none) */}
          <ScrollScene />
          <div className="scene-vignette" aria-hidden="true" />

          <ScrollProgress />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <BackToTop />
          <UiSandbox />
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
