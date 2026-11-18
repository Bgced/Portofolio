"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BoltIcon, GroundIcon, RotateIcon, TrophyIcon } from "@/components/Icons";
import { useLang } from "@/components/providers";
import { useLocalStorage } from "@/lib/hooks";
import { sfx } from "@/lib/sfx";

const PLAYER = "volt";
const AI = "gnd";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function evaluate(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(Boolean)) return { winner: "draw", line: null };
  return { winner: null, line: null };
}

/** Perfect play — returns { score, move } from the AI's point of view. */
function minimax(board, depth, isMaximising) {
  const { winner } = evaluate(board);
  if (winner === AI) return { score: 10 - depth };
  if (winner === PLAYER) return { score: depth - 10 };
  if (winner === "draw") return { score: 0 };

  let best = { score: isMaximising ? -Infinity : Infinity, move: null };

  for (let i = 0; i < 9; i += 1) {
    if (board[i]) continue;
    board[i] = isMaximising ? AI : PLAYER;
    const { score } = minimax(board, depth + 1, !isMaximising);
    board[i] = null;
    if (isMaximising ? score > best.score : score < best.score) {
      best = { score, move: i };
    }
  }
  return best;
}

function chooseAiMove(board, difficulty) {
  const empty = board.map((cell, i) => (cell ? null : i)).filter((i) => i !== null);
  if (!empty.length) return null;

  // Easy: mostly random, occasionally the sensible move.
  if (difficulty === "easy" && Math.random() > 0.32) {
    return empty[Math.floor(Math.random() * empty.length)];
  }
  // Hard: near-perfect Minimax with a small slip, so a win (and the
  // easter egg) stays mathematically reachable.
  if (difficulty === "hard" && Math.random() < 0.08) {
    return empty[Math.floor(Math.random() * empty.length)];
  }
  return minimax([...board], 0, true).move;
}

export default function TechTicTacToe() {
  const { t } = useLang();
  const [mode, setMode] = useState("easy");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("player");
  const [result, setResult] = useState({ winner: null, line: null });
  const [egg, setEgg] = useState(false);
  const [score, setScore] = useLocalStorage("ck_ttt_score", { wins: 0, draws: 0, losses: 0 });
  const aiTimer = useRef(null);

  const playing = !result.winner;

  const reset = (nextMode = mode) => {
    clearTimeout(aiTimer.current);
    setBoard(Array(9).fill(null));
    setTurn("player");
    setResult({ winner: null, line: null });
    setEgg(false);
    setMode(nextMode);
    sfx.play("click");
  };

  useEffect(() => () => clearTimeout(aiTimer.current), []);

  const finish = (nextBoard, mover) => {
    const outcome = evaluate(nextBoard);
    if (outcome.winner === "draw") {
      setResult(outcome);
      setTurn("idle");
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
      sfx.play("click");
      return;
    }
    if (outcome.winner) {
      setResult(outcome);
      setTurn("idle");
      if (outcome.winner === PLAYER) {
        setScore((s) => ({ ...s, wins: s.wins + 1 }));
        sfx.play("win");
        if (mode === "hard") setEgg(true);
      } else {
        setScore((s) => ({ ...s, losses: s.losses + 1 }));
        sfx.play("lose");
      }
      return;
    }
    setTurn(mover === PLAYER ? "ai" : "player");
  };

  const handleCell = (index) => {
    if (!playing || turn !== "player" || board[index]) return;
    const next = [...board];
    next[index] = PLAYER;
    setBoard(next);
    sfx.play("place");
    finish(next, PLAYER);
  };

  // AI turn — isolated in an effect so the click handler stays pure.
  useEffect(() => {
    if (turn !== "ai" || !playing) return undefined;
    aiTimer.current = setTimeout(() => {
      const move = chooseAiMove(board, mode);
      if (move === null || move === undefined) return;
      const next = [...board];
      next[move] = AI;
      sfx.play("place");
      setBoard(next);
      finish(next, AI);
    }, 460);
    return () => clearTimeout(aiTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, playing, mode, board]);

  const status = useMemo(() => {
    if (result.winner === PLAYER) return t("arcade.youWin");
    if (result.winner === AI) return t("arcade.aiWin");
    if (result.winner === "draw") return t("arcade.draw");
    return turn === "ai" ? t("arcade.aiTurn") : t("arcade.yourTurn");
  }, [result, turn, t]);

  const Symbol = ({ value }) => {
    if (value === PLAYER) return <BoltIcon width={30} height={30} className="text-accent" />;
    if (value === AI) return <GroundIcon width={30} height={30} className="text-amber-300" />;
    return null;
  };

  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_180px]">
      <div>
        {/* difficulty */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-line bg-surface-2/70 p-0.5">
            {["easy", "hard"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => reset(level)}
                aria-pressed={mode === level}
                className={`rounded-md px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition ${
                  mode === level
                    ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_rgba(34,211,238,0.35)]"
                    : "text-muted hover:text-ink"
                }`}
              >
                {t(`arcade.${level}`)}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted transition hover:border-slate-500 hover:text-ink"
          >
            <RotateIcon width={13} height={13} />
            {t("arcade.replay")}
          </button>
        </div>

        {/* board */}
        <div className="relative mx-auto grid max-w-[320px] grid-cols-3 gap-2" role="grid" aria-label={t("arcade.tabTtt")}>
          {board.map((cell, index) => {
            const isWinning = result.line?.includes(index);
            return (
              <button
                key={index}
                type="button"
                role="gridcell"
                onClick={() => handleCell(index)}
                disabled={Boolean(cell) || !playing || turn !== "player"}
                aria-label={`cell ${index + 1}${cell ? `, ${cell === PLAYER ? "voltage" : "ground"}` : ""}`}
                className={`group relative grid aspect-square place-items-center rounded-xl border transition-all duration-200 ${
                  isWinning
                    ? "border-emerald-400/70 bg-ok/10 shadow-[0_0_24px_-6px_rgba(52,211,153,0.65)]"
                    : "border-line bg-surface-2/60 hover:border-accent/40 hover:bg-surface-2/70"
                } ${!cell && playing && turn === "player" ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className="absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100 group-hover:[background:radial-gradient(circle_at_50%_50%,rgba(0,210,255,0.08),transparent_70%)]" />
                <Symbol value={cell} />
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex min-h-[24px] items-center justify-center gap-2 text-center text-xs text-muted" aria-live="polite">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              result.winner === PLAYER ? "bg-ok" : result.winner === AI ? "bg-danger" : "bg-accent animate-pulse"
            }`}
          />
          {status}
        </div>

        {egg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-xs leading-relaxed text-amber-200"
          >
            <p className="font-semibold text-amber-300">Easter egg unlocked</p>
            <p className="mt-1">{t("arcade.egg")}</p>
          </motion.div>
        )}
      </div>

      {/* scoreboard */}
      <aside className="rounded-xl border border-line bg-surface-2/40 p-4">
        <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.22em] text-muted uppercase">
          <TrophyIcon width={13} height={13} /> {t("arcade.score")}
        </p>
        <dl className="space-y-2 text-xs">
          {[
            ["wins", score.wins, "text-emerald-300"],
            ["draws", score.draws, "text-ink"],
            ["losses", score.losses, "text-rose-300"],
          ].map(([key, value, color]) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <dt className="text-muted">{t(`arcade.${key}`)}</dt>
              <dd className={`font-mono text-sm font-semibold ${color}`}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 space-y-2 rounded-lg border border-line bg-surface/50 p-2.5 text-[11px] text-muted">
          <p className="flex items-center gap-2">
            <BoltIcon width={14} height={14} className="text-accent" /> {t("arcade.yourTurn")} = ⚡
          </p>
          <p className="flex items-center gap-2">
            <GroundIcon width={14} height={14} className="text-amber-300" /> AI = ⏚
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setScore({ wins: 0, draws: 0, losses: 0 });
            sfx.play("click");
          }}
          className="mt-3 w-full rounded-lg border border-line px-2 py-1.5 text-[10px] tracking-wide text-muted uppercase transition hover:border-slate-600 hover:text-ink"
        >
          {t("arcade.resetScore")}
        </button>
      </aside>
    </div>
  );
}
