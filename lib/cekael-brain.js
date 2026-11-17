import { PROFILE } from "@/lib/content";

/**
 * Cekael Brain — rule-based fallback buat Cekael AI.
 * Plain text (pakai \n dan dash bullet), aman di-import dari client maupun server:
 * nggak ada akses window/document/fetch di file ini.
 */

const C = {
  name: PROFILE.name,
  nick: PROFILE.nickname,
  full: PROFILE.fullName,
  uni: PROFILE.university,
  major: PROFILE.major,
  city: "Yogyakarta",
  email: PROFILE.email,
  wa: PROFILE.phone,
  waLink: PROFILE.whatsapp,
  linkedin: PROFILE.linkedin,
  instagram: PROFILE.instagram,
  site: PROFILE.portfolio,
  ee: "https://electricalcekael.vercel.app",
};

const JOKES = [
  "Kenapa resistor nggak pernah ikut rapat?\n- Karena dia selalu nolak (resist) semua ajakan.\n- Ya, aku juga nggak tau kenapa ini lucu.",
  "Gue tanya ke kapasitor: \"lo udah move on belum?\"\n- Dia jawab: \"belum, masih nyimpen tegangan dari masa lalu.\"\n- Charging emosional itu nyata bro.",
  "Kenapa arus listrik nggak pernah telat?\n- Karena dia selalu mengalir tepat waktu, sesuai Hukum Ohm.\n- V = I.R, dan I = Ikhlas.",
  "Tegangan sama arus lagi berantem.\n- Tegangan: \"gue yang bikin lo jalan!\"\n- Arus: \"iya, tapi tanpa gue lo cuma potensi doang.\"\n- Deep, dan agak nggak jelas.",
];

const TIPS = [
  "Tips ngoding dari Cekael:\n- Bangun project kecil yang lo suka, jangan cuma nonton tutorial.\n- Error itu teman, baca pesan errornya pelan-pelan sebelum nanya AI.\n- Konsisten 30 menit/hari lebih ampuh dari 8 jam sekali seminggu.\n- Commit sering, kasih pesan yang jelas — besok lo bakal berterima kasih ke diri sendiri.",
  "Biar ngoding lo nggak mentok:\n- Pecah masalah jadi bagian kecil, satu fungsi satu tugas.\n- console.log / debugger dulu, nebak-nebak belakangan.\n- Baca dokumentasi resmi minimal sekali sebelum copy dari Stack Overflow.\n- Refactor setelah jalan, bukan sebelum jalan.",
];

function pick(list, seed) {
  const n = Math.abs(seed) % list.length;
  return list[n];
}

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  return h;
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s@./+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const RULES = [
  {
    id: "greeting",
    test: /^(halo|hallo|hello|hi|hey|hai|woy|woi|pagi|siang|sore|malam|assalam|yo)\b/,
    reply: () => `Halo juga! Gue ${C.nick} AI, asisten lokal di portfolio ${C.name}.\nMau tanya apa nih?\n- Soal ${C.name} & project-nya\n- Tips ngoding\n- Atau sekadar cek kalkulator & BMI di tab sebelah`,
  },
  {
    id: "howareyou",
    test: /(apa kabar|kabar gimana|gimana kabar|how are you)/,
    reply: () => "Kabar baik dong, gue kan jalan di browser lo — nggak pernah ngantuk.\nLo gimana? Kalau lagi mentok ngoding, coba tanya \"tips ngoding\" atau \"project cekael apa aja\".",
  },
  {
    id: "who",
    test: /(siapa|who is|kenalan|perkenalan|tentang (cek|kamu|lo)|cek ?ael itu|profil)/,
    reply: () => `${C.full}, biasa dipanggil ${C.nick} — ${PROFILE.role}.\n- Kuliah Teknik Elektro (Electrical Engineering) di ${C.uni}\n- Basis di ${C.city}, sekarang fokus web modern, 3D WebGL, dan embedded/IoT\n- Status: ${PROFILE.status}\nProject live-nya bisa dicek di ${C.site}`,
  },
  {
    id: "skills",
    test: /(skill|kemampuan|stack|bisa apa|teknologi|tech|tools|kuasai)/,
    reply: () => `Skill utama ${C.nick}:\n- Frontend: HTML, CSS, JavaScript, React, Next.js, Tailwind CSS, Framer Motion\n- 3D & visual: Three.js, React Three Fiber, Drei, Blender dasar\n- Elektro: sistem digital, rangkaian listrik, Arduino/ESP32, IoT dasar, PUIL 2021\n- Tools: Git & GitHub, Vercel, VS Code, AI pair programming`,
  },
  {
    id: "electrical-project",
    test: /(electrical ?cek|electricalcekael|modul|kalkulasi|puil|iec|web elektro|project elektro)/,
    reply: () => `Electrical Cekael — lab teknik elektro interaktif:\n- ${C.ee}\n- Isinya 6 modul kalkulasi kelistrikan real-time\n- Visualisasi 3D & skema rangkaian dinamis\n- Referensi standar PUIL 2021 / IEC\nDibangun pakai Next.js + Tailwind + visual 3D, biar elektro nggak ngebosenin.`,
  },
  {
    id: "projects",
    test: /(project|proyek|karya|portfolio|portofolio|bikin apa|website apa|sela|kopi)/,
    reply: () => `Project yang jalan sekarang:\n- Electrical Cekael: ${C.ee} (6 modul kalkulasi, 3D, PUIL 2021/IEC)\n- Cekael HQ: ${C.site} — portfolio 3D yang lagi lo buka, plus mini tools ini\n- SELA Coffee: https://selakopi.vercel.app — website kedai kopi 24 jam di Sleman\nSemua detailnya ada di section Karya.`,
  },
  {
    id: "contact",
    test: /(kontak|contact|hubungi|email|whatsapp|wa |linkedin|instagram|ig |dm|rekrut|hire|kolaborasi|magang)/,
    reply: () => `Cara nyamperin ${C.nick}:\n- Email: ${C.email}\n- WhatsApp: ${C.wa} (${C.waLink})\n- LinkedIn: ${C.linkedin}\n- Instagram: ${C.instagram}\nRespon paling cepat lewat WhatsApp atau email ya.`,
  },
  {
    id: "calculator",
    test: /(kalkulator|calculator|hitung|calc|tombol)/,
    reply: () => "Tab Cyber Calc itu kalkulator beneran, bukan gambar.\n- Support keyboard: 0-9, . + - * / % , Enter buat =, Backspace buat hapus, Esc buat reset\n- Bagi 0 bakal muncul error, tinggal AC buat mulai lagi\n- Hasil float dirapihin, jadi 0.1 + 0.2 = 0.3 (bukan 0.30000000004)",
  },
  {
    id: "bmi",
    test: /(bmi|berat badan|tinggi badan|ideal|kurus|obes|overweight|kalori|diet)/,
    reply: () => "Tab BMI Check ngitung Body Mass Index lo real-time.\n- Rumus: berat (kg) / tinggi (m)², dibulatin 1 desimal\n- Kategori: <18.5 kurus, 18.5-24.9 ideal, 25-29.9 overweight, ≥30 obesitas\n- Sekalian muncul range berat sehat buat tinggi lo\nSemua dihitung di browser, nggak dikirim ke mana-mana.",
  },
  {
    id: "coding",
    test: /(tips|belajar|ngoding|coding|programming|pemula|debug|error|stuck|mentok|javascript|react|next)/,
    reply: (text) => pick(TIPS, hash(text)),
  },
  {
    id: "joke",
    test: /(joke|jokes|lawak|lucu|becanda|garing|humor|pantun)/,
    reply: (text) => pick(JOKES, hash(text)),
  },
  {
    id: "thanks",
    test: /(makasih|terima kasih|thanks|thx|tengkyu|sip|mantap|oke|ok)/,
    reply: () => "Sip, sama-sama!\nKalau mau lanjut, coba tanya soal project, tips ngoding, atau mampir ke tab Cyber Calc & BMI Check.",
  },
  {
    id: "capabilities",
    test: /(bisa apa|kamu siapa|kamu bisa|ai apa|gemini|openai|local|offline|model)/,
    reply: () => `Gue ${C.nick} AI, jalan hybrid:\n- Kalau server punya API key, jawaban datang dari Gemini/OpenAI\n- Kalau nggak ada (atau offline), gue jawab pakai brain lokal di browser\n- Yang gue tau: profil ${C.name}, project, skill, kontak, plus tips ngoding & joke elektro\nBadge di header chat nunjukin mode yang lagi aktif.`,
  },
];

const FALLBACK = `Hmm, gue belum yakin nangkep maksud lo. Coba pilih salah satu topik ini:\n- "Siapa sih Cekael itu?" — profil & latar belakang\n- "Project electricalcekael apa aja?" — isi project unggulan\n- "Kasih tips ngoding dong" — tips praktis\n- "Kontak Cekael" — email, WhatsApp, LinkedIn, Instagram`;

/**
 * @param {string} text pertanyaan user
 * @returns {string} jawaban plain text (pakai \n untuk baris baru)
 */
export function getLocalReply(text) {
  const q = normalize(text);
  if (!q) return FALLBACK;

  for (const rule of RULES) {
    if (rule.test.test(q)) return rule.reply(q);
  }

  if (/(joke|lawak)/.test(q)) return pick(JOKES, hash(q));
  if (q.includes("?")) return FALLBACK;

  return FALLBACK;
}
