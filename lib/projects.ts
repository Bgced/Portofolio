/**
 * Data project terpusat (C1). Sumber awal HANYA dari yang sudah ada di web.
 * Field yang belum ada datanya diisi "TODO_ISI" — bukan karangan.
 * Nama: selalu "Cedric Kilian".
 */
export type Project = {
  slug: string;
  code: string;
  title: string;
  year: string;
  role: string;
  status: "LIVE" | "ARCHIVE";
  featured: boolean;
  stack: string[];
  problem: { id: string; en: string };
  solution: { id: string; en: string };
  challenge: { id: string; en: string };
  result: { id: string; en: string };
  links: { live: string; repo: string };
};

const TODO = "TODO_ISI";

export const PROJECTS: Project[] = [
  {
    slug: "electrical-cekael",
    code: "EE-01",
    title: "Electrical Cekael — Interactive Engineering Lab",
    year: "2025",
    role: "Front-end (solo)",
    status: "LIVE",
    featured: true,
    stack: ["Next.js", "Tailwind CSS", "React Three Fiber"],
    problem: {
      id: "Konsep kelistrikan cuma jadi rumus di kertas, susah dibayangin.",
      en: "Electrical concepts live only as formulas on paper — hard to picture.",
    },
    solution: {
      id: "Lab interaktif: kalkulator, skema rangkaian, dan visual 3D yang gerak.",
      en: "Interactive lab: calculators, circuit diagrams, and a moving 3D visualizer.",
    },
    challenge: { id: TODO, en: TODO },
    result: {
      id: "6 modul kalkulasi kelistrikan, live di electricalcekael.vercel.app. Referensi PUIL 2021 / IEC.",
      en: "6 electrical calculation modules, live at electricalcekael.vercel.app. References PUIL 2021 / IEC.",
    },
    links: { live: "https://electricalcekael.vercel.app", repo: TODO },
  },
  {
    slug: "portfolio-3d",
    code: "PF-02",
    title: "Portfolio 3D — Cekael",
    year: "2026",
    role: "Front-end (solo)",
    status: "LIVE",
    featured: false,
    stack: ["Next.js", "React Three Fiber", "Three.js"],
    problem: {
      id: "Portfolio biasa kerasa kaku. Pengen yang gerak ngikutin scroll.",
      en: "A plain portfolio feels stiff. I wanted one that moves with scroll.",
    },
    solution: {
      id: "Next.js + Three.js, latar 3D persistent yang tetap enteng.",
      en: "Next.js + Three.js, a persistent 3D backdrop that stays light.",
    },
    challenge: { id: TODO, en: TODO },
    result: {
      id: "Situs yang lagi kamu buka, plus 9 game dan tool yang semuanya jalan.",
      en: "The site you're on right now, plus 9 games and tools that all run.",
    },
    links: { live: "https://cekael.vercel.app", repo: TODO },
  },
  {
    slug: "sela-coffee",
    code: "SELA",
    title: "SELA Coffee — Website Kedai",
    year: "2025",
    role: "Front-end (solo)",
    status: "LIVE",
    featured: false,
    stack: ["HTML", "CSS", "JavaScript"],
    problem: {
      id: "Kedai kopi 24 jam butuh info menu dan lokasi yang gampang diakses.",
      en: "A 24-hour coffee shop needs menu and location info that's easy to reach.",
    },
    solution: {
      id: "Website satu halaman: zona ruang, menu, testimoni, dan lokasi.",
      en: "One-page site: space, menu, testimonials, and location.",
    },
    challenge: { id: TODO, en: TODO },
    result: {
      id: "Live di selakopi.vercel.app.",
      en: "Live at selakopi.vercel.app.",
    },
    links: { live: "https://selakopi.vercel.app", repo: TODO },
  },
  {
    slug: "portfolio-v1",
    code: "PF-01",
    title: "Website Portofolio v1",
    year: "2024",
    role: "Front-end (solo)",
    status: "ARCHIVE",
    featured: false,
    stack: ["HTML", "CSS", "JavaScript"],
    problem: {
      id: "Portfolio pertama, dibikin dari nol.",
      en: "My first portfolio, built from scratch.",
    },
    solution: {
      id: "HTML, CSS, JS. Dark theme, animasi scroll.",
      en: "HTML, CSS, JS. Dark theme, scroll animation.",
    },
    challenge: { id: TODO, en: TODO },
    result: {
      id: "Masih bisa dibuka sebagai arsip.",
      en: "Still viewable as an archive.",
    },
    links: { live: "https://kaelyean.netlify.app", repo: TODO },
  },
];

export const PROJECTS_BY_SLUG = Object.fromEntries(
  PROJECTS.map((project) => [project.slug, project])
);