"use client";

import { useEffect, useRef, useState } from "react";
import { Hand, HandFist, Scissors } from "lucide-react";
import GameHud from "@/components/games/GameHud";
import { useBestScore, formatScore } from "@/lib/scores";

const MOVES = [
  { id: "rock", label: "Rock", Icon: HandFist },
  { id: "paper", label: "Paper", Icon: Hand },
  { id: "scissors", label: "Scissors", Icon: Scissors },
];

const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };
const WIN_TARGET = 3;
const MAX_ROUNDS = 5;
const REVEAL_MS = 400;

const moveById = (id) => MOVES.find((move) => move.id === id) || null;

const pickCpuMove = () => MOVES[Math.floor(Math.random() * MOVES.length)].id;

/** Hasil satu ronde dari sudut pandang pemain: "win" | "lose" | "draw". */
function judge(you, cpu) {
  if (you === cpu) return "draw";
  return BEATS[you] === cpu ? "win" : "lose";
}

function resultCopy(outcome, youMove, cpuMove) {
  if (outcome === "win") {
    return {
      title: "You take the round",
      detail: `${youMove.label} beats ${cpuMove.label}`,
      tone: "text-ok",
    };
  }
  if (outcome === "lose") {
    return {
      title: "CPU takes the round",
      detail: `${cpuMove.label} beats ${youMove.label}`,
      tone: "text-danger",
    };
  }
  return {
    title: "Draw, round replays",
    detail: `Both picked ${youMove.label}`,
    tone: "text-muted",
  };
}

/** Satu kotak arena: ikon pilihan, atau tanda tanya saat belum ada. */
function MoveSlot({ move }) {
  const Icon = move?.Icon;
  return (
    <div
      className={`grid aspect-square place-items-center border transition-colors duration-300 ${
        Icon ? "border-accent-2 bg-surface-2" : "border-line bg-surface"
      }`}
    >
      {Icon ? (
        <Icon size={34} strokeWidth={1.6} className="text-ink" aria-hidden="true" />
      ) : (
        <span className="font-mono text-lg text-line" aria-hidden="true">
          ?
        </span>
      )}
    </div>
  );
}

export default function RockPaperScissors() {
  const [best, submitBest] = useBestScore("rps");
  const [you, setYou] = useState(0);
  const [cpu, setCpu] = useState(0);
  const [round, setRound] = useState(1);
  const [pick, setPick] = useState(null);
  const [cpuPick, setCpuPick] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | reveal | done
  const [outcome, setOutcome] = useState(null);
  const [streak, setStreak] = useState(0);

  const timerRef = useRef(null);
  const busyRef = useRef(false);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const startMatch = () => {
    clearTimeout(timerRef.current);
    busyRef.current = false;
    setYou(0);
    setCpu(0);
    setRound(1);
    setPick(null);
    setCpuPick(null);
    setOutcome(null);
    setPhase("idle");
  };

  const playRound = (moveId) => {
    if (busyRef.current || phase === "done") return;
    busyRef.current = true;

    const cpuMove = pickCpuMove();
    const result = judge(moveId, cpuMove);

    setPick(moveId);
    setCpuPick(cpuMove);
    setOutcome(result);
    setPhase("reveal");

    const nextYou = you + (result === "win" ? 1 : 0);
    const nextCpu = cpu + (result === "lose" ? 1 : 0);
    const matchOver = nextYou >= WIN_TARGET || nextCpu >= WIN_TARGET;
    // Streak lintas match: menang = +1, kalah = 0, seri = tetap. Match kalah
    // selalu berakhir dengan ronde kalah, jadi streak otomatis 0 di akhir.
    const nextStreak = result === "win" ? streak + 1 : result === "lose" ? 0 : streak;

    setStreak(nextStreak);
    if (nextStreak > best) submitBest(nextStreak);

    timerRef.current = setTimeout(() => {
      setYou(nextYou);
      setCpu(nextCpu);

      if (matchOver) {
        setPhase("done");
      } else {
        if (result !== "draw") setRound((value) => Math.min(value + 1, MAX_ROUNDS));
        setPhase("idle");
      }
      busyRef.current = false;
    }, REVEAL_MS);
  };

  const finished = phase === "done";
  const locked = phase === "reveal";
  const youWon = finished && you >= WIN_TARGET;
  const youMove = moveById(pick);
  const cpuMove = moveById(cpuPick);

  let banner = null;
  if (finished) {
    banner = {
      title: youWon ? "You win the match" : "CPU wins the match",
      detail: `Final ${you} – ${cpu} · best streak ${formatScore(best)}`,
      tone: youWon ? "text-ok" : "text-danger",
    };
  } else if (outcome && youMove && cpuMove) {
    banner = resultCopy(outcome, youMove, cpuMove);
  }

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <GameHud
        title="Rock Paper Scissors"
        score={formatScore(streak)}
        best={formatScore(best)}
        extra={`Round ${round}/${MAX_ROUNDS}`}
        onRestart={startMatch}
        restartLabel="Reset"
      />

      {/* Skor berjalan */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center border border-line bg-surface px-3 py-2">
        <div className="text-center">
          <p className="mono-label">You</p>
          <p className="font-mono text-2xl text-ink">{you}</p>
        </div>
        <span className="mono-label text-line" aria-hidden="true">
          —
        </span>
        <div className="text-center">
          <p className="mono-label">CPU</p>
          <p className="font-mono text-2xl text-ink">{cpu}</p>
        </div>
      </div>

      {/* Arena */}
      <div className="playfield mt-3 p-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div>
            <p className="mono-label mb-2 text-center">You</p>
            <MoveSlot move={youMove} />
          </div>
          <span className="mono-label pt-5" aria-hidden="true">
            vs
          </span>
          <div>
            <p className="mono-label mb-2 text-center">CPU</p>
            <MoveSlot move={cpuMove} />
          </div>
        </div>

        <div
          className="mt-3 flex min-h-[54px] flex-col items-center justify-center border-t border-line pt-2 text-center"
          role="status"
          aria-live="polite"
        >
          {banner ? (
            <>
              <p className={`text-sm font-semibold ${banner.tone}`}>{banner.title}</p>
              <p className="mt-0.5 text-[0.72rem] text-muted">{banner.detail}</p>
            </>
          ) : (
            <p className="mono-label">Pick your hand</p>
          )}
        </div>
      </div>

      {/* Kontrol */}
      {finished ? (
        <div className="mt-3 space-y-2">
          <p className="text-center text-[0.72rem] text-muted">
            Longest win streak:{" "}
            <span className="font-mono text-accent-2">{formatScore(best)}</span>
          </p>
          <button type="button" onClick={startMatch} className="btn btn-primary w-full">
            Play again
          </button>
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {MOVES.map(({ id, label, Icon }) => {
              const selected = locked && pick === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => playRound(id)}
                  disabled={locked}
                  aria-label={label}
                  className={`flex flex-col items-center gap-2 border px-2 py-3 transition-colors ${
                    selected
                      ? "border-accent bg-surface-2"
                      : "border-line bg-surface hover:border-accent-2"
                  } ${locked ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <Icon
                    size={26}
                    strokeWidth={1.6}
                    className={selected ? "text-accent-2" : "text-ink"}
                    aria-hidden="true"
                  />
                  <span className="mono-label">{label}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted">
            first to {WIN_TARGET} takes the match · streak {formatScore(streak)}
          </p>
        </>
      )}
    </div>
  );
}
