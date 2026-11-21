export const PROFILE = {
  name: "Cedric Kilian",
  nickname: "Cekael",
  fullName: "Cedric Kilian Lasmana",
  role: "Front-End Developer · Technopreneur",
  university: "Universitas Negeri Yogyakarta",
  major: "Electrical Engineering",
  email: "cekaell3@gmail.com",
  phone: "+62 897-2007-113",
  whatsapp: "https://wa.me/628972007113",
  linkedin: "https://www.linkedin.com/in/cedric-kilian-lasmana",
  instagram: "https://instagram.com/cekaaell",
  portfolio: "https://cekael.vercel.app",
  status: "Open to frontend work, internships, and good conversations.",
};

export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "playground", label: "Games" },
  { id: "projects", label: "Work" },
  { id: "stack", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export const HERO_STATS = [
  { value: "9", label: "hero.statGames" },
  { value: "4", label: "hero.statTools" },
  { value: "4", label: "hero.statProjects" },
];

export const MARQUEE = [
  "NEXT.JS",
  "REACT",
  "THREE.JS",
  "REACT THREE FIBER",
  "TAILWIND CSS",
  "TYPESCRIPT",
  "FRONT-END DEVELOPMENT",
  "EMBEDDED / IOT",
  "AI-ASSISTED DEV",
];

export const SKILL_GROUPS = [
  {
    code: "FE-01",
    title: "Front-End",
    blurb: "Layout, komponen, dan animasi secukupnya biar halaman nggak kaku.",
    items: ["HTML & CSS", "JavaScript", "React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    code: "EL-02",
    title: "Dasar Elektro",
    blurb: "Bekal dari kuliah elektro: rangkaian, sistem digital, sampai mikrokontroler.",
    items: ["Sistem Digital", "Rangkaian Listrik", "Arduino / ESP32", "IoT Dasar", "PUIL 2021"],
  },
  {
    code: "3D-03",
    title: "3D di Browser",
    blurb: "Three.js buat latar dan objek interaktif yang tetap enteng.",
    items: ["Three.js", "React Three Fiber", "Drei", "Blender Dasar"],
  },
  {
    code: "TL-04",
    title: "Alat Kerja",
    blurb: "Git, Vercel, dan editor yang bikin perubahan langsung nangkring di production.",
    items: ["Git & GitHub", "Vercel", "VS Code", "Vite", "npm / pnpm"],
  },
];

export const PROJECTS = [
  {
    id: "electrical-cekael",
    featured: true,
    code: "EE-01",
    status: "LIVE",
    year: "2025",
    title: "Electrical Cekael — Interactive Engineering Lab",
    desc: "Lab interaktif buat ngitung dan lihat konsep kelistrikan. Ada kalkulator, skema rangkaian, dan visual 3D biar rumusnya nggak cuma jadi angka di kertas.",
    tags: ["Next.js", "Tailwind CSS", "3D Visualizer"],
    highlights: [
      "6 modul kalkulasi kelistrikan real-time",
      "Skema rangkaian & visual 3D",
      "Referensi standar PUIL 2021 / IEC",
    ],
    href: "https://electricalcekael.vercel.app",
    cta: "Gas Cek Webnya",
  },
  {
    id: "portfolio-3d",
    code: "PF-02",
    status: "LIVE",
    year: "2026",
    title: "Portfolio 3D — Cekael",
    desc: "Portfolio yang lagi kamu buka. Dibangun ulang pakai Next.js dan Three.js, plus latar 3D yang gerak ngikutin scroll.",
    tags: ["Next.js", "React Three Fiber", "Mini Apps"],
    href: "https://cekael.vercel.app",
    cta: "Cek Webnya",
  },
  {
    id: "sela-coffee",
    code: "SELA",
    status: "LIVE",
    year: "2025",
    title: "SELA Coffee — Website Kedai",
    desc: "Website kedai kopi 24 jam. Ada zona ruang, menu, testimoni pelanggan, dan info lokasi. Dibangun pakai HTML, CSS, dan JavaScript.",
    tags: ["HTML", "CSS", "JavaScript", "Business Site"],
    href: "https://selakopi.vercel.app",
    cta: "Mampir",
  },
  {
    id: "portfolio-v1",
    code: "PF-01",
    status: "ARCHIVE",
    year: "2024",
    title: "Website Portofolio v1",
    desc: "Portfolio pertama aku. HTML, CSS, dan JavaScript dari nol, dark theme, animasi scroll. Masih bisa dibuka sampai sekarang.",
    tags: ["HTML", "CSS", "JavaScript"],
    href: "https://kaelyean.netlify.app",
    cta: "Lihat Arsip",
  },
];

export const TOOLS = [
  {
    tag: "Editor",
    title: "VS Code",
    desc: "Editor andalan buat semua project web. Ringan, extension lengkap, preview langsung.",
  },
  {
    tag: "Version Control",
    title: "Git & GitHub",
    desc: "Semua project di-track pakai Git dan disimpan di GitHub. Kalau ada yang rusak, tinggal balik ke commit sebelumnya.",
  },
  {
    tag: "AI Assistant",
    title: "Claude & ChatGPT",
    desc: "Aku pakai buat debug dan ngejar ide pas lagi mentok.",
  },
  {
    tag: "Deployment",
    title: "Vercel & Netlify",
    desc: "Push ke GitHub, langsung ke-deploy sendiri. Nggak perlu ngurus server.",
  },
  {
    tag: "Design",
    title: "Figma",
    desc: "Buat mockup cepat sebelum coding. Kadang langsung di CSS aja sih.",
  },
  {
    tag: "Testing",
    title: "Browser DevTools",
    desc: "Lighthouse, network tab, device toolbar — trio wajib sebelum deploy.",
  },
];


export const SOCIALS = [
  { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: "mail" },
  { label: "WhatsApp", value: PROFILE.phone, href: PROFILE.whatsapp, icon: "whatsapp" },
  { label: "LinkedIn", value: "Cedric Kilian", href: PROFILE.linkedin, icon: "linkedin" },
  { label: "Instagram", value: "@cekaaell", href: PROFILE.instagram, icon: "instagram" },
];

export const AI_SUGGESTIONS = [
  "Siapa sih Cekael itu?",
  "Project electricalcekael apa aja?",
  "Kasih tips ngoding dong",
  "Joke anak teknik elektro",
];

export const CALC_KEYS = [
  ["AC", "DEL", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["±", "0", ".", "="],
];
