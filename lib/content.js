export const PROFILE = {
  name: "Cedric Kilian",
  nickname: "Cekael",
  fullName: "Cedric Kilian Lasmana",
  role: "Software Engineer",
  university: "Universitas Negeri Yogyakarta",
  major: "Electrical Engineering",
  email: "cekaell3@gmail.com",
  phone: "+62 897-2007-113",
  whatsapp: "https://wa.me/628972007113",
  linkedin: "https://www.linkedin.com/in/cedric-kilian-lasmana",
  instagram: "https://instagram.com/cekaaell",
  portfolio: "https://cekael.vercel.app",
  status: "Open buat kolaborasi, magang, atau sekadar ngobrol soal tech.",
};

export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "Tentang" },
  { id: "projects", label: "Karya" },
  { id: "playground", label: "Playground" },
  { id: "stack", label: "Setup" },
  { id: "contact", label: "Kontak" },
];

export const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export const HERO_STATS = [
  { value: "3+", label: "project live" },
  { value: "6", label: "modul elektro" },
];

export const MARQUEE = [
  "NEXT.JS",
  "REACT",
  "THREE.JS",
  "REACT THREE FIBER",
  "TAILWIND CSS",
  "TYPESCRIPT",
  "ELECTRICAL ENGINEERING",
  "EMBEDDED / IOT",
  "AI-ASSISTED DEV",
];

export const SKILL_GROUPS = [
  {
    code: "FE-01",
    title: "Frontend & Web",
    blurb: "Bikin interface yang rapi, cepat, dan enak dipakai, dari layout sampe animasi.",
    items: ["HTML & CSS", "JavaScript", "React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    code: "EL-02",
    title: "Elektro & Embedded",
    blurb: "Dasar kelistrikan sampai mikrokontroler. Paham hardware, nggak cuma tampilan.",
    items: ["Sistem Digital", "Rangkaian Listrik", "Arduino / ESP32", "IoT Dasar", "PUIL 2021"],
  },
  {
    code: "3D-03",
    title: "3D & Visual",
    blurb: "Visualisasi teknik elektro dan objek interaktif pakai WebGL yang tetap ringan.",
    items: ["Three.js", "React Three Fiber", "Drei", "Blender Dasar"],
  },
  {
    code: "TL-04",
    title: "Tools & Delivery",
    blurb: "Workflow dari folder lokal sampai production, sudah versioned dan auto-deploy.",
    items: ["Git & GitHub", "Vercel", "VS Code", "AI Pair Programming"],
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
    desc: "Web showcase dan lab interaktif seputar dunia teknik elektro. Dibangun pake visual 3D dan animasi kece buat ngejelasin konsep kelistrikan biar nggak ngebosenin.",
    tags: ["Next.js", "Tailwind CSS", "3D Visualizer"],
    highlights: [
      "6 modul kalkulasi kelistrikan real-time",
      "Visualisasi 3D & skema rangkaian dinamis",
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
    title: "Cekael HQ — Portfolio 3D",
    desc: "Portfolio yang lagi kamu buka sekarang. Dibangun ulang pakai Next.js dan Three.js, plus tema yang bisa gonta-ganti dark/light.",
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
    desc: "Website untuk kedai kopi 24 jam. Isinya zona ruang, menu, testimoni pelanggan, dan info lokasi — dibangun pake HTML, CSS & JavaScript.",
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
    desc: "Portofolio personal pertama aku — dibangun dari nol pake HTML, CSS & JavaScript. Dark theme, animasi scroll, dan fully responsive. Titik awal semuanya.",
    tags: ["HTML", "CSS", "JavaScript"],
    href: "https://kaelyean.netlify.app",
    cta: "Lihat Arsip",
  },
];

export const TOOLS = [
  {
    tag: "Editor",
    title: "VS Code",
    desc: "Editor utama buat semua project web — ringan, extension-nya lengkap, dan live server buat preview langsung.",
  },
  {
    tag: "Version Control",
    title: "Git & GitHub",
    desc: "Setiap project di-track pakai Git dan di-host di GitHub. Buat aku ini wajib, bukan pilihan.",
  },
  {
    tag: "AI Assistant",
    title: "Claude & ChatGPT",
    desc: "Pair programming buat debugging, brainstorming ide, dan belajar konsep baru tanpa buang waktu.",
  },
  {
    tag: "Deployment",
    title: "Vercel & Netlify",
    desc: "Push ke GitHub, auto-deploy, langsung online. Dari kode ke production cuma hitungan menit.",
  },
];

export const NOTES = [
  {
    tag: "AI",
    title: "Kenapa Teknik Elektro & Software Itu Nyambung?",
    body: "Setiap software jalan di atas hardware, dan hardware dibangun dari rangkaian elektronika. Di elektro aku belajar logika digital, mikrokontroler, dan sistem kendali — fondasi embedded software & IoT. Kombinasi dua dunia ini yang bikin aku beda.",
  },
  {
    tag: "WEB",
    title: "HTML, CSS, JavaScript — Bedanya Apa?",
    body: "Kalau website itu rumah: HTML adalah struktur bangunannya, CSS itu cat dan dekorasinya, JavaScript itu listrik yang bikin semuanya hidup. Tiga-tiganya fondasi wajib sebelum kamu nyentuh framework.",
  },
  {
    tag: "TIPS",
    title: "5 Cara Belajar Coding Buat Pemula",
    body: "Bangun, jangan cuma nonton tutorial. Bikin project yang kamu suka. Error itu teman, bukan musuh. Google & AI itu alat, bukan jalan pintas. Konsisten 30 menit tiap hari lebih baik dari 8 jam seminggu sekali.",
  },
];

export const SOCIALS = [
  { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: "mail" },
  { label: "WhatsApp", value: PROFILE.phone, href: PROFILE.whatsapp, icon: "whatsapp" },
  { label: "LinkedIn", value: "Cedric Kilian Lasmana", href: PROFILE.linkedin, icon: "linkedin" },
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
