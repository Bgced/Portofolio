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
  "hero.eyebrow": { id: "Front-end & elektro", en: "Front-end & circuits" },
  "hero.line1": { id: "Cedric", en: "Cedric" },
  "hero.line2": { id: "Kilian", en: "Kilian" },
  "hero.intro": {
    id: "React, Next.js, dan Three.js. Semua yang di sini udah jalan.",
    en: "React, Next.js, and Three.js. Everything here already runs.",
  },
  "hero.play": { id: "Main dulu", en: "Play first" },
  "hero.seeWork": { id: "Cek project", en: "See projects" },
  "hero.status": {
    id: "Buka buat project, magang, atau ngobrol soal elektro.",
    en: "Open to projects, internships, or circuit talk.",
  },
  "hero.statGames": { id: "game", en: "games" },
  "hero.statTools": { id: "tool", en: "tools" },
  "hero.statProjects": { id: "project", en: "projects" },
  "hero.scrollHint": { id: "scroll ke bawah", en: "scroll down" },
  "hero.photoCaption": { id: "depan laptop", en: "at the laptop" },

  /* ---------------- intro overlay ---------------- */
  "intro.kicker": { id: "Portofolio interaktif", en: "Interactive portfolio" },
  "intro.title": { id: "Masuk, klik, main.", en: "Come in, click, play." },
  "intro.body": {
    id: "{games} game, {tools} tool, dan {projects} project. Semuanya jalan di browser, nggak ada yang perlu diinstall.",
    en: "{games} games, {tools} tools, and {projects} projects. All running in the browser, nothing to install.",
  },
  "intro.ctaPlay": { id: "Langsung main", en: "Jump into games" },
  "intro.ctaWork": { id: "Lihat project", en: "See the projects" },
  "intro.close": { id: "Tutup layar pembuka", en: "Close intro screen" },

  /* ---------------- marquee ---------------- */
  "marquee.label": { id: "yang dipakai", en: "in the stack" },

  /* ---------------- about ---------------- */
  "about.kicker": { id: "Tentang", en: "About" },
  "about.title": { id: "Soal", en: "About" },
  "about.accent": { id: "gue.", en: "me." },
  "about.intro": {
    id: "Elektro di kampus, web di browser. Dua-duanya soal bikin sesuatu yang beneran kepake.",
    en: "Circuits on campus, web in the browser. Both are about making something that actually works.",
  },
  "about.p1": {
    id: "Kuliah Electrical Engineering di UNY. Mulai dari HTML CSS iseng, sekarang harian React dan Next.js. Situs ini dari portfolio biasa jadi tempat latihan: game, tool, eksperimen 3D.",
    en: "Electrical Engineering at UNY. Started with HTML and CSS for fun, now it's React and Next.js daily. What began as a plain portfolio turned into a sandbox: games, tools, 3D experiments.",
  },
  "about.p2": {
    id: "Di kampus pegang rangkaian, sistem digital, mikrokontroler. Project gede pertama lahir dari situ: kalkulator kelistrikan plus skema dan visual 3D.",
    en: "On campus it's circuits, digital systems, microcontrollers. My first big project came out of that: an electrical calculator with schematics and 3D visuals.",
  },
  "about.p3": {
    id: "Yang belum kelar, disimpen di lokal. Yang lo liat di sini, semua udah jalan.",
    en: "Unfinished stuff stays on my machine. What you see here already runs.",
  },
  "about.available": { id: "Open to work", en: "Open to work" },
  "about.focus": { id: "Fokus", en: "Focus" },
  "about.focusValue": { id: "Front-End Dev", en: "Frontend Dev" },
  "about.statusLabel": { id: "Status", en: "Status" },
  "about.statusValue": { id: "Mahasiswa", en: "Student" },
  "about.interestLabel": { id: "Minat lain", en: "Other interests" },
  "about.interestValue": { id: "Data & Elektro", en: "Data & Circuits" },
  "about.workLabel": { id: "Cara kerja", en: "How I work" },
  "about.workValue": { id: "Pelan tapi jalan", en: "Slow but working" },
  "about.how1Title": { id: "Mulai dari yang kecil", en: "Start small" },
  "about.how1": {
    id: "Bikin versi paling sederhana dulu, baru nambah kalau udah jalan.",
    en: "Build the simplest version first, then add when it works.",
  },
  "about.how2Title": { id: "Satu yang kelar", en: "One thing done" },
  "about.how2": {
    id: "Satu fitur yang jalan lebih berguna dari sepuluh rencana.",
    en: "One working feature beats ten plans.",
  },
  "about.how3Title": { id: "Cek di HP", en: "Test on mobile" },
  "about.how3": {
    id: "Deploy, buka di HP. Kalau udah enak dipakai, naik ke production.",
    en: "Deploy, open on my phone. If it works well, ship it.",
  },
  "about.photoPos": { id: "Foto di {side}", en: "Photo on {side}" },
  "about.posLeft": { id: "kiri", en: "left" },
  "about.posRight": { id: "kanan", en: "right" },

  /* ---------------- projects ---------------- */
  "projects.kicker": { id: "Work", en: "Work" },
  "projects.title": { id: "Yang udah", en: "Stuff that" },
  "projects.accent": { id: "naik.", en: "shipped." },
  "projects.intro": {
    id: "Tiga yang masih online, satu arsip. Sisanya ada di halaman ini, tinggal klik.",
    en: "Three still online, one archive. The rest is on this page, one click away.",
  },
  "projects.featured": { id: "Project unggulan", en: "Featured project" },
  "projects.others": { id: "Project lainnya", en: "Other projects" },
  "projects.cta": { id: "Cek situsnya", en: "Open it" },
  "projects.next": {
    id: "Yang berikutnya masih di lokal, belum naik.",
    en: "The next one is still local, not live yet.",
  },

  /* ---------------- playground / catalog ---------------- */
  "playground.kicker": { id: "Playground", en: "Playground" },
  "playground.title": { id: "Main", en: "Play" },
  "playground.accent": { id: "di sini.", en: "right here." },
  "playground.intro": {
    id: "{games} game dan {tools} tool, semuanya jalan di browser. Skor nyimpen di device ini doang.",
    en: "{games} games and {tools} tools, all running in the browser. Scores stay on this device.",
  },
  "playground.note": {
    id: "Rekor lo cuma hidup di browser ini. Buka kartrid, pecahin rekor lo sendiri.",
    en: "Your record lives in this browser only. Open a cartridge and beat your own score.",
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
    id: "Game butuh JavaScript. Hidupin dulu, terus reload.",
    en: "Games need JavaScript. Turn it on, then reload.",
  },
  "playground.allLocal": {
    id: "Nggak ada data yang dikirim. Cekael AI satu-satunya yang butuh jaringan.",
    en: "No data leaves the page. Cekael AI is the only thing that needs a network.",
  },
  "playground.keysHint": { id: "bisa pakai keyboard", en: "keyboard friendly" },
  "playground.qr": { id: "QR Studio", en: "QR Studio" },
  "playground.ai": { id: "Cekael AI", en: "Cekael AI" },
  "playground.calc": { id: "Kalkulator", en: "Calculator" },
  "playground.bmi": { id: "BMI", en: "BMI" },
  "playground.tablist": { id: "Pilih tool", en: "Pick a tool" },

  /* ---------------- stack ---------------- */
  "stack.kicker": { id: "Skills", en: "Skills" },
  "stack.title": { id: "Yang gue", en: "Daily" },
  "stack.accent": { id: "pakai.", en: "drivers." },
  "stack.intro": {
    id: "Yang gue pake tiap hari buat bikin halaman ini dan project lain.",
    en: "What I reach for daily to build this page and other projects.",
  },
  "stack.drivers": { id: "Alat pendukung", en: "Also in the kit" },

  /* ---------------- contact ---------------- */
  "contact.kicker": { id: "Contact", en: "Contact" },
  "contact.title": { id: "Butuh", en: "Need a" },
  "contact.accent": { id: "front-end?", en: "front-end?" },
  "contact.intro": {
    id: "Mau project, magang, atau sekadar nanya soal elektro? Pilih yang paling gampang.",
    en: "A project, an internship, or a random circuits question. Pick whatever's easiest.",
  },
  "contact.coin": {
    id: "Nggak ada form panjang. Tulis yang penting, sisanya gue tanya.",
    en: "No long form. Write what matters, I'll ask the rest.",
  },
  "contact.findMe": { id: "Temukan aku", en: "Find me" },
  "contact.email": { id: "Email", en: "Email" },
  "contact.whatsapp": { id: "WhatsApp", en: "WhatsApp" },
  "contact.linkedin": { id: "LinkedIn", en: "LinkedIn" },
  "contact.instagram": { id: "Instagram", en: "Instagram" },
  "contact.formTitle": { id: "Punya rencana?", en: "Got a plan?" },
  "contact.formAccent": { id: "Tulis di sini.", en: "Write it here." },
  "contact.formIntro": {
    id: "Mau bikin halaman baru atau benerin yang udah ada? Kirim detailnya, gue bales dengan pertanyaan yang jelas.",
    en: "New page or fixing an existing one? Send the details, I'll reply with straight questions.",
  },
  "contact.send": { id: "Kirim email", en: "Send email" },
  "contact.reply": { id: "biasanya bales < 24 jam", en: "usually replies < 24h" },

  /* ---------------- footer ---------------- */
  "footer.made": { id: "Dibangun dengan Next.js & Tailwind CSS", en: "Built with Next.js & Tailwind CSS" },
  "footer.uni": { id: "UNY · Electrical Engineering", en: "UNY · Electrical Engineering" },
  "footer.built": { id: "© {year} Cedric Kilian", en: "© {year} Cedric Kilian" },
  "footer.echo": {
    id: "Dibikin pelan, dicek satu-satu.",
    en: "Built slowly, checked one by one.",
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
