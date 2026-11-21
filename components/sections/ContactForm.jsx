"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { useLang } from "@/components/providers";
import { useToast } from "@/components/ui/ToastProvider";

const TOPICS = [
  { id: "kolaborasi", idLabel: "Kolaborasi / Freelance", enLabel: "Collaboration / Freelance" },
  { id: "kerja", idLabel: "Magang / Kerja", enLabel: "Internship / Full-time" },
  { id: "elektro", idLabel: "Nanya soal Elektro", enLabel: "Circuits / EE question" },
  { id: "santai", idLabel: "Cuma mampir", enLabel: "Just passing by" },
];

const inputClass =
  "w-full rounded-[12px] border border-line-soft bg-canvas px-3 py-2.5 text-[0.88rem] text-ink outline-none transition-colors placeholder:text-muted/85 focus:border-accent/70";

export default function ContactForm() {
  const { lang } = useLang();
  const { toast } = useToast();
  const en = lang === "en";

  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0].id, message: "" });
  const [status, setStatus] = useState("idle");
  const [note, setNote] = useState("");

  const topicLabel = (id) => {
    const topic = TOPICS.find((item) => item.id === id);
    if (!topic) return id;
    return en ? topic.enLabel : topic.idLabel;
  };

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === "loading") return;

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    const configured = accessKey && accessKey !== "YOUR_WEB3FORMS_ACCESS_KEY";

    if (!configured) {
      const subject = `[Portfolio] ${topicLabel(form.topic)} — ${form.name}`;
      const body = `${form.message}\n\n— ${form.name} (${form.email})`;
      window.location.href = `mailto:cekaell3@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("fallback");
      setNote(
        en
          ? "Web3Forms key isn't set yet — your email app just opened with the message ready."
          : "Access key Web3Forms belum dipasang. Email lo udah kebuka dengan pesan siap kirim."
      );
      toast({
        title: en ? "Email app opened" : "Aplikasi email kebuka",
        description: en
          ? "The Web3Forms key isn't set yet, so the message was prepared in your mail app."
          : "Access key Web3Forms belum diisi, jadi pesannya disiapin di aplikasi email lo.",
        variant: "info",
      });
      return;
    }

    setStatus("loading");
    setNote("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[Portfolio] ${topicLabel(form.topic)} — ${form.name}`,
          from_name: "cekael.vercel.app",
          name: form.name,
          email: form.email,
          topic: topicLabel(form.topic),
          message: form.message,
          botcheck: "",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Gagal kirim");
      setStatus("success");
      setNote(en ? "Message sent. I'll reply soon!" : "Pesan terkirim. Nanti gue bales ya!");
      setForm({ name: "", email: "", topic: TOPICS[0].id, message: "" });
      toast({
        title: en ? "Message sent!" : "Pesan terkirim!",
        description: en ? "I'll reply as soon as I can." : "Nanti gue bales secepatnya ya.",
        variant: "success",
      });
    } catch {
      setStatus("error");
      setNote(
        en
          ? "Couldn't send it. Try email or WhatsApp on the left — both are live."
          : "Gagal kirim. Coba email atau WhatsApp di sebelah kiri — dua-duanya aktif."
      );
      toast({
        title: en ? "Message failed to send" : "Pesan gagal terkirim",
        description: en ? "Use email or WhatsApp from the contact panel." : "Pakai email atau WhatsApp di panel kontak.",
        variant: "error",
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="mono-label text-accent">// brief form</p>
        <span className="mono-label text-[0.52rem]">web3forms ready</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mono-label mb-1.5 block">{en ? "Name" : "Nama"}</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={update("name")}
            placeholder={en ? "Siapa nih?" : "Siapa nih?"}
            required
            maxLength={80}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mono-label mb-1.5 block">Email</span>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder={en ? "you@email.com" : "email.lo@domain.com"}
            required
            maxLength={120}
            autoComplete="email"
          />
        </label>
      </div>

      <label className="block">
        <span className="mono-label mb-1.5 block">{en ? "Topic" : "Topik"}</span>
        <select className={inputClass} value={form.topic} onChange={update("topic")}>
          {TOPICS.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {en ? topic.enLabel : topic.idLabel}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mono-label mb-1.5 flex items-baseline justify-between gap-2">
          <span>{en ? "Message" : "Pesan"}</span>
          <span className="normal-case tracking-normal text-muted/70">{form.message.length}/600</span>
        </span>
        <textarea
          className={`${inputClass} min-h-[118px] resize-y leading-relaxed`}
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value.slice(0, 600) }))}
          placeholder={en ? "Mau bikin apa, target kapan, budget range..." : "Mau bikin apa, target kapan, budget range..."}
          required
          maxLength={600}
        />
      </label>

      <button type="submit" disabled={status === "loading"} className="btn btn-primary mt-1 w-full disabled:opacity-60">
        {status === "loading" ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : status === "success" ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Send size={14} aria-hidden="true" />
        )}
        {status === "loading"
          ? en ? "Sending…" : "Ngirim…"
          : status === "success"
            ? en ? "Sent!" : "Terkirim!"
            : en ? "Send message" : "Kirim Pesan"}
      </button>

      {note ? (
        <p
          role="status"
          className={`rounded-[6px] border px-3 py-2 text-[0.72rem] leading-relaxed ${
            status === "success"
              ? "border-ok/40 bg-ok/10 text-ok"
              : status === "fallback"
                ? "border-line bg-surface-2 text-muted"
                : "border-danger/40 bg-danger/10 text-danger"
          }`}
        >
          {note}
        </p>
      ) : null}

      <p className="font-mono text-[0.56rem] leading-relaxed text-muted/70">
        {en
          ? "No spam, no database. Goes straight to my inbox."
          : "Tanpa spam dan tanpa database. Pesan langsung masuk ke inbox gue."}
      </p>
    </form>
  );
}
