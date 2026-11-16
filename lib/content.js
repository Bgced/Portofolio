export const PROFILE = {
  name: "Cedric Kilian",
  email: "cekaell3@gmail.com",
  phone: "+62 897-2007-113",
  whatsapp: "https://wa.me/628972007113",
  linkedin: "https://www.linkedin.com/in/cedric-kilian-lasmana",
  instagram: "https://instagram.com/cekaaell",
  university: "Universitas Negeri Yogyakarta",
};

export const TYPING = {
  id: [
    "Software Engineer & Web Developer",
    "Mahasiswa Teknik Elektro UNY",
    "Frontend Enthusiast",
    "Problem Solver",
  ],
  en: [
    "Software Engineer & Web Developer",
    "Electrical Engineering Student",
    "Frontend Enthusiast",
    "Problem Solver",
  ],
};

export const SKILLS = [
  {
    name: "HTML & CSS",
    level: 75,
    desc: {
      id: "Membangun struktur dan tampilan website yang rapi dan responsif.",
      en: "Building clean, responsive website structure and layout.",
    },
  },
  {
    name: "JavaScript",
    level: 60,
    desc: {
      id: "Menambahkan interaktivitas dan logika pada website.",
      en: "Adding interactivity and logic to the web.",
    },
  },
  {
    name: "Frontend Development",
    level: 55,
    desc: {
      id: "Membangun antarmuka web modern yang bersih dan intuitif.",
      en: "Building modern interfaces that are clean and intuitive.",
    },
  },
  {
    name: "Elektronika & Sistem Digital",
    level: 65,
    desc: {
      id: "Dasar rangkaian, mikrokontroler, dan sistem embedded dari Teknik Elektro.",
      en: "Circuits, microcontrollers, and embedded systems from Electrical Engineering.",
    },
  },
  {
    name: "AI & Machine Learning",
    level: 40,
    desc: {
      id: "Mempelajari konsep AI dan penerapannya dalam aplikasi modern.",
      en: "Learning AI concepts and how they apply to modern apps.",
    },
  },
  {
    name: "Git & GitHub",
    level: 70,
    desc: {
      id: "Version control dan kolaborasi dalam pengembangan software.",
      en: "Version control and collaboration in software development.",
    },
  },
];

export const JOURNEY = [
  {
    tag: { id: "Editor", en: "Editor" },
    title: "VS Code",
    desc: {
      id: "Editor utama buat semua project web — ringan, extension-nya lengkap, dan live server buat preview langsung.",
      en: "My main editor for every web project — light, packed with extensions, and live server for instant preview.",
    },
  },
  {
    tag: { id: "Version Control", en: "Version Control" },
    title: "Git & GitHub",
    desc: {
      id: "Setiap project di-track pakai Git dan di-host di GitHub — version control wajib buat ngoding yang rapi.",
      en: "Every project tracked with Git and hosted on GitHub — version control is mandatory for tidy work.",
    },
  },
  {
    tag: { id: "AI Assistant", en: "AI Assistant" },
    title: "Claude & ChatGPT",
    desc: {
      id: "Pair programming dengan AI — debugging, brainstorming ide, dan belajar konsep baru lebih cepat.",
      en: "Pair programming with AI — debugging, brainstorming, and learning new concepts faster.",
    },
  },
  {
    tag: { id: "Deployment", en: "Deployment" },
    title: "Vercel & Netlify",
    desc: {
      id: "Setiap project langsung online — push ke GitHub, auto-deploy. Workflow dari code sampai production.",
      en: "Every project goes live instantly — push to GitHub, auto-deploy. Code to production workflow.",
    },
    future: true,
  },
];

export const MARQUEE = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Next.js",
  "Tailwind",
  "AI",
  "Machine Learning",
  "Elektronika",
  "Git",
  "Python",
  "Frontend",
  "Problem Solving",
];

export const PROJECTS = [
  {
    code: "WS",
    kind: "project",
    title: "Website Portofolio",
    desc: "Website portofolio personal pertama saya — dibangun dari nol dengan HTML, CSS & JavaScript. Dark theme, animasi scroll, dan fully responsive.",
    tags: ["HTML", "CSS", "JavaScript"],
    href: "https://kaelyean.netlify.app",
  },
  {
    code: "SELA",
    kind: "project",
    title: "SELA Coffee — Website Kedai",
    desc: "Website untuk kedai kopi 24 jam di Sleman, Yogyakarta. Menampilkan zona ruang, menu, testimoni pelanggan, dan info lokasi — dibangun dengan HTML, CSS & JavaScript.",
    tags: ["HTML", "CSS", "JavaScript", "Business Site"],
    href: "https://selakopi.vercel.app",
  },
  {
    code: "AI",
    kind: "knowledge",
    title: "Cara Kerja AI",
    desc: "AI belajar dari pola data, bukan diprogram aturan per aturan. Prosesnya: data masuk → diproses algoritma → keluar prediksi. Makin banyak data, makin akurat hasilnya.",
    tags: ["AI", "Dasar"],
  },
  {
    code: "NN",
    kind: "knowledge",
    title: "Neural Network",
    desc: "Neural network meniru neuron otak manusia: input layer (terima data), hidden layers (proses pola), output layer (hasil). Fondasi ChatGPT, face recognition, sampai mobil otonom.",
    tags: ["Deep Learning", "AI"],
  },
  {
    code: "ES",
    kind: "knowledge",
    title: "Embedded System",
    desc: "Dari dunia Teknik Elektro: komputer kecil di dalam alat — mikrokontroler (Arduino, ESP32) mengontrol sensor & aktuator. Jembatan antara hardware dan software.",
    tags: ["Teknik Elektro", "IoT"],
  },
  {
    code: "PE",
    kind: "knowledge",
    title: "Prompt Engineering",
    desc: "Seni memberi instruksi ke AI. Prompt yang bagus itu spesifik + konteks + contoh. Bukan \"buatkan kode web\", tapi \"buatkan landing page toko kopi warna coklat pakai HTML & CSS\".",
    tags: ["AI", "Skill Masa Depan"],
  },
];

export const INSIGHTS = [
  {
    tag: "Artificial Intelligence",
    title: "Apa Itu AI (Artificial Intelligence)?",
    read: 3,
    topic: "AI, Teknologi",
    body: [
      "AI (Kecerdasan Buatan) adalah cabang ilmu komputer yang bertujuan menciptakan mesin yang bisa melakukan tugas yang biasanya membutuhkan kecerdasan manusia — seperti memahami bahasa, mengenali gambar, mengambil keputusan, dan belajar dari pengalaman.",
      "Secara sederhana, AI bekerja dengan pola: data masuk → diproses dengan algoritma → keluar prediksi atau keputusan. Semakin banyak data, semakin \"pintar\" sistemnya. Contoh AI yang kita pakai sehari-hari: rekomendasi YouTube & Spotify, asisten suara, chatbot seperti ChatGPT & Claude, hingga filter spam di email.",
      "AI dibagi menjadi beberapa level: Narrow AI (fokus satu tugas, contohnya semua AI yang ada sekarang), General AI (bisa berpikir seperti manusia di banyak bidang — masih penelitian), dan Super AI (lebih pintar dari manusia — masih teori).",
    ],
  },
  {
    tag: "Machine Learning",
    title: "Apa Bedanya AI, Machine Learning, dan Deep Learning?",
    read: 3,
    topic: "AI, Machine Learning",
    body: [
      "Banyak yang mengira ketiganya sama, padahal hubungannya seperti boneka matryoshka: Deep Learning ⊂ Machine Learning ⊂ AI.",
      "AI adalah payung besarnya — semua teknik agar mesin \"pintar\". Machine Learning adalah salah satu caranya: mesin belajar dari data, bukan diprogram langsung aturan per aturan. Contoh: sistem prediksi cuaca yang belajar dari data cuaca bertahun-tahun.",
      "Deep Learning adalah sub-bidang ML yang meniru cara kerja otak manusia dengan neural network berlapis-lapis. Ini teknologi di balik pengenalan wajah, mobil otonom, dan AI generatif seperti ChatGPT.",
    ],
  },
  {
    tag: "Web Development",
    title: "HTML, CSS, JavaScript — Bedanya Apa?",
    read: 2,
    topic: "Web, Pemula",
    body: [
      "Kalau website itu rumah, maka HTML adalah struktur bangunannya (dinding, pintu, jendela), CSS adalah cat dan dekorasinya (warna, font, tata letak), dan JavaScript adalah listrik yang membuat semuanya hidup (tombol jalan, animasi, interaksi).",
      "Ketiganya adalah fondasi wajib untuk jadi web developer. Website ini sendiri awalnya dibangun hanya dengan HTML + CSS — bukti bahwa dengan dua bahasa ini saja, kamu sudah bisa membuat sesuatu yang nyata dan online.",
    ],
  },
  {
    tag: "Large Language Model",
    title: "Bagaimana ChatGPT Bisa \"Ngobrol\"?",
    read: 3,
    topic: "AI, LLM, Chatbot",
    body: [
      "Chatbot AI seperti ChatGPT & Claude ditenagai oleh LLM (Large Language Model) — model AI raksasa yang dilatih membaca miliaran teks dari internet, buku, dan artikel.",
      "Cara kerjanya sederhana tapi brilian: LLM memprediksi kata berikutnya. Kalau kamu tulis \"Matahari terbit dari arah...\", model menghitung kata mana yang paling mungkin selanjutnya (\"timur\"). Karena dilatih dengan begitu banyak data, prediksinya terasa seperti benar-benar mengerti.",
      "Menariknya, LLM tidak \"tahu\" jawaban seperti manusia — dia mengenali pola statistik bahasa. Makanya kadang bisa salah (istilahnya halusinasi AI), dan makanya kita tetap perlu verifikasi info penting.",
    ],
  },
  {
    tag: "Teknik Elektro × Software",
    title: "Kenapa Teknik Elektro dan Software Itu Nyambung?",
    read: 3,
    topic: "Hardware, IoT, Kuliah",
    body: [
      "Banyak yang mikir: \"Kuliah Teknik Elektro kok bikin website?\" Padahal dua dunia ini terhubung erat. Setiap software berjalan di atas hardware — dan hardware itu dibangun dari rangkaian elektronika.",
      "Di Teknik Elektro saya belajar logika digital (dasar dari semua prosesor), mikrokontroler (komputer mini yang jalanin kode C), dan sistem kendali (algoritma yang bikin drone stabil). Semua konsep ini adalah fondasi dari embedded software dan IoT.",
      "Cita-citanya: jadi engineer yang paham dua-duanya — bisa merancang rangkaian sekaligus menulis software-nya. Kombinasi langka yang dibutuhkan di era IoT dan robotika.",
    ],
  },
  {
    tag: "Tips Belajar",
    title: "5 Cara Belajar Coding untuk Pemula (Berdasarkan Pengalaman)",
    read: 4,
    topic: "Tips, Pemula, Coding",
    body: [
      "1. Bangun, jangan cuma nonton tutorial. Nonton 10 jam video tanpa praktik = lupa besoknya. Langsung ketik kodenya sendiri.",
      "2. Bikin project yang kamu suka. Website ini contohnya — aku belajar HTML & CSS sambil membangun portofolio sendiri, bukan sekadar nonton course.",
      "3. Error itu teman, bukan musuh. 80% waktu programmer habis untuk memperbaiki error. Baca pesan errornya pelan-pelan — dia memberi tahu letak masalahnya.",
      "4. Google & AI itu alat, bukan jalan pintas. Cari solusinya, pahami kenapa itu jadi solusi, baru salin kodenya.",
      "5. Konsisten dikit lebih baik dari semangat besar sehari. 30 menit tiap hari lebih baik dari 8 jam tiap minggu.",
    ],
  },
];

export const SEASONS = [
  { name: "Musim Dingin", emoji: "❄️", key: "winter", accent: "#a0c8ff", particles: "snow" },
  { name: "Musim Hujan", emoji: "🌧️", key: "rain", accent: "#80c8ff", particles: "rain" },
  { name: "Musim Semi", emoji: "🌸", key: "spring", accent: "#ffb3d9", particles: "petals" },
  { name: "Musim Gugur", emoji: "🍂", key: "autumn", accent: "#ffb347", particles: "leaves" },
  { name: "Musim Panas", emoji: "☀️", key: "summer", accent: "#ffd966", particles: "fireflies" },
];
