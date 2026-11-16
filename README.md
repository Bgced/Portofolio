# Portofolio — Cedric Kilian (Next.js + Tailwind)

Konversi penuh dari situs statis `cekael.vercel.app` (HTML/CSS/JS) ke **Next.js 15 (App Router) + Tailwind CSS v4**, plus 3 fitur interaktif baru:

1. **Karakter 3D interaktif di hero** — `components/InteractiveMascot3D.jsx`
2. **Maskot 2D floating companion** — `components/Mascot2D.jsx`
3. **Portfolio Arcade** (Tic-Tac-Toe Minimax, Circuit Memory, Reaction Test) — `components/PortfolioArcade.jsx`

Arsip versi statis lama disimpan di `legacy/` (bukan dihapus).

---

## Instalasi

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start
```

### Package yang dibutuhkan

```bash
npm install three @react-three/fiber @react-three/drei framer-motion
npm install -D tailwindcss @tailwindcss/postcss
```

| Package | Untuk apa |
| --- | --- |
| `three` | geometri & renderer primitif robot |
| `@react-three/fiber` | renderer React untuk scene 3D |
| `@react-three/drei` | `RoundedBox`, `OrbitControls`, `ContactShadows` |
| `framer-motion` | animasi masuk, scroll reveal, gesture maskot |
| `tailwindcss` + `@tailwindcss/postcss` | utility classes (`bg-slate-950`, `cyan-400`, …) |

---

## Struktur

```
app/
  layout.jsx        # font, provider, chrome (nav/footer/maskot/arcade/preloader)
  page.jsx          # Hero → About → Skills → Projects → Journey → Marquee → Insight → Arcade → Contact
  globals.css       # token Tailwind v4, surface panel, grid texture, marquee, mascot bubble
components/
  InteractiveMascot3D.jsx   # maskot 3D (dynamic, ssr:false)
  Mascot2D.jsx              # companion 2D, pose per section, tombol arcade
  PortfolioArcade.jsx       # modal #arcade + <ArcadeSection />
  Navbar.jsx Footer.jsx Chrome.jsx Starfield.jsx Marquee.jsx
  sections/ (Hero, About, Skills, Projects, Journey, Insight, Contact)
  arcade/ (TechTicTacToe, CircuitMemory, ReactionTest, useMute)
lib/
  i18n.js content.js hooks.js sfx.js bgSettings.js
public/  profile.jpg, favicon*
legacy/  arsip situs statis lama
```

---

## Integrasi (semua sudah terpasang)

Navigasi lama tetap utuh — `Tentang, Skill, Project, Daily Driver, Insight, Kontak` — dengan `Arcade` ditambahkan sebelum `Kontak`.

- **Nav**: `components/Navbar.jsx` → array `LINKS` (tambah/hapus item di satu tempat).
- **Section**: `app/page.jsx` → urutan komponen.
- **Hero 3D**:
  ```jsx
  const InteractiveMascot3D = dynamic(() => import("@/components/InteractiveMascot3D"), { ssr: false });
  ```
  Render di `components/sections/Hero.jsx`.
- **Maskot 2D**: dirender sekali di `app/layout.jsx` (`<Mascot2D />`).
- **Arcade**: `<ArcadeSection />` ada di `app/page.jsx` (anchor `#arcade`) dan `<PortfolioArcade />` di `layout.jsx` (modal yang dibuka nav / maskot / CTA).

### Optimasi 60 FPS yang dipakai

- Semua animasi `useFrame` memakai `useRef` + `delta` (`THREE.MathUtils.damp`) — **tidak ada `setState` di dalam `useFrame`**.
- `<Canvas dpr={[1, 2]} shadows={false}>`, `gl.powerPreference="high-performance"`.
- `frameloop="never"` saat elemen keluar viewport (IntersectionObserver **+** fallback scroll-based, karena IO bisa mati di tab background).
- `<ContactShadows frames={1}>` — tanpa shadow map real-time.
- `next/dynamic({ ssr: false })` untuk 3D.

### Aksesibilitas & suara

- Maskot 3D punya tombol keyboard **"Sapa 👋"** sebagai alternatif klik canvas.
- Arcade modal: `role="dialog"`, `aria-modal`, fokus awal ke tombol tutup, `Esc` menutup, restore fokus, scroll terkunci saat terbuka.
- SFX memakai **WebAudio sintetis** (tanpa file), tombol mute tersimpan di `localStorage`.

---

## Deployment

```bash
npm run build && npm start   # atau push ke Vercel — auto-detect Next.js
```

Catatan: repo ini dulu mendeploy `index.html` statis. Kalau Vercel project lama punya *Output Directory* preset dengan *Framework: Other*, ganti ke **Framework: Next.js** (Output Directory kosong).

## Troubleshooting

- **Maskot 3D tidak muncul**: cek WebGL di browser; komponen sengaja di-`ssr:false`.
- **Animasi keluar (`exit`) tidak jalan**: project ini sengaja **tidak** memakai `AnimatePresence` exit — unmount langsung dipakai supaya overlay modal tidak pernah tertinggal menutupi halaman.
- **Tema terang**: `globals.css` → `html[data-theme="light"]` (toggle di navbar).