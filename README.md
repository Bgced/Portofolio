# CEKAEL HQ — Portofolio 3D Cedric Kilian

Redesign total `cekael.vercel.app` jadi portofolio 3D interaktif bertema **industrial cyber-futuristic**. Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + Three.js / React Three Fiber.

Dark mode default (pitch black + electric cyan), light mode off-white + deep cyan. Toggle tema memakai `next-themes` dengan class di `<html>` dan `suppressHydrationWarning`, jadi tidak ada flicker atau hydration mismatch. Scene 3D ikut berubah warna saat tema diganti.

## Fitur

- **Hero 3D** — matriks kubus 3×3×3 matte dengan edge cyan menyala. Auto-rotate, parallax mengikuti kursor, drag untuk memutar. Ada fallback CSS cube kalau WebGL tidak tersedia dan error boundary kalau context hilang.
- **Bento project** — featured *Electrical Cekael — Interactive Engineering Lab* + project lama (Portofolio 3D, SELA Coffee, Portofolio v1) dalam card seragam. Semua card punya efek 3D tilt.
- **Playground & Mini Tools** — tiga tools fungsional:
  - **Cyber Calc** — operasi dasar, persen, desimal, DEL/AC, validasi operator ganda, anti pembagian nol, input keyboard.
  - **BMI Check** — validasi angka positif, bar indikator, kategori bahasa gaul.
  - **Cekael AI** — chat hybrid: Gemini/OpenAI lewat `/api/chat` kalau API key tersedia, fallback rule-based lokal kalau tidak ada key/offline. Efek typing.
- **Responsive** — mobile, tablet, desktop. Tidak ada horizontal overflow; keypad calculator tetap nyaman di layar HP.
- **Performa** — Canvas di-`dynamic(..., { ssr: false })`, dibungkus `<Suspense>`, rendering dipause saat keluar viewport, semua animasi per-frame memakai ref (tanpa `setState` di `useFrame`). Komponen 3D di-`React.memo`.

## Instalasi

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start
```

### Dependency utama

```bash
npm install three @react-three/fiber @react-three/drei next-themes lucide-react framer-motion
npm install -D tailwindcss @tailwindcss/postcss @types/three
```

| Package | Dipakai untuk |
| --- | --- |
| `three` | geometri, material, dan edge kubus 3D |
| `@react-three/fiber` | renderer React untuk scene Three.js |
| `@react-three/drei` | `Float`, `Edges`, `RoundedBox` |
| `next-themes` | tema dark/light tanpa flicker |
| `lucide-react` | ikon UI |
| `framer-motion` | reveal on scroll & animasi section |
| `tailwindcss` + `@tailwindcss/postcss` | utility CSS (Tailwind v4) |

> Project ini memakai **JavaScript modular (JSX)** — bukan TypeScript. `@types/three` disertakan supaya aman kalau nanti dimigrasi bertahap ke TS.

## Environment variables (opsional)

Cekael AI tetap jalan tanpa API key (local rule-based engine). Untuk mengaktifkan mode online, buat `.env.local`:

```bash
# Pilih salah satu (Gemini diprioritaskan)
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash

# atau
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
```

Contoh lengkap ada di `.env.example`. Endpoint `POST /api/chat` menerima `{ messages: [{ role, content }] }` dan mengembalikan `{ reply, source }`. Kalau provider error/timeout, server otomatis mengembalikan jawaban lokal dengan `source: "local"` (HTTP 200, bukan error).

## Struktur

```
app/
  layout.jsx                 # font, metadata, next-themes provider, chrome
  page.jsx                   # Hero → Marquee → About → Projects → Playground → Stack → Contact
  globals.css                # design token dark/light, panel, tilt, marquee, scanline
  api/chat/route.js          # Gemini/OpenAI + fallback lokal
components/
  providers.jsx              # next-themes (class strategy)
  chrome/                    # Navbar, ThemeToggle, Footer, ScrollProgress, BackToTop
  sections/                  # Hero, About, Projects, Playground, Stack, Contact
  three/HeroScene.jsx        # Canvas + cube matrix + WebGL fallback
  playground/                # CyberCalc, BmiCalc, CekaelAI, PlaygroundTabs
  ui/                        # TiltCard, SectionHeading, Reveal, Marquee
lib/
  content.js                 # profil, project, skill, tools, notes (single source of truth)
  cekael-brain.js            # local rule-based AI
  hooks.js                   # useInView, useWebGLSupport, useActiveSection, dll
public/                      # profile.jpg, favicon*
legacy/                      # arsip situs statis lama (tidak dipakai app)
```

## Catatan teknis

- **Tema**: token warna ada di `app/globals.css` (`:root` = dark, `html.light` = light). Semua komponen memakai token (`bg-surface`, `text-ink`, `text-accent`, dst.) supaya light mode tidak perlu `dark:` satu per satu.
- **3D**: scene membaca `resolvedTheme` dari `next-themes`, jadi warna kubus, edge, dan lighting menyesuaikan tema. Canvas hanya di-render di client.
- **Isolasi state**: Playground adalah subtree terpisah dari Hero 3D. Mengetik di calculator/AI tidak memicu re-render Canvas.
- **Aksesibilitas**: nav mobile mendukung Escape + scroll lock, tab playground mendukung panah keyboard, calculator punya `aria-live`, tombol punya label, reduced-motion dihormati.

## Deployment

Push ke GitHub lalu import di Vercel — framework terdeteksi otomatis sebagai Next.js. `vercel.json` sudah diset `framework: nextjs`. Tambahkan environment variable AI di dashboard Vercel kalau ingin mode online.

## Troubleshooting

- **Kubus 3D tidak muncul** → cek WebGL di browser. Komponen akan menampilkan CSS cube fallback, bukan crash.
- **AI selalu mode lokal** → API key belum diset atau provider timeout. Cek `.env.local` lalu restart dev server.
- **Tema tidak berubah** → pastikan `next-themes` provider ada di `app/layout.jsx` dan `suppressHydrationWarning` terpasang di `<html>`.
