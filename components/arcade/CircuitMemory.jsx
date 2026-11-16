"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ClockIcon, RotateIcon, TrophyIcon, COMPONENT_GLYPHS } from "@/components/Icons";
import { useLang } from "@/components/providers";
import { useLocalStorage } from "@/lib/hooks";
import { sfx } from "@/lib/sfx";

const COMPONENTS = [
  { key: "resistor", label: "Resistor" },
  { key: "capacitor", label: "Capacitor" },
  { key: "diode", label: "Diode" },
  { key: "led", label: "LED" },
  { key: "chip", label: "MCU" },
  { key: "transistor", label: "Transistor" },
];

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck() {
  const pairs = COMPONENTS.flatMap((component) => [
    { ...component, uid: `${component.key}-a` },
    { ...component, uid: `${component.key}-b` },
  ]);
  return shuffle(pairs);
}

export default function CircuitMemory() {
  const { t } = useLang();
  const [deck, setDeck] = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useLocalStorage("ck_memory_best", null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  // running clock
  useEffect(() => {
    if (!startedAt || finished) return undefined;
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => clearInterval(id);
  }, [startedAt, finished]);

  const reset = useCallback(() => {
    clearTimers();
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
    setStartedAt(null);
    setElapsed(0);
    setFinished(false);
    sfx.play("click");
  }, []);

  const flip = (index) => {
    if (busy || finished) return;
    const card = deck[index];
    if (!card || flipped.includes(index) || matched.includes(card.uid)) return;

    if (!startedAt) setStartedAt(Date.now());
    sfx.play("flip");

    const next = [...flipped, index];
    setFlipped(next);
    if (next.length < 2) return;

    setBusy(true);
    setMoves((value) => value + 1);
    const [a, b] = next;
    const isPair = deck[a].key === deck[b].key;

    if (isPair) {
      timers.current.push(
        setTimeout(() => {
          setMatched((list) => [...list, deck[a].uid, deck[b].uid]);
          setFlipped([]);
          setBusy(false);
          sfx.play("match");
        }, 420)
      );
    } else {
      timers.current.push(
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
          sfx.play("error");
        }, 780)
      );
    }
  };

  // completion
  useEffect(() => {
    if (matched.length !== deck.length || finished || deck.length === 0) return;
    setFinished(true);
    const totalMoves = moves;
    const totalTime = startedAt ? Date.now() - startedAt : 0;
    sfx.play("win");
    setBest((current) => {
      if (!current) return { moves: totalMoves, time: totalTime };
      const better =
        totalMoves < current.moves || (totalMoves === current.moves && totalTime < current.time);
      return better ? { moves: totalMoves, time: totalTime } : current;
    });
  }, [matched, deck.length, finished, moves, startedAt, setBest]);

  const seconds = (ms) => (ms / 1000).toFixed(1);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400">{t("arcade.memoryHint")}</p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 px-2.5 py-1.5 text-[11px] text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
        >
          <RotateIcon width={13} height={13} />
          {t("arcade.replay")}
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center sm:max-w-sm">
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-2 py-1.5">
          <p className="text-[9px] tracking-[0.18em] text-slate-500 uppercase">{t("arcade.moves")}</p>
          <p className="font-mono text-sm text-cyan-300">{moves}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-2 py-1.5">
          <p className="flex items-center justify-center gap-1 text-[9px] tracking-[0.18em] text-slate-500 uppercase">
            <ClockIcon width={9} height={9} /> {t("arcade.time")}
          </p>
          <p className="font-mono text-sm text-slate-200">{seconds(elapsed)}s</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-2 py-1.5">
          <p className="flex items-center justify-center gap-1 text-[9px] tracking-[0.18em] text-slate-500 uppercase">
            <TrophyIcon width={9} height={9} /> {t("arcade.best")}
          </p>
          <p className="font-mono text-sm text-amber-300">{best ? `${best.moves}/${seconds(best.time)}s` : "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {deck.map((card, index) => {
          const isMatched = matched.includes(card.uid);
          const isOpen = flipped.includes(index) || isMatched;
          const Glyph = COMPONENT_GLYPHS[card.key];

          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => flip(index)}
              disabled={isMatched || busy || finished}
              aria-label={isOpen ? card.label : "hidden component card"}
              className={`group relative aspect-[4/3.4] [perspective:800px] ${isMatched ? "cursor-default" : "cursor-pointer"}`}
            >
              <div
                className={`relative h-full w-full transition-transform duration-300 [transform-style:preserve-3d] ${
                  isOpen ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* back */}
                <div className="absolute inset-0 grid place-items-center rounded-xl border border-slate-700/70 bg-slate-900/60 [backface-visibility:hidden] transition group-hover:border-cyan-400/40 group-hover:bg-slate-800/60">
                  <svg viewBox="0 0 60 60" className="h-8 w-8 text-slate-600" aria-hidden="true">
                    <path d="M12 30h8l4-9 8 18 6-12 4 6h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* front */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl border [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    isMatched
                      ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-300"
                      : "border-cyan-400/40 bg-slate-900/80 text-cyan-200"
                  }`}
                >
                  <Glyph width={26} height={26} />
                  <span className="text-[9px] font-medium tracking-wide text-slate-400 uppercase">{card.label}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-emerald-300">{t("arcade.memoryWin")}</p>
            <p className="text-xs text-slate-400">
              {moves} {t("arcade.moves").toLowerCase()} · {seconds(elapsed)}s
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
          >
            {t("arcade.replay")}
          </button>
        </motion.div>
      )}
    </div>
  );
}
