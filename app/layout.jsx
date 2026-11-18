import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/chrome/Navbar";
import Footer from "@/components/chrome/Footer";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import BackToTop from "@/components/chrome/BackToTop";
import CommandPalette from "@/components/chrome/CommandPalette";
import UiSandbox from "@/components/chrome/UiSandbox";
import ScrollScene from "@/components/three/ScrollScene";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
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
  authors: [{ name: "Cedric Kilian Lasmana" }],
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#161412" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${jetbrains.variable}`}
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
