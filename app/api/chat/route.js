import { PROFILE } from "@/lib/content";
import { getLocalReply } from "@/lib/cekael-brain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 10;
const MAX_CHARS = 1200;
const PROVIDER_TIMEOUT_MS = 12000;

const SYSTEM_PROMPT = `Kamu adalah "Cekael AI", asisten di portfolio ${PROFILE.fullName} (panggil "Cekael").
Aturan:
- Selalu jawab dalam Bahasa Indonesia gaul (santai, akrab, pakai "kamu/aku" secukupnya), singkat 2-6 baris.
- Fokus topik: profil Cekael, skill, project, cara kontak, dan bantu jelasin mini tools di portfolio (Cyber Calc, BMI Check).
- Kalau relevan, arahkan user ke project/link/kontak berikut.
- Jangan mengarang data pribadi di luar fakta ini. Kalau nggak tau, bilang belum tau dan arahkan ke kontak.

Fakta (satu-satunya sumber):
- Nama lengkap: ${PROFILE.fullName} (nickname ${PROFILE.nickname})
- Role: ${PROFILE.role}
- Kuliah: ${PROFILE.major}, ${PROFILE.university} — ${PROFILE.location}
- Status: ${PROFILE.status}
- Portfolio: ${PROFILE.portfolio}
- Project unggulan Electrical Cekael: https://electricalcekael.vercel.app (6 modul kalkulasi kelistrikan, visualisasi 3D, referensi PUIL 2021 / IEC)
- Project lain: Cekael HQ (${PROFILE.portfolio}) portfolio 3D; SELA Coffee (https://selakopi.vercel.app) website kedai kopi di Sleman
- Stack: Next.js, React, Tailwind CSS, Three.js / React Three Fiber, JavaScript, dasar Arduino/ESP32 & IoT
- Email: ${PROFILE.email} | WhatsApp: ${PROFILE.phone} (${PROFILE.whatsapp}) | LinkedIn: ${PROFILE.linkedin} | Instagram: ${PROFILE.instagram}

Format: plain text, boleh pakai dash "-" untuk bullet. Jangan pakai markdown heading atau tabel.`;

function sanitizeMessages(input) {
  if (!Array.isArray(input)) return [];
  const cleaned = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const role = item.role === "assistant" ? "assistant" : item.role === "user" ? "user" : null;
    const content = typeof item.content === "string" ? item.content.trim() : "";
    if (!role || !content) continue;
    cleaned.push({ role, content: content.slice(0, MAX_CHARS) });
  }
  return cleaned.slice(-MAX_MESSAGES);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function localFallback(text, note) {
  // Sengaja nggak pernah balikin detail error/API key ke client.
  if (note) console.warn("[cekael-ai]", note);
  return json({ reply: getLocalReply(text), source: "local" });
}

function systemPrompt(lang) {
  if (lang === "en") {
    return `${SYSTEM_PROMPT}\n\nLANGUAGE OVERRIDE: The visitor switched the site to English. Reply in casual, friendly English (2-6 lines). Keep the same facts; do not invent anything.`;
  }
  return SYSTEM_PROMPT;
}

async function callGemini(messages, apiKey, model, prompt) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: prompt }] },
          contents,
          generationConfig: { temperature: 0.8, maxOutputTokens: 512, topP: 0.95 },
        }),
        signal: controller.signal,
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts)
      ? parts.map((p) => (typeof p?.text === "string" ? p.text : "")).join("").trim()
      : "";
    return text || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function callOpenAI(messages, apiKey, model, prompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: prompt }, ...messages],
        temperature: 0.8,
        max_tokens: 512,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ reply: getLocalReply(""), source: "local" }, 200);
  }

  const messages = sanitizeMessages(payload?.messages);
  const lang = payload?.lang === "en" ? "en" : "id";
  const prompt = systemPrompt(lang);
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastUserText = lastUser?.content ?? "";

  if (!lastUserText) {
    return json({ reply: getLocalReply(""), source: "local" }, 200);
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    const reply = await callGemini(messages, geminiKey, process.env.GEMINI_MODEL || "gemini-2.0-flash", prompt);
    if (reply) return json({ reply, source: "gemini" });
    return localFallback(lastUserText, "gemini gagal, pakai brain lokal");
  }

  if (openaiKey) {
    const reply = await callOpenAI(messages, openaiKey, process.env.OPENAI_MODEL || "gpt-4o-mini", prompt);
    if (reply) return json({ reply, source: "openai" });
    return localFallback(lastUserText, "openai gagal, pakai brain lokal");
  }

  return localFallback(lastUserText, "nggak ada API key, pakai brain lokal");
}
