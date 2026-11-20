"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Anchor, Bell, Compass, Crown, Flame, Leaf, Moon, Zap } from "lucide-react";
import GameHud from "@/components/games/GameHud";
import { useBestScore, formatScore } from "@/lib/scores";

const PAIRS = 8;
const MISS_DELAY = 700; // ms kartu salah tetap terbuka sebelum dibalik lagi

// 8 glyph, warnanya hanya dari palet yang sudah ada.
const SYMBOLS = [
  { label: "anchor", Icon: Anchor, color: "text-ink" },
  { label: "bell", Icon: Bell, color: "text-accent-2" },
  { label: "compass", Icon: Compass, color: "text-ok" },
  { label: "crown", Icon: Crown, color: "text-danger" },
  { label: "flame", Icon: Flame, color: "text-muted" },
  { label: "leaf", Icon: Leaf, color: "text-accent" },
  { label: "moon", Icon: Moon, color: "text-ink" },
  { label: "zap", Icon: Zap, color: "text-accent-2" },
];

function shuffle(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildDeck() {
  const cards = [];
  SYMBOLS.forEach((_, pairId) => {
    cards.push({ key: `p${pairId}a`, pairId }, { key: `p${pairId}b`, pairId });
  });
  return shuffle(cards);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTime(seconds) {
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
}

/** Skor = 100 − moves, minimum 0. Board sempurna (8 moves) = 92 poin. */
function pointsFor(moves) {
  return Math.max(0, 100 - moves);
}

export default function MemoryMatch() {
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]); // index kartu yang sedang terbuka
  const [matched, setMatched] = useState([]); // pairId yang sudah cocok
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("playing"); // playing | won
  const [locked, setLocked] = useState(false);
  const [best, submitBest] = useBestScore("memory");

  const lockRef = useRef(false);
  const timeoutRef = useRef(null);
  const submittedRef = useRef(false);

  const clearPendingFlip = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startRun = useCallback(() => {
    clearPendingFlip();
    lockRef.current = false;
    submittedRef.current = false;
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
    setPhase("playing");
    setLocked(false);
  }, [clearPendingFlip]);

  // Timer mulai saat kartu pertama dibalik dan berhenti saat board selesai.
  useEffect(() => {
    if (phase !== "playing" || !started) return undefined;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase, started]);

  // Tidak ada timeout flip-back yang bocor saat komponen dilepas.
  useEffect(() => clearPendingFlip, [clearPendingFlip]);

  // Rekor dikirim sekali per ronde yang selesai.
  useEffect(() => {
    if (phase !== "won" || submittedRef.current) return;
    submittedRef.current = true;
    submitBest(pointsFor(moves));
  }, [phase, moves, submitBest]);

  const flip = (index) => {
    if (phase !== "playing" || lockRef.current) return;
    if (flipped.includes(index) || matched.includes(deck[index].pairId)) return;

    if (!started) setStarted(true);

    const next = [...flipped, index];
    setFlipped(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = next;

    if (deck[a].pairId === deck[b].pairId) {
      const nextMatched = [...matched, deck[a].pairId];
      setMatched(nextMatched);
      setFlipped([]);
      if (nextMatched.length === PAIRS) setPhase("won");
      return;
    }

    lockRef.current = true;
    setLocked(true);
    clearPendingFlip();
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      lockRef.current = false;
      setLocked(false);
      setFlipped([]);
    }, MISS_DELAY);
  };

  const won = phase === "won";

  return (
    <div className="mx-auto w-full max-w-[380px] select-none">
      <GameHud
        title="Memory Match"
        score={`${formatScore(matched.length)}/${PAIRS}`}
        best={formatScore(best)}
        extra={formatTime(seconds)}
        onRestart={startRun}
        restartLabel="New board"
      />

      <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.12em]">
        <span className="text-muted">
          moves <span className="text-ink">{pad(moves)}</span>
        </span>
        <span className={won ? "text-ok" : "text-muted"}>
          {won ? "board cleared" : "click to flip"}
        </span>
      </div>

      <div className="playfield grid grid-cols-4 gap-2 p-2">
        {deck.map((card, index) => {
          const symbol = SYMBOLS[card.pairId];
          const Icon = symbol.Icon;
          const isMatched = matched.includes(card.pairId);
          const isOpen = isMatched || flipped.includes(index);
          const blocked = isOpen || won || locked;

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => flip(index)}
              disabled={blocked}
              aria-label={isOpen ? `${symbol.label} card` : "face-down card"}
              aria-pressed={isOpen}
              className={`relative aspect-[3/4] rounded-[8px] border transition-colors duration-150 focus-visible:border-accent-2 focus-visible:outline-none ${
                isMatched
                  ? "border-ok bg-surface-2"
                  : isOpen
                    ? "border-accent-2 bg-surface-2"
                    : "border-line bg-surface hover:border-accent"
              } ${blocked ? "cursor-default" : "cursor-pointer"}`}
            >
              <span
                className="absolute inset-0 grid place-items-center transition-transform duration-300"
                style={{
                  transform: `perspective(640px) rotateY(${isOpen ? 0 : 180}deg)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <Icon
                  className={`h-6 w-6 sm:h-7 sm:w-7 ${symbol.color}`}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </span>
              <span
                className="absolute inset-0 grid place-items-center transition-transform duration-300"
                style={{
                  transform: `perspective(640px) rotateY(${isOpen ? -180 : 0}deg)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <span
                  className={`block h-2 w-2 rounded-full border ${
                    isMatched ? "border-ok bg-ok" : "border-line-soft bg-line-soft"
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>
          );
        })}
      </div>

      {won ? (
        <div className="mt-3 border border-ok bg-surface p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="mono-label text-ok">board cleared</span>
            <span className="mono-label">record {formatScore(best)} pts</span>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div className="border border-line bg-surface-2 p-2">
              <div className="mono-label">moves</div>
              <div className="font-mono text-sm text-ink">{pad(moves)}</div>
            </div>
            <div className="border border-line bg-surface-2 p-2">
              <div className="mono-label">time</div>
              <div className="font-mono text-sm text-ink">{formatTime(seconds)}</div>
            </div>
            <div className="border border-line bg-surface-2 p-2">
              <div className="mono-label">points</div>
              <div className="font-mono text-sm text-accent-2">{formatScore(pointsFor(moves))}</div>
            </div>
          </div>

          <button type="button" onClick={startRun} className="btn btn-primary mt-3 w-full">
            Play again
          </button>
        </div>
      ) : (
        <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
          {locked ? "no pair — flipping back" : "click to flip · find all 8 pairs"}
        </p>
      )}
    </div>
  );
}
