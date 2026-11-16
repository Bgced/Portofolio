"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useArcade, useLang } from "@/components/providers";
import {
  BoltIcon,
  CloseIcon,
  GamepadIcon,
  GridIcon,
  SparkIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from "@/components/Icons";
import TechTicTacToe from "@/components/arcade/TechTicTacToe";
import CircuitMemory from "@/components/arcade/CircuitMemory";
import ReactionTest from "@/components/arcade/ReactionTest";
import { useMute } from "@/components/arcade/useMute";
import { sfx } from "@/lib/sfx";

const TABS = [
  { id: "ttt", label: "arcade.tabTtt", icon: BoltIcon },
  { id: "memory", label: "arcade.tabMemory", icon: GridIcon },
  { id: "reaction", label: "arcade.tabReaction", icon: SparkIcon },
];

export default function PortfolioArcade() {
  const { open, closeArcade } = useArcade();
  const { t } = useLang();
  const { muted, toggle } = useMute();
  const [tab, setTab] = useState("ttt");
  const closeRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousFocus.current = document.activeElement;
    sfx.play("arcadeOpen");
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 60);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        sfx.play("arcadeClose");
        closeArcade();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (previousFocus.current instanceof HTMLElement) previousFocus.current.focus();
    };
  }, [open, closeArcade]);

  // Left/right arrows move between tabs when a tab has focus.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      if (document.activeElement?.getAttribute("role") !== "tab") return;
      event.preventDefault();
      const index = TABS.findIndex((item) => item.id === tab);
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = TABS[(index + delta + TABS.length) % TABS.length];
      setTab(next.id);
      document.getElementById(`arcade-tab-${next.id}`)?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, tab]);

  // No exit animation: unmounting immediately keeps close deterministic
  // (and never leaves an invisible overlay blocking the page).
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <motion.div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <button
          type="button"
          aria-label={t("arcade.close")}
          onClick={() => {
            sfx.play("arcadeClose");
            closeArcade();
          }}
          className="h-full w-full cursor-default"
          tabIndex={-1}
        />
      </motion.div>

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="arcade-title"
        initial={{ opacity: 0, y: 26, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-slate-700/80 bg-slate-950 shadow-[0_30px_120px_-30px_rgba(0,210,255,0.45)] sm:max-h-[88vh] sm:rounded-2xl"
      >
            {/* header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950 px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                  <GamepadIcon width={18} height={18} />
                </span>
                <div>
                  <h2 id="arcade-title" className="text-sm font-semibold tracking-wide text-slate-100 sm:text-base">
                    {t("arcade.title")}
                  </h2>
                  <p className="hidden text-[11px] text-slate-500 sm:block">{t("arcade.subtitle")}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggle}
                  aria-pressed={muted}
                  aria-label={muted ? t("arcade.unmute") : t("arcade.mute")}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-700/80 text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
                >
                  {muted ? <VolumeOffIcon width={15} height={15} /> : <VolumeOnIcon width={15} height={15} />}
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => {
                    sfx.play("arcadeClose");
                    closeArcade();
                  }}
                  aria-label={t("arcade.close")}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-700/80 text-slate-400 transition hover:border-rose-400/50 hover:text-rose-300"
                >
                  <CloseIcon width={15} height={15} />
                </button>
              </div>
            </div>

            {/* tabs */}
            <div role="tablist" aria-label={t("arcade.title")} className="flex gap-1 border-b border-slate-800 px-3 pt-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  id={`arcade-tab-${id}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === id}
                  aria-controls={`arcade-panel-${id}`}
                  tabIndex={tab === id ? 0 : -1}
                  onClick={() => {
                    setTab(id);
                    sfx.play("click");
                  }}
                  className={`relative flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-[11px] font-medium transition sm:text-xs ${
                    tab === id ? "text-cyan-300" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Icon width={14} height={14} />
                  {t(label)}
                  {tab === id && (
                    <motion.span
                      layoutId="arcade-tab-underline"
                      className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-cyan-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* content */}
            <div className="overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
              {TABS.map(({ id }) => (
                <div
                  key={id}
                  id={`arcade-panel-${id}`}
                  role="tabpanel"
                  aria-labelledby={`arcade-tab-${id}`}
                  hidden={tab !== id}
                >
                  {tab === id && (
                    <>
                      {id === "ttt" && <TechTicTacToe />}
                      {id === "memory" && <CircuitMemory />}
                      {id === "reaction" && <ReactionTest />}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 px-4 py-2 text-center font-mono text-[9px] tracking-[0.18em] text-slate-600 uppercase">
              esc · close — sfx via webaudio
            </div>
      </motion.div>
    </div>
  );
}

/** In-page #arcade section that also acts as the entry point for the modal. */
export function ArcadeSection() {
  const { t } = useLang();
  const { openArcade } = useArcade();

  return (
    <section id="arcade" className="section-shell scroll-mt-24">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-cyan-400/80 uppercase">
            <span className="h-px w-6 bg-cyan-400/60" /> 07 / play
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">{t("arcade.title")}</h2>
        </div>
        <p className="max-w-sm text-sm text-slate-400">{t("arcade.subtitle")}</p>
      </div>

      <div className="panel relative overflow-hidden p-5 sm:p-8">
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-40" aria-hidden="true" />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: BoltIcon, title: t("arcade.tabTtt"), desc: "Minimax AI · 3×3" },
              { icon: GridIcon, title: t("arcade.tabMemory"), desc: "6 pairs · electronics" },
              { icon: SparkIcon, title: t("arcade.tabReaction"), desc: "reflex · ms" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 transition hover:border-cyan-400/30"
              >
                <Icon width={18} height={18} className="text-cyan-400/80" />
                <p className="mt-2 text-xs font-semibold text-slate-200">{title}</p>
                <p className="text-[10px] text-slate-500">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={() => {
                sfx.play("arcadeOpen");
                openArcade();
              }}
              className="group inline-flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-400/10 px-4 py-2.5 text-xs font-semibold tracking-wide text-cyan-200 transition hover:bg-cyan-400/20 hover:shadow-[0_0_30px_-8px_rgba(0,210,255,0.7)]"
            >
              <GamepadIcon width={16} height={16} />
              {t("arcade.open")}
            </button>
            <span className="text-[10px] text-slate-500">{t("arcade.openHint")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
