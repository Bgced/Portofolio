"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers";
import { useLocalStorage } from "@/lib/hooks";
import { sfx } from "@/lib/sfx";

export default function ReactionTest() {
  const { t } = useLang();
  const [phase, setPhase] = useState("idle"); // idle | wait | go | early | result
  const [reflex, setReflex] = useState(null);
  const [best, setBest] = useLocalStorage("ck_reaction_best", null);
  const timeout = useRef(null);
  const goAt = useRef(0);

  const clear = () => clearTimeout(timeout.current);
  useEffect(() => () => clear(), []);

  const arm = useCallback(() => {
    clear();
    setPhase("wait");
    setReflex(null);
    sfx.play("click");
    const delay = 1200 + Math.random() * 2600;
    timeout.current = setTimeout(() => {
      goAt.current = performance.now();
      setPhase("go");
      sfx.play("place");
    }, delay);
  }, []);

  const handlePanel = () => {
    if (phase === "idle" || phase === "result" || phase === "early") {
      arm();
      return;
    }
    if (phase === "wait") {
      clear();
      setPhase("early");
      sfx.play("error");
      return;
    }
    if (phase === "go") {
      const ms = Math.round(performance.now() - goAt.current);
      setReflex(ms);
      setPhase("result");
      setBest((current) => (current === null || ms < current ? ms : current));
      sfx.play(ms < 260 ? "win" : "click");
    }
  };

  const panelStyles = {
    idle: "border-line bg-surface-2/60 text-muted",
    wait: "border-amber-400/40 bg-amber-400/5 text-amber-300",
    go: "border-emerald-400/70 bg-ok/20 text-emerald-200 shadow-[0_0_60px_-10px_rgba(52,211,153,0.8)]",
    early: "border-rose-500/60 bg-rose-500/10 text-rose-300",
    result: "border-accent/40 bg-accent/5 text-accent",
  }[phase];

  return (
    <div>
      <p className="mb-4 text-xs text-muted">{t("arcade.reactionHint")}</p>

      <button
        type="button"
        onClick={handlePanel}
        className={`relative flex min-h-[190px] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border px-4 py-8 text-center transition-colors duration-150 ${panelStyles}`}
        aria-live="polite"
      >
        {phase === "go" && (
          <span className="absolute inset-0 -z-10 animate-pulse bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.25),transparent_70%)]" />
        )}

        <motion.span
          key={phase}
          className="flex flex-col items-center gap-2"
        >
            {phase === "idle" && (
              <>
                <span className="text-3xl">🔌</span>
                <span className="text-sm font-semibold tracking-wide">{t("arcade.play")}</span>
              </>
            )}
            {phase === "wait" && (
              <>
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
                <span className="text-sm">{t("arcade.reactionWait")}</span>
              </>
            )}
            {phase === "go" && (
              <>
                <span className="text-4xl">⚡</span>
                <span className="text-2xl font-black tracking-[0.2em]">{t("arcade.reactionGo")}</span>
              </>
            )}
            {phase === "early" && (
              <>
                <span className="text-3xl">🚫</span>
                <span className="text-sm font-semibold">{t("arcade.reactionTooSoon")}</span>
                <span className="text-[11px] text-muted">{t("arcade.reactionAgain")}</span>
              </>
            )}
            {phase === "result" && (
              <>
                <span className="text-[10px] tracking-[0.25em] text-muted uppercase">{t("arcade.reactionResult")}</span>
                <span className="font-mono text-4xl font-bold text-accent">{reflex}ms</span>
                {reflex !== null && reflex < 220 && (
                  <span className="rounded-full border border-ok/40 bg-ok/10 px-2 py-0.5 text-[10px] text-emerald-300">
                    ⚡ inhuman
                  </span>
                )}
                <span className="text-[11px] text-muted">{t("arcade.reactionAgain")}</span>
              </>
            )}
        </motion.span>
      </button>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
        <span>
          {t("arcade.best")}: <span className="font-mono text-amber-300">{best ? `${best}ms` : "—"}</span>
        </span>
        <span className="font-mono">60 Hz · ~16.7ms/frame</span>
      </div>
    </div>
  );
}
