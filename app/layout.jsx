import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/chrome/Navbar";
import Footer from "@/components/chrome/Footer";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import BackToTop from "@/components/chrome/BackToTop";
import IntroOverlay from "@/components/chrome/IntroOverlay";
import CommandPalette from "@/components/chrome/CommandPalette";
import DevOverlay from "@/components/chrome/DevOverlay";
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

const sora = localFont({
  src: "./fonts/sora-latin.woff2",
  variable: "--font-sora",
  display: "swap",
  weight: "400 800",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const plex600 = localFont({
  src: "./fonts/ibm-plex-mono-600-latin.woff2",
  variable: "--font-plex-600",
  display: "swap",
  weight: "600",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

const SITE_URL = "https://cekael.vercel.app";
const SITE_TITLE = "Cedric Kilian — Front-End Developer Portfolio";
const SITE_DESC =
  "Cedric Kilian, front-end developer and Electrical Engineering student at UNY. I build sites that run smooth on cheap phones, plus interactive tools for electrical concepts.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
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
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
      "id-ID": SITE_URL,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    url: SITE_URL,
    siteName: "Cedric Kilian",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
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
  themeColor: "#0B0C0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${instrument.variable} ${sora.variable} ${plex400.variable} ${plex600.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-canvas text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Cedric Kilian",
              url: SITE_URL,
              jobTitle: "Front-End Developer",
              description:
                "Front-end developer and Electrical Engineering student at UNY.",
              sameAs: [
                "https://github.com/bgced",
                "https://www.linkedin.com/in/cedric-kilian-lasmana",
                "https://instagram.com/cekaaell",
              ],
            }),
          }}
        />
        <Providers>
          {/* Satu canvas 3D persistent buat seluruh halaman (fixed, z-0, pointer-events-none) */}
          <ScrollScene />
          <div className="scene-vignette" aria-hidden="true" />

          <ScrollProgress />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <BackToTop />
          <IntroOverlay />
          <UiSandbox />
          <CommandPalette />
          <DevOverlay />
        </Providers>
      </body>
    </html>
  );
}
