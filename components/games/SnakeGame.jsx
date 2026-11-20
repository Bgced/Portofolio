"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameHud from "@/components/games/GameHud";
import { useBestScore, formatScore } from "@/lib/scores";

const GRID = 20;
const BASE_MS = 150;
const MIN_MS = 78;
const SPEED_STEP = 3; // ms lebih cepat per makanan
const SWIPE_MIN = 22; // px minimum supaya dihitung swipe
const MAX_QUEUE = 3; // buffer belokan biar input cepat tidak hilang

const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const START_BODY = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];
const START_DIR = { x: 1, y: 0 };

function keyOf(cell) {
  return `${cell.x},${cell.y}`;
}

function randomFood(snake) {
  const taken = new Set(snake.map(keyOf));
  const free = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)];
}

function initialSnake() {
  return START_BODY.map((cell) => ({ ...cell }));
}

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({ x: 14, y: 10 });
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("ready"); // ready | running | paused | over
  const [best, submitBest] = useBestScore("snake");

  // Refs dipakai loop supaya tidak perlu re-mount interval tiap tick.
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const dirRef = useRef(START_DIR);
  const queueRef = useRef([]);
  const scoreRef = useRef(0);
  const phaseRef = useRef(phase);
  const rootRef = useRef(null);

  const goToPhase = useCallback((next) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const startRun = useCallback(() => {
    const body = initialSnake();
    const first = randomFood(body);
    snakeRef.current = body;
    foodRef.current = first;
    dirRef.current = START_DIR;
    queueRef.current = [];
    scoreRef.current = 0;
    setSnake(body);
    setFood(first);
    setScore(0);
    goToPhase("running");
  }, [goToPhase]);

  const endRun = useCallback(() => {
    goToPhase("over");
    submitBest(scoreRef.current);
  }, [goToPhase, submitBest]);

  const step = useCallback(() => {
    const queue = queueRef.current;
    while (queue.length > 0) {
      const next = queue.shift();
      const cur = dirRef.current;
      if (next.x === -cur.x && next.y === -cur.y) continue; // no 180°
      dirRef.current = next;
      break;
    }

    const dir = dirRef.current;
    const body = snakeRef.current;
    const head = body[0];
    const nextHead = { x: head.x + dir.x, y: head.y + dir.y };

    if (nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= GRID || nextHead.y >= GRID) {
      endRun();
      return;
    }

    const ate = foodRef.current && nextHead.x === foodRef.current.x && nextHead.y === foodRef.current.y;
    // Ekor ikut pindah, jadi boleh ditempati kalau tidak sedang makan.
    const occupied = ate ? body : body.slice(0, -1);
    if (occupied.some((c) => c.x === nextHead.x && c.y === nextHead.y)) {
      endRun();
      return;
    }

    const nextBody = [nextHead, ...(ate ? body : body.slice(0, -1))];
    snakeRef.current = nextBody;
    setSnake(nextBody);

    if (ate) {
      const nextFood = randomFood(nextBody);
      foodRef.current = nextFood;
      setFood(nextFood);
      scoreRef.current += 1;
      setScore(scoreRef.current);
      if (!nextFood) endRun(); // papan penuh: menang
    }
  }, [endRun]);

  // Loop utama: setTimeout yang di-reschedule, selalu dibersihkan.
  useEffect(() => {
    if (phase !== "running") return undefined;
    const delay = Math.max(MIN_MS, BASE_MS - score * SPEED_STEP);
    const id = setTimeout(step, delay);
    return () => clearTimeout(id);
  }, [phase, snake, score, step]);

  const togglePause = useCallback(() => {
    const prev = phaseRef.current;
    if (prev === "running") goToPhase("paused");
    else if (prev === "paused") goToPhase("running");
  }, [goToPhase]);

  const steer = useCallback(
    (dx, dy) => {
      const current = phaseRef.current;
      if (current === "over" || current === "paused") return;

      const queue = queueRef.current;
      const last = queue.length > 0 ? queue[queue.length - 1] : dirRef.current;
      if (dx === last.x && dy === last.y) return;
      if (dx === -last.x && dy === -last.y) return; // no 180°

      if (queue.length < MAX_QUEUE) queue.push({ x: dx, y: dy });
      if (current === "ready") goToPhase("running");
    },
    [goToPhase]
  );

  // Keyboard: panah + WASD, space/P untuk pause-resume.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isTypingTarget(e.target)) return;

      // Snake juga hidup di hero; kalau ada modal terbuka, hanya snake di
      // dalam modal itu yang boleh menangkap tombol.
      const dialog = document.querySelector('[role="dialog"]');
      const inModal = Boolean(dialog && rootRef.current && dialog.contains(rootRef.current));
      if (dialog && !inModal) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      if (key === " " || key === "Spacebar" || key === "Enter" || key === "p") {
        const current = phaseRef.current;
        if (current === "ready") {
          // Di halaman (bukan modal) space tetap milik browser.
          if (!inModal) return;
          e.preventDefault();
          startRun();
          return;
        }
        e.preventDefault();
        if (current === "over") startRun();
        else togglePause();
        return;
      }

      const dir = DIRS[key];
      if (!dir) return;

      const current = phaseRef.current;
      if (current === "paused" || current === "over") return;
      if (current === "ready") {
        // Panah saat idle hanya memulai game di dalam modal, supaya scroll
        // halaman di hero tidak direbut.
        if (!inModal) return;
        e.preventDefault();
        startRun();
        steer(dir.x, dir.y);
        return;
      }
      e.preventDefault();
      steer(dir.x, dir.y);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [steer, togglePause, startRun]);

  // Tab disembunyikan → auto-pause; tidak ada timer yang jalan di background.
  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden || phaseRef.current !== "running") return;
      goToPhase("paused");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [goToPhase]);

  // Swipe untuk touch.
  const touchRef = useRef(null);
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchMove = (e) => {
    const start = touchRef.current;
    if (!start) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN && Math.abs(dy) < SWIPE_MIN) return;
    if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 1 : -1, 0);
    else steer(0, dy > 0 ? 1 : -1);
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = () => {
    touchRef.current = null;
  };

  const status =
    phase === "ready" ? "idle" : phase === "running" ? "live" : phase;

  const cellStyle = (cell) => ({
    left: `${(cell.x / GRID) * 100}%`,
    top: `${(cell.y / GRID) * 100}%`,
    width: `${100 / GRID}%`,
    height: `${100 / GRID}%`,
  });

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-[420px] select-none">
      <GameHud
        title="Snake"
        score={formatScore(score)}
        best={formatScore(best)}
        extra={status}
        onRestart={startRun}
        restartLabel="Restart"
      />

      <div
        className="playfield relative aspect-square w-full overflow-hidden"
        style={{ touchAction: "none" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {snake.map((cell, i) => (
          <div key={`${cell.x},${cell.y},${i}`} className="absolute p-px" style={cellStyle(cell)}>
            <div
              className={`h-full w-full rounded-[2px] ${i === 0 ? "bg-accent-2" : "bg-accent"}`}
            />
          </div>
        ))}

        {food ? (
          <div className="absolute p-[2px]" style={cellStyle(food)}>
            <div className="h-full w-full rounded-[2px] border border-danger bg-danger/40" />
          </div>
        ) : null}

        {phase === "ready" ? (
          <div className="absolute inset-0 grid place-items-center bg-canvas/70 p-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="mono-label text-ink">press start</p>
              <button type="button" onClick={startRun} className="btn btn-primary">
                Play
              </button>
            </div>
          </div>
        ) : null}

        {phase === "paused" ? (
          <div className="absolute inset-0 grid place-items-center bg-canvas/70 p-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="mono-label text-ink">paused</p>
              <button type="button" onClick={togglePause} className="btn btn-ghost">
                Resume
              </button>
            </div>
          </div>
        ) : null}

        {phase === "over" ? (
          <div className="absolute inset-0 grid place-items-center bg-canvas/85 p-4">
            <div className="flex w-full max-w-[240px] flex-col items-center gap-3 border border-line bg-surface p-4 text-center">
              <p className="mono-label text-danger">game over</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="font-mono text-3xl text-ink">{formatScore(score)}</span>
                <span className="mono-label">pts</span>
              </div>
              <p className="mono-label">
                best <span className="text-accent-2">{formatScore(Math.max(best, score))}</span>
              </p>
              <button type="button" onClick={startRun} className="btn btn-primary w-full">
                Play again
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="mono-label truncate text-[0.58rem]">Arrow keys or swipe</p>
        <button
          type="button"
          onClick={phase === "paused" || phase === "running" ? togglePause : startRun}
          aria-label={
            phase === "running" ? "Pause game" : phase === "paused" ? "Resume game" : "Start game"
          }
          className="border border-line px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-ink"
        >
          {phase === "running"
            ? "pause"
            : phase === "paused"
              ? "resume"
              : phase === "over"
                ? "replay"
                : "start"}
        </button>
      </div>
    </div>
  );
}
