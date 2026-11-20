"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameHud from "@/components/games/GameHud";
import { useBestScore, formatScore } from "@/lib/scores";

const HOLES = 9;
const ROUND_MS = 30000;

// The mole's window starts generous and tightens as the clock runs down.
const START_WINDOW = 820;
const MIN_WINDOW = 380;
// Quiet beat between moles; also tightens, so late rounds feel busier.
const START_GAP = 430;
const MIN_GAP = 140;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** 0 at the start of the round, 1 at time-up. */
const elapsed = (left) => clamp(1 - left / ROUND_MS, 0, 1);

const windowFor = (left) => Math.round(START_WINDOW - (START_WINDOW - MIN_WINDOW) * elapsed(left));
const gapFor = (left) => Math.round(START_GAP - (START_GAP - MIN_GAP) * elapsed(left));

export default function WhackAMole() {
  const [best, submitBest] = useBestScore("whack");
  const [phase, setPhase] = useState("idle"); // idle | playing | over
  const [msLeft, setMsLeft] = useState(ROUND_MS);
  const [score, setScore] = useState(0);
  const [mole, setMole] = useState(-1);
  const [hit, setHit] = useState(-1);

  const phaseRef = useRef("idle");
  const scoreRef = useRef(0);
  const leftRef = useRef(ROUND_MS);
  const endAtRef = useRef(0);
  const tickRef = useRef(null);
  const spawnRef = useRef(null);
  const flashRef = useRef(null);
  const moleRef = useRef(-1);

  const clearTimers = useCallback(() => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    if (spawnRef.current) window.clearTimeout(spawnRef.current);
    if (flashRef.current) window.clearTimeout(flashRef.current);
    tickRef.current = null;
    spawnRef.current = null;
    flashRef.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const hideMole = useCallback(() => {
    moleRef.current = -1;
    setMole(-1);
  }, []);

  const finish = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    clearTimers();
    phaseRef.current = "over";
    setPhase("over");
    hideMole();
    setHit(-1);
    leftRef.current = 0;
    setMsLeft(0);
    submitBest(scoreRef.current);
  }, [clearTimers, hideMole, submitBest]);

  // One recursive timeout chain: pop a mole, hide it, pause, repeat.
  const spawn = useCallback(() => {
    spawnRef.current = null;
    if (phaseRef.current !== "playing" || document.hidden) return;

    const left = Math.max(0, endAtRef.current - Date.now());
    if (left <= 0) return;

    let next = Math.floor(Math.random() * HOLES);
    // Never the same hole twice in a row.
    if (next === moleRef.current) next = (next + 1 + Math.floor(Math.random() * (HOLES - 1))) % HOLES;

    moleRef.current = next;
    setMole(next);

    spawnRef.current = window.setTimeout(() => {
      spawnRef.current = null;
      if (moleRef.current === next) hideMole();
      const rest = Math.max(0, endAtRef.current - Date.now());
      spawnRef.current = window.setTimeout(spawn, gapFor(rest));
    }, windowFor(left));
  }, [hideMole]);

  const runClock = useCallback(
    (left) => {
      endAtRef.current = Date.now() + left;
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = window.setInterval(() => {
        const remain = Math.max(0, endAtRef.current - Date.now());
        leftRef.current = remain;
        setMsLeft(remain);
        if (remain <= 0) finish();
      }, 100);
    },
    [finish]
  );

  const start = useCallback(() => {
    clearTimers();
    scoreRef.current = 0;
    leftRef.current = ROUND_MS;
    setScore(0);
    setMsLeft(ROUND_MS);
    setHit(-1);
    hideMole();
    phaseRef.current = "playing";
    setPhase("playing");
    runClock(ROUND_MS);
    spawnRef.current = window.setTimeout(spawn, 320);
  }, [clearTimers, hideMole, runClock, spawn]);

  // Hidden tab: freeze the clock and the mole; pick both up where they stopped.
  useEffect(() => {
    if (phase !== "playing") return undefined;

    const onVisibility = () => {
      if (document.hidden) {
        const left = Math.max(0, endAtRef.current - Date.now());
        clearTimers();
        leftRef.current = left;
        setMsLeft(left);
        hideMole();
        setHit(-1);
      } else if (phaseRef.current === "playing" && !tickRef.current) {
        if (leftRef.current <= 0) {
          finish();
          return;
        }
        runClock(leftRef.current);
        spawnRef.current = window.setTimeout(spawn, 220);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [phase, clearTimers, finish, hideMole, runClock, spawn]);

  const whack = (index) => {
    if (phaseRef.current !== "playing" || index !== moleRef.current) return;

    hideMole();
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setHit(index);

    if (flashRef.current) window.clearTimeout(flashRef.current);
    flashRef.current = window.setTimeout(() => {
      flashRef.current = null;
      setHit(-1);
    }, 180);

    if (spawnRef.current) {
      // Cut the rest of the window and serve the next mole right away.
      window.clearTimeout(spawnRef.current);
      spawnRef.current = window.setTimeout(spawn, 120);
    }
  };

  const seconds = Math.ceil(msLeft / 1000);
  const status = phase === "playing" ? `${seconds}s` : phase === "over" ? "over" : "ready";

  return (
    <div className="mx-auto w-full max-w-[400px] select-none">
      <GameHud
        title="Whack-a-Mole"
        score={formatScore(score)}
        best={formatScore(best)}
        extra={status}
        onRestart={phase === "playing" ? start : undefined}
        restartLabel="Restart"
      />

      <div className="playfield p-3">
        <div className="mb-3 flex items-center gap-3">
          <span className="mono-label">time</span>
          <div className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-[2px] border border-line bg-surface">
            <div
              className={`h-full ${seconds <= 5 && phase === "playing" ? "bg-danger" : "bg-accent"}`}
              style={{ width: `${(msLeft / ROUND_MS) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right font-mono text-[0.72rem] tabular-nums text-ink">{seconds}s</span>
        </div>

        <div className="relative grid grid-cols-3 gap-2" role="group" aria-label="Whack-a-mole board">
          {Array.from({ length: HOLES }, (_, index) => {
            const isUp = mole === index;
            const isHit = hit === index;
            return (
              <button
                key={index}
                type="button"
                aria-label={`Hole ${index + 1}${isUp ? ", mole up" : ", empty"}`}
                onClick={() => whack(index)}
                className={[
                  "relative aspect-square touch-manipulation overflow-hidden rounded-[6px] border transition-colors duration-100",
                  "bg-surface-2 focus:outline-none focus-visible:border-accent-2",
                  isHit ? "border-ok" : isUp ? "border-accent-2" : "border-line hover:border-accent",
                ].join(" ")}
              >
                {/* hit marker: the mole leaves, the score stays visible for a beat */}
                {isHit ? (
                  <span className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-[0.85rem] font-bold text-ok">
                    +1
                  </span>
                ) : null}

                {/* dark burrow */}
                <span className="pointer-events-none absolute bottom-[10%] left-1/2 h-[26%] w-[78%] -translate-x-1/2 rounded-[6px] border border-line bg-canvas" />

                {/* mole */}
                <span
                  className={[
                    "pointer-events-none absolute bottom-[18%] left-1/2 flex h-[56%] w-[60%] -translate-x-1/2 flex-col items-center justify-center gap-[9%]",
                    "rounded-[8px] border border-accent-2 bg-accent transition-transform duration-100 ease-out",
                    isUp ? "translate-y-0" : "translate-y-[140%]",
                  ].join(" ")}
                >
                  <span className="flex w-full items-center justify-center gap-[16%]">
                    <span className="h-[7px] w-[7px] rounded-full bg-canvas" />
                    <span className="h-[7px] w-[7px] rounded-full bg-canvas" />
                  </span>
                  <span className="h-[3px] w-[26%] rounded-[2px] bg-accent-2" />
                </span>

                {/* hole lip in front of the mole's feet */}
                <span className="pointer-events-none absolute bottom-[10%] left-1/2 h-[5px] w-[78%] -translate-x-1/2 rounded-[2px] bg-line" />
              </button>
            );
          })}

          {phase !== "playing" ? (
            <div className="absolute inset-0 grid place-items-center bg-canvas/85 p-2">
              <div className="w-full max-w-[236px] rounded-[8px] border border-line bg-surface p-4 text-center">
                {phase === "over" ? (
                  <>
                    <p className="mono-label">time up</p>
                    <p className="mt-1 font-mono text-[1.7rem] font-bold leading-none text-ink">
                      {formatScore(score)}
                    </p>
                    <p className="mono-label mt-2">
                      best <span className="text-accent-2">{formatScore(best)}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mono-label text-ink">click the mole</p>
                    <p className="mt-1 text-[0.78rem] text-muted">30 seconds on the clock.</p>
                  </>
                )}
                <button type="button" onClick={start} className="btn btn-primary mt-3 w-full">
                  {phase === "over" ? "Play again" : "Start"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <p className={`mono-label mt-3 truncate ${phase === "over" ? "text-accent-2" : ""}`} aria-live="polite">
        {phase === "playing" ? "click the mole" : phase === "over" ? "round over — play again" : "click start to play"}
      </p>
    </div>
  );
}
