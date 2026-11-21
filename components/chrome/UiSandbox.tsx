"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ACCENTS, RADII, SCENE_MOODS, applyPrefs, loadPrefs, savePrefs } from "@/lib/ui-prefs";
import { useLang } from "@/components/providers";

function Choice({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`flex min-w-0 items-center gap-1.5 rounded-[var(--radius-sm)] border px-2 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.1em] transition-colors ${
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-surface-2/60 text-muted hover:border-accent/50 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function UiSandbox() {
  const { lang } = useLang();
  const en = lang === "en";

  const [prefs, setPrefs] = useState(() => ({ accent: "amber", radius: "soft", scene: "wire" }));
  const [open, setOpen] = useState(false);

  // Baca localStorage SETELAH mount — nggak boleh di initial state (hydration).
  useEffect(() => {
    const stored = loadPrefs();
    setPrefs(stored);
    applyPrefs(stored);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("cekael:sandbox", onOpen);
    return () => window.removeEventListener("cekael:sandbox", onOpen);
  }, []);

  const update = useCallback((patch: Partial<typeof prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      applyPrefs(next);
      savePrefs(next);
      return next;
    });
  }, []);

  const accentLabel = useMemo(
    () => (id: string) => {
      const found = ACCENTS.find((item) => item.id === id);
      return found ? (en ? found.enLabel : found.idLabel) : id;
    },
    [en]
  );

  return (
    <div className="fixed bottom-20 right-4 z-40 print:hidden sm:bottom-6 sm:right-6">
      {open ? (
        <div className="panel w-[min(19rem,calc(100vw-2rem))] p-3 border-line bg-surface">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="mono-label text-accent">{en ? "ui sandbox" : "sandbox ui"}</p>
              <p className="mt-0.5 text-[0.72rem] leading-snug text-muted">
                {en ? "Try the look live. Saved locally." : "Coba tampilannya langsung. Tersimpan lokal."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={en ? "Close sandbox" : "Tutup sandbox"}
              className="rounded-[var(--radius-sm)] border border-line px-1.5 py-0.5 font-mono text-[0.58rem] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            <div>
              <p className="mono-label mb-1.5 text-[0.52rem]">{en ? "accent" : "aksen"}</p>
              <div className="flex flex-wrap gap-1.5">
                {ACCENTS.map((item) => (
                  <Choice
                    key={item.id}
                    label={accentLabel(item.id)}
                    active={prefs.accent === item.id}
                    onClick={() => update({ accent: item.id })}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-black/10"
                      style={{ backgroundColor: item.dark }}
                      aria-hidden="true"
                    />
                    {accentLabel(item.id)}
                  </Choice>
                ))}
              </div>
            </div>

            <div>
              <p className="mono-label mb-1.5 text-[0.52rem]">{en ? "corner radius" : "radius sudut"}</p>
              <div className="flex flex-wrap gap-1.5">
                {RADII.map((item) => (
                  <Choice
                    key={item.id}
                    label={en ? item.enLabel : item.idLabel}
                    active={prefs.radius === item.id}
                    onClick={() => update({ radius: item.id })}
                  >
                    <span
                      className="h-2.5 w-2.5 border border-current"
                      style={{ borderRadius: item.value === "4px" ? "1px" : item.value === "14px" ? "3px" : "999px" }}
                      aria-hidden="true"
                    />
                    {en ? item.enLabel : item.idLabel}
                  </Choice>
                ))}
              </div>
            </div>

            <div>
              <p className="mono-label mb-1.5 text-[0.52rem]">{en ? "background 3d" : "latar 3d"}</p>
              <div className="flex flex-wrap gap-1.5">
                {SCENE_MOODS.map((item) => (
                  <Choice
                    key={item.id}
                    label={en ? item.enLabel : item.idLabel}
                    active={prefs.scene === item.id}
                    onClick={() => update({ scene: item.id })}
                  >
                    {en ? item.enLabel : item.idLabel}
                  </Choice>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={en ? "Open UI sandbox" : "Buka sandbox UI"}
          title={en ? "UI sandbox — try accent, radius, 3D" : "Sandbox UI — coba aksen, radius, 3D"}
          className="flex items-center gap-2 border border-line bg-surface px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted  transition-colors hover:border-accent hover:text-accent"
        >
          
          {en ? "ui sandbox" : "sandbox ui"}
        </button>
      )}
    </div>
  );
}
