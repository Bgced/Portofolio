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
  "nav.circuit-lab": { id: "Lab", en: "Lab" },
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
  "hero.eyebrow": { id: "Front-end · elektro · technopreneur", en: "Front-end · circuits · technopreneur" },
  "hero.line1": { id: "Cedric", en: "Cedric" },
  "hero.line2": { id: "Kilian", en: "Kilian" },
  "hero.play": { id: "Main dulu", en: "Play first" },
  "hero.seeWork": { id: "Cek project", en: "See projects" },
  "hero.status": {
    id: "{games} game, {tools} tool, {projects} project — semua jalan di browser.",
    en: "{games} games, {tools} tools, {projects} projects — all running in the browser.",
  },
  "hero.readoutLabel": { id: "Sistem", en: "System" },
  "hero.statusNote": { id: "Klik apa aja, langsung jalan", en: "Click anything, it just runs" },
  "hero.statGames": { id: "game", en: "games" },
  "hero.statTools": { id: "tool", en: "tools" },
  "hero.statProjects": { id: "project", en: "projects" },
  "hero.scrollHint": { id: "scroll ke bawah", en: "scroll down" },
  "hero.photoCaption": { id: "depan laptop", en: "at the laptop" },

  /* ---------------- intro overlay ---------------- */
  "intro.kicker": { id: "Hai, aku Cedric", en: "Hey, I'm Cedric" },
  "intro.loading": { id: "Bentar ya...", en: "Loading..." },
  "intro.title": { id: "Lagi lihat-lihat?", en: "Just looking around?" },
  "intro.body": {
    id: "Santai aja. Di sini ada {games} game, {tools} tool, {projects} project — semua bisa dibuka langsung, nggak perlu install apa-apa.",
    en: "Make yourself at home. {games} games, {tools} tools, {projects} projects — all open right in the browser, nothing to install.",
  },
  "intro.ctaPlay": { id: "Main yang mana ya", en: "What should I play?" },
  "intro.ctaWork": { id: "Lihat karyanya", en: "Show me your work" },
  "intro.ctaPortfolio": { id: "Lihat portofolio", en: "View portfolio" },
  "intro.enter": { id: "Iya, masuk", en: "Yes, let me in" },
  "intro.snooze": { id: "Jangan tampil lagi 10 menit", en: "Don't show for 10 minutes" },
  "intro.close": { id: "Tutup", en: "Close" },

  /* ---------------- marquee ---------------- */
  "marquee.label": { id: "yang dipakai", en: "in the stack" },

  /* ---------------- about ---------------- */
  "about.kicker": { id: "Tentang", en: "About" },
  "about.title": { id: "Soal", en: "About" },
  "about.accent": { id: "aku.", en: "me." },
  "about.intro": {
    id: "Nulis kode itu kayak nyambungin rangkaian: satu kabel salah, semua mati. Makanya selalu dites di HP beneran.",
    en: "Writing code is like wiring a circuit: one wrong wire and it all goes dead. So I always test on real phones, not just devtools.",
  },
  "about.p1": {
    id: "Kuliah Electrical Engineering di UNY, sambil bangun produk sendiri sebagai technopreneur. Mulai dari HTML dan CSS iseng, sekarang harian React dan Next.js. Situs ini dari portfolio biasa jadi tempat latihan: game, tool, eksperimen 3D.",
    en: "Studying Electrical Engineering at UNY while building my own products as a technopreneur. Started with HTML and CSS for fun, now it's React and Next.js daily. What began as a plain portfolio turned into a playground: games, tools, 3D experiments.",
  },
  "about.p2": {
    id: "Di kampus pegang rangkaian, sistem digital, mikrokontroler. Project gede pertama lahir dari situ: kalkulator kelistrikan plus skema dan visual 3D.",
    en: "On campus it's circuits, digital systems, microcontrollers. My first big project came out of that: an electrical calculator with schematics and 3D visuals.",
  },
  "about.p3": {
    id: "Yang belum kelar, disimpen di lokal. Yang di sini, semua udah jalan.",
    en: "Unfinished stuff stays on my machine. Everything here already runs.",
  },
  "about.available": { id: "Open to work", en: "Open to work" },
  "about.focus": { id: "Fokus", en: "Focus" },
  "about.focusValue": { id: "Produk & Front-End", en: "Product & Frontend" },
  "about.statusLabel": { id: "Status", en: "Status" },
  "about.statusValue": { id: "Mahasiswa", en: "Student" },
  "about.interestLabel": { id: "Minat lain", en: "Other interests" },
  "about.interestValue": { id: "Data & Elektro", en: "Data & Circuits" },
  "about.workLabel": { id: "Cara kerja", en: "How I work" },
  "about.workValue": { id: "Teliti dulu, baru rilis", en: "Careful, then ship" },
  "about.how1Title": { id: "Skema dulu", en: "Schematic first" },
  "about.how1": {
    id: "Sebelum nulis UI, alurnya digambar dulu di kertas — komponen mana nyambung ke mana.",
    en: "Before writing UI, I sketch the flow on paper — which component connects to what.",
  },
  "about.how2Title": { id: "Tes di HP kentang", en: "Test on a cheap phone" },
  "about.how2": {
    id: "Kalau jalan di Android RAM 3GB, biasanya aman di device lain.",
    en: "If it runs on a 3GB-RAM Android, it's probably fine everywhere else.",
  },
  "about.how3Title": { id: "Satu sprint satu endpoint", en: "One sprint, one endpoint" },
  "about.how3": {
    id: "Target per sesi: satu hal yang bisa dibuka di browser dan dibuktikan jalan.",
    en: "Per-session target: one thing I can open in a browser and prove works.",
  },

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
    id: "Rekor cuma hidup di browser ini. Buka kartrid, pecahin rekormu sendiri.",
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
  "stack.title": { id: "Yang aku", en: "Daily" },
  "stack.accent": { id: "pakai.", en: "drivers." },
  "stack.intro": {
    id: "Yang aku pakai tiap hari buat bikin halaman ini dan project lain.",
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
    id: "Nggak ada form panjang. Tulis yang penting, sisanya aku tanya.",
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
    id: "Mau bikin halaman baru atau benerin yang udah ada? Kirim detailnya, nanti aku balas dengan pertanyaan yang jelas.",
    en: "New page or fixing an existing one? Send the details, I'll reply with straight questions.",
  },
  "contact.send": { id: "Kirim email", en: "Send email" },
  "contact.reply": { id: "biasanya bales < 24 jam", en: "usually replies < 24h" },

  /* ---------------- footer ---------------- */
  "footer.made": { id: "Dibangun dengan Next.js & Tailwind CSS", en: "Built with Next.js & Tailwind CSS" },
  "footer.uni": { id: "UNY · Electrical Engineering", en: "UNY · Electrical Engineering" },
  "footer.built": { id: "© {year} Cedric Kilian", en: "© {year} Cedric Kilian" },
  "footer.echo": {
    id: "Dibikin teliti, dicek satu-satu.",
    en: "Built carefully, checked one by one.",
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
