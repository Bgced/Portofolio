export const LANGUAGES = ["en", "id"];

/**
 * Copy situs: nada arcade-playground. EN default (kayak referensi),
 * ID tetap ada dan jelas, bukan terjemahan kaku.
 */
export const COPY = {
  /* ---------------- nav ---------------- */
  "nav.home": { id: "Beranda", en: "Home" },
  "nav.about": { id: "Tentang", en: "About" },
  "nav.projects": { id: "Work", en: "Work" },
  "nav.playground": { id: "Games", en: "Games" },
  "nav.stack": { id: "Skills", en: "Skills" },
  "nav.features": { id: "Tools", en: "Tools" },
  "nav.contact": { id: "Contact", en: "Contact" },
  "nav.main": { id: "Navigasi utama", en: "Main navigation" },
  "nav.mobile": { id: "Navigasi mobile", en: "Mobile navigation" },
  "nav.open": { id: "Buka menu navigasi", en: "Open navigation menu" },
  "nav.close": { id: "Tutup menu navigasi", en: "Close navigation menu" },
  "nav.homeLabel": { id: "balik ke atas", en: "back to top" },
  "nav.playNow": { id: "Main sekarang", en: "Play now" },

  /* ---------------- hero ---------------- */
  "hero.eyebrow": { id: "Portfolio · Game & Web", en: "Portfolio · Game & Web" },
  "hero.line1": { id: "Bangun dunia.", en: "Build worlds." },
  "hero.line2": { id: "Mainkan semua.", en: "Play them all." },
  "hero.intro": {
    id: "Aku mahasiswa Electrical Engineering yang ngoding web pakai React & Next.js. Situs ini playground-ku — 9 game dan beberapa tool yang beneran jalan. Nggak ada mockup, klik aja.",
    en: "I'm an Electrical Engineering student who builds web apps with React & Next.js. This site is my playground — 9 playable games and everyday tools. Nothing here is a mockup, click around.",
  },
  "hero.play": { id: "Mainkan gamenya", en: "Play the games" },
  "hero.seeWork": { id: "Lihat hasil kerja", en: "See the work" },
  "hero.status": {
    id: "Terbuka buat kerja front-end — {games} game dan {tools} tool siap dicoba.",
    en: "Available for frontend work — {games} games and {tools} tools to try.",
  },
  "hero.statGames": { id: "game", en: "games" },
  "hero.statTools": { id: "tool", en: "tools" },
  "hero.statMockups": { id: "mockup", en: "mockups" },
  "hero.scrollHint": { id: "scroll ke bawah", en: "scroll down" },
  "hero.photoCaption": { id: "depan laptop", en: "at the laptop" },

  /* ---------------- marquee ---------------- */
  "marquee.label": { id: "yang dipakai", en: "in the stack" },

  /* ---------------- about ---------------- */
  "about.kicker": { id: "Tentang", en: "About" },
  "about.title": { id: "Sedikit soal", en: "A little bit about" },
  "about.accent": { id: "Cedric Kilian", en: "Cedric Kilian" },
  "about.intro": {
    id: "Bukan portfolio biasa. Semua yang bisa kamu klik di sini beneran jalan.",
    en: "Not a typical portfolio. Everything you can click here actually works.",
  },
  "about.p1": {
    id: "Aku mahasiswa Electrical Engineering di UNY yang hampir semua waktunya di ekosistem React + Next.js. Daripada bikin portfolio statis, situs ini jadi playground — tiap game dan tool di sini nyata dan bisa kamu coba sekarang.",
    en: "I'm a student in the React + Next.js ecosystem. Instead of a typical portfolio, I made this site a playground: every game and tool here is a real, working thing you can try right now.",
  },
  "about.p2": {
    id: "Di luar ngoding, aku ngulik rangkaian listrik dan mikrokontroler — dari logika digital sampai IoT dasar. Itu juga alasan project andalanku soal kelistrikan.",
    en: "Outside of code, I tinker with circuits and microcontrollers — from digital logic to basic IoT. That's also why my main project is about electrical engineering.",
  },
  "about.p3": {
    id: "Nggak ada 'coming soon' di sini. Yang nggak jadi, nggak dipajang.",
    en: "No 'coming soon' anywhere. If it doesn't run, it doesn't get shown.",
  },
  "about.available": { id: "Open to work", en: "Open to work" },
  "about.focus": { id: "Fokus", en: "Focus" },
  "about.focusValue": { id: "Front-End Dev", en: "Frontend Dev" },
  "about.statusLabel": { id: "Status", en: "Status" },
  "about.statusValue": { id: "Mahasiswa", en: "Student" },
  "about.interestLabel": { id: "Minat lain", en: "Other interests" },
  "about.interestValue": { id: "Data & Elektro", en: "Data & Circuits" },
  "about.workLabel": { id: "Cara kerja", en: "How I work" },
  "about.workValue": { id: "Open Source", en: "Open Source" },
  "about.how1Title": { id: "Open Source", en: "Open Source" },
  "about.how1": {
    id: "Kode kubuka, dan aku belajar dari cara orang lain membangun.",
    en: "I share code openly and learn from how other people build.",
  },
  "about.how2Title": { id: "Selalu Belajar", en: "Always Learning" },
  "about.how2": {
    id: "Kursus dan dokumentasi — plus bongkar sesuatu cuma biar bisa benerin lebih rapi.",
    en: "Courses and docs — plus breaking things just to fix them better.",
  },
  "about.how3Title": { id: "Dibangun Terbuka", en: "Built in Public" },
  "about.how3": {
    id: "Semua yang ada di sini bisa dipakai hari ini. Nggak ada janji kosong.",
    en: "Everything here is usable today. No empty promises.",
  },

  /* ---------------- projects ---------------- */
  "projects.kicker": { id: "Work", en: "Work" },
  "projects.title": { id: "Yang sudah", en: "Selected" },
  "projects.accent": { id: "dipakai orang.", en: "work" },
  "projects.intro": {
    id: "Beberapa hal yang beneran sudah live, plus semua yang jalan di situs ini.",
    en: "A few things I have actually shipped, plus everything that runs on this site.",
  },
  "projects.featured": { id: "Project unggulan", en: "Featured project" },
  "projects.others": { id: "Project lainnya", en: "Other projects" },
  "projects.cta": { id: "Buka situsnya", en: "Open the site" },
  "projects.next": {
    id: "Project berikutnya masih di server lokal.",
    en: "The next project is still on the local server.",
  },

  /* ---------------- playground / catalog ---------------- */
  "playground.kicker": { id: "Playground", en: "Playground" },
  "playground.title": { id: "Semua bisa", en: "Everything is" },
  "playground.accent": { id: "dimainkan.", en: "playable." },
  "playground.intro": {
    id: "{games} game, tanpa mockup. Pilih satu dan mainkan — skormu disimpan di browser ini.",
    en: "{games} games, no mockups. Pick one and play — scores stay in your browser.",
  },
  "playground.note": {
    id: "Rekor terbaikmu cuma tersimpan di perangkat ini. Buka kartrid dan pecahkan.",
    en: "Your best score is stored on this device only. Open a cartridge and beat it.",
  },
  "playground.gamesHeading": { id: "Game", en: "Games" },
  "playground.toolsHeading": { id: "Tool", en: "Tools" },
  "playground.play": { id: "Main", en: "Play" },
  "playground.open": { id: "Buka", en: "Open" },
  "playground.best": { id: "Best", en: "Best" },
  "playground.bestNone": { id: "—", en: "—" },
  "playground.close": { id: "Tutup", en: "Close" },
  "playground.loading": { id: "memuat kartrid…", en: "loading cartridge…" },
  "playground.noJs": {
    id: "Game butuh JavaScript. Hidupkan dulu, lalu muat ulang.",
    en: "Games need JavaScript. Enable it, then reload.",
  },
  "playground.allLocal": {
    id: "Semua jalan di browser kamu. Nggak ada data yang dikirim kecuali kamu pakai Cekael AI.",
    en: "Everything runs in your browser, nothing gets sent unless you use Cekael AI.",
  },
  "playground.keysHint": { id: "bisa pakai keyboard", en: "keyboard friendly" },
  "playground.qr": { id: "QR Studio", en: "QR Studio" },
  "playground.ai": { id: "Cekael AI", en: "Cekael AI" },
  "playground.calc": { id: "Kalkulator", en: "Calculator" },
  "playground.bmi": { id: "BMI", en: "BMI" },
  "playground.tablist": { id: "Pilih tool", en: "Pick a tool" },

  /* ---------------- stack ---------------- */
  "stack.kicker": { id: "Skills", en: "Skills" },
  "stack.title": { id: "Alat", en: "Daily" },
  "stack.accent": { id: "harian.", en: "drivers." },
  "stack.intro": {
    id: "Yang kupakai tiap hari buat bikin halaman ini dan project lain.",
    en: "The things I reach for every day to build this page and other projects.",
  },
  "stack.drivers": { id: "Alat pendukung", en: "Also in the kit" },

  /* ---------------- contact ---------------- */
  "contact.kicker": { id: "Contact", en: "Contact" },
  "contact.title": { id: "Ada ide?", en: "Got an idea?" },
  "contact.accent": { id: "Bikin bareng.", en: "Let's build it." },
  "contact.intro": {
    id: "Butuh bantuan front-end, mau ngobrol soal elektro, atau cuma pengen coba gamenya?",
    en: "Need a frontend hand, want to talk circuits, or just want to try the games?",
  },
  "contact.coin": { id: "Insert coin — 1 credit = 1 balasan", en: "Insert coin — 1 credit = 1 reply" },
  "contact.findMe": { id: "Temukan aku", en: "Find me" },
  "contact.email": { id: "Email", en: "Email" },
  "contact.whatsapp": { id: "WhatsApp", en: "WhatsApp" },
  "contact.linkedin": { id: "LinkedIn", en: "LinkedIn" },
  "contact.instagram": { id: "Instagram", en: "Instagram" },
  "contact.formTitle": { id: "Punya rencana?", en: "Got a plan?" },
  "contact.formAccent": { id: "Tulis di sini.", en: "Write it here." },
  "contact.formIntro": {
    id: "Mau bikin halaman baru atau benerin yang udah ada? Kirim detailnya, aku balas dengan pertanyaan yang jelas.",
    en: "Building a new page or fixing an existing one? Send the details and I'll reply with clear questions.",
  },
  "contact.send": { id: "Kirim email", en: "Send email" },
  "contact.reply": { id: "biasanya bales < 24 jam", en: "usually replies < 24h" },

  /* ---------------- footer ---------------- */
  "footer.made": { id: "Dibangun dengan Next.js & Tailwind CSS", en: "Built with Next.js & Tailwind CSS" },
  "footer.uni": { id: "UNY · Electrical Engineering", en: "UNY · Electrical Engineering" },
  "footer.built": { id: "© {year} Cedric Kilian", en: "© {year} Cedric Kilian" },
  "footer.echo": {
    id: "Satu hal yang bisa dimainkan, satu per satu.",
    en: "One playable thing at a time.",
  },
  "footer.games": { id: "Game", en: "Games" },
  "footer.tools": { id: "Tool", en: "Tools" },
  "footer.links": { id: "Links", en: "Links" },
  "footer.legal": { id: "Legal", en: "Legal" },
  "footer.privacy": { id: "Privasi", en: "Privacy" },
  "footer.terms": { id: "Ketentuan", en: "Terms" },

  /* ---------------- misc ---------------- */
  "lang.switch": { id: "Ganti bahasa", en: "Switch language" },
  "common.openWork": { id: "Open to work", en: "Open to work" },
  "common.available": { id: "Tersedia", en: "Available" },
  "common.copyEmail": { id: "Copy email", en: "Copy email" },
  "common.emailCopied": { id: "Email ter-copy", en: "Email copied" },
  "common.sendEmail": { id: "Kirim email", en: "Send email" },
  "common.viewSite": { id: "Buka situs", en: "Open site" },
  "common.seeArchive": { id: "Lihat arsip", en: "See archive" },
  "common.visit": { id: "Kunjungi", en: "Visit" },
  "common.live": { id: "Live", en: "Live" },
  "common.featured": { id: "Unggulan", en: "Featured" },
};

export function translate(key, lang = "en", vars) {
  const entry = COPY[key];
  let text = entry ? entry[lang] ?? entry.en ?? entry.id : key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function navLabel(id, lang) {
  return translate(`nav.${id}`, lang);
}
