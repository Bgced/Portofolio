"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameHud from "@/components/games/GameHud";
import { useBestScore, formatScore } from "@/lib/scores";

const SIZE = 4;
const CELLS = SIZE * SIZE;

/* ------------------------------------------------------------------
   Model

   Setiap petak adalah objek { id, value }. `id` dibuat sekali saat petak
   lahir dan dipakai sebagai `key` React, jadi petak yang bergabung bisa
   meluncur ke posisi baru (transform) sebelum nilainya diganti.
------------------------------------------------------------------- */

let cellSeq = 0;
function makeCell(value) {
  cellSeq += 1;
  return { id: `c${cellSeq}`, value };
}

function spawn(board) {
  const free = [];
  board.forEach((cell, i) => {
    if (!cell) free.push(i);
  });
  if (!free.length) return board;
  const next = board.slice();
  const pick = free[Math.floor(Math.random() * free.length)];
  next[pick] = makeCell(Math.random() < 0.9 ? 2 : 4);
  return next;
}

function freshBoard() {
  return spawn(spawn(Array(CELLS).fill(null)));
}

/** Daftar indeks satu baris/grid per arah, urut dari sisi tujuan. */
function linesFor(dir) {
  const lines = [];
  for (let i = 0; i < SIZE; i += 1) {
    const line = [];
    for (let j = 0; j < SIZE; j += 1) {
      if (dir === "left") line.push(i * SIZE + j);
      else if (dir === "right") line.push(i * SIZE + (SIZE - 1 - j));
      else if (dir === "up") line.push(j * SIZE + i);
      else line.push((SIZE - 1 - j) * SIZE + i);
    }
    lines.push(line);
  }
  return lines;
}

const LINES = {
  left: linesFor("left"),
  right: linesFor("right"),
  up: linesFor("up"),
  down: linesFor("down"),
};

function canMove(board) {
  for (let i = 0; i < CELLS; i += 1) {
    const cell = board[i];
    if (!cell) return true;
    const x = i % SIZE;
    const y = Math.floor(i / SIZE);
    if (x < SIZE - 1 && board[i + 1] && board[i + 1].value === cell.value) return true;
    if (y < SIZE - 1 && board[i + SIZE] && board[i + SIZE].value === cell.value) return true;
  }
  return false;
}

/**
 * Geser satu arah. Tiap petak hanya boleh bergabung sekali per langkah,
 * karena setelah merge petak tujuan langsung ditandai `merged`.
 */
function slide(board, dir) {
  const next = board.slice();
  const motions = [];
  const merges = [];
  let gained = 0;
  let moved = false;

  LINES[dir].forEach((line) => {
    // Petak berisi, urut dari sisi tujuan.
    const items = line
      .filter((idx) => board[idx])
      .map((idx) => ({ idx, cell: board[idx] }));

    let write = 0; // slot tujuan berikutnya
    let mergedLast = false; // slot terakhir sudah hasil merge, tidak boleh merge lagi

    items.forEach((item) => {
      const prevSlot = line[write - 1];
      const prev = write > 0 ? next[prevSlot] : null;

      if (!mergedLast && prev && prev.value === item.cell.value) {
        const value = prev.value * 2;
        next[prevSlot] = { ...prev, value };
        next[item.idx] = null;
        motions.push({ id: item.cell.id, from: item.idx, to: prevSlot, merged: true });
        merges.push({ at: prevSlot, id: prev.id, value });
        gained += value;
        mergedLast = true;
        moved = true;
        return;
      }

      const to = line[write];
      if (item.idx !== to) {
        next[to] = item.cell;
        next[item.idx] = null;
        motions.push({ id: item.cell.id, from: item.idx, to, merged: false });
        moved = true;
      }
      write += 1;
      mergedLast = false;
    });
  });

  return { board: moved ? next : board, motions, merges, gained, moved };
}

/* ------------------------------------------------------------------
   Tampilan petak — semua warna dari palet situs.
------------------------------------------------------------------- */

const TILE_STYLE = {
  2: { bg: "#0C171C", fg: "#7E96A1", border: "#182A31" },
  4: { bg: "rgba(126, 150, 161, 0.2)", fg: "#E9F6FA", border: "#182A31" },
  8: { bg: "rgba(56, 189, 248, 0.22)", fg: "#E9F6FA", border: "rgba(56, 189, 248, 0.4)" },
  16: { bg: "rgba(56, 189, 248, 0.38)", fg: "#E9F6FA", border: "rgba(56, 189, 248, 0.5)" },
  32: { bg: "rgba(34, 211, 238, 0.42)", fg: "#ffffff", border: "rgba(56, 189, 248, 0.5)" },
  64: { bg: "#22D3EE", fg: "#ffffff", border: "#67E8F9" },
  128: { bg: "#38BDF8", fg: "#04141A", border: "#38BDF8" },
  256: { bg: "#E9F6FA", fg: "#04070A", border: "#E9F6FA" },
  512: { bg: "rgba(255, 93, 93, 0.24)", fg: "#E9F6FA", border: "rgba(255, 93, 93, 0.5)" },
  1024: { bg: "#ff5d5d", fg: "#04070A", border: "#ff5d5d" },
  2048: { bg: "#67E8F9", fg: "#ffffff", border: "#E9F6FA" },
  4096: { bg: "#E9F6FA", fg: "#04070A", border: "#38BDF8" },
  8192: { bg: "#7E96A1", fg: "#04070A", border: "#E9F6FA" },
};

function tileStyle(value) {
  return TILE_STYLE[value] || TILE_STYLE[8192];
}

/** Ukuran font menyusut untuk angka panjang supaya tidak meluber. */
function fontFor(value) {
  const digits = String(value).length;
  if (digits <= 2) return "clamp(1.1rem, 6.2vw, 1.7rem)";
  if (digits === 3) return "clamp(0.95rem, 5.2vw, 1.45rem)";
  if (digits === 4) return "clamp(0.8rem, 4.2vw, 1.15rem)";
  return "clamp(0.65rem, 3.4vw, 0.95rem)";
}

function Tile({ value }) {
  const look = tileStyle(value);
  return (
    <div
      className="flex h-full w-full items-center justify-center font-mono font-semibold tabular-nums"
      style={{
        background: look.bg,
        color: look.fg,
        border: `1px solid ${look.border}`,
        borderRadius: 8,
        fontSize: fontFor(value),
        letterSpacing: "0.01em",
      }}
    >
      {value}
    </div>
  );
}

const SLIDE_MS = 110;

export default function Game2048() {
  const [best, submitBest] = useBestScore("2048");

  const [board, setBoard] = useState(freshBoard);
  const [score, setScore] = useState(0);
  const [extra, setExtra] = useState([]); // petak baru / hasil merge
  const [locked, setLocked] = useState(false);

  const boardRef = useRef(board);
  const busyRef = useRef(false);
  const timerRef = useRef(0);
  const scoreRef = useRef(score);
  const touchRef = useRef(null);

  boardRef.current = board;
  scoreRef.current = score;

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const commit = useCallback(
    (next, nextScore, nextLocked) => {
      boardRef.current = next;
      scoreRef.current = nextScore;
      setBoard(next);
      setScore(nextScore);
      setLocked(nextLocked);
      if (nextLocked) submitBest(nextScore);
    },
    [submitBest]
  );

  const restart = useCallback(() => {
    window.clearTimeout(timerRef.current);
    busyRef.current = false;
    setExtra([]);
    commit(freshBoard(), 0, false);
  }, [commit]);

  const play = useCallback(
    (dir) => {
      if (busyRef.current || !boardRef.current) return;
      if (locked && dir === "restart") return;

      const result = slide(boardRef.current, dir);
      if (!result.moved) return;

      busyRef.current = true;
      const open = boardRef.current.length === CELLS;
      const spawnAt = open ? (result.board.findIndex((cell) => !cell) + 1) % CELLS : -1;

      // Fase 1: petak meluncur ke posisi tujuan (transform).
      setExtra(result.motions.map((m) => ({ ...m, at: m.to })));
      if (dir === "left" || dir === "right") touchRef.current = "slide-x";
      else touchRef.current = "slide-y";

      timerRef.current = window.setTimeout(() => {
        // Fase 2: gabung nilai, lahir petak baru, atau kunci papan.
        let next = result.board;
        let lockedNext = !canMove(next);
        if (!lockedNext) {
          next = spawn(next);
          if (spawnAt >= 0 && next[spawnAt]) {
            result.merges = [
              ...result.merges,
              { at: spawnAt, id: next[spawnAt].id, value: next[spawnAt].value, born: true },
            ];
          }
        }
        setExtra(result.merges.map((m) => ({ ...m, at: m.at })));
        busyRef.current = false;
        commit(next, scoreRef.current + result.gained, lockedNext);
      }, SLIDE_MS);
    },
    [commit, locked]
  );

  // Keyboard: panah + WASD (preventDefault supaya halaman tidak ikut scroll).
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const key = e.key;
      let dir = null;
      if (key === "ArrowLeft" || key === "a" || key === "A") dir = "left";
      else if (key === "ArrowRight" || key === "d" || key === "D") dir = "right";
      else if (key === "ArrowUp" || key === "w" || key === "W") dir = "up";
      else if (key === "ArrowDown" || key === "s" || key === "S") dir = "down";
      if (!dir) return;
      e.preventDefault();
      play(dir);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [play]);

  // Swipe: hanya sumbu dominan, minimal 24px.
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) play(dx > 0 ? "right" : "left");
    else play(dy > 0 ? "down" : "up");
  };

  // Lapisan animasi: posisi awal (sebelum meluncur) atau sedang meluncur.
  const extraAt = new Map(extra.map((m) => [m.at, m]));

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <GameHud
        title="2048"
        score={formatScore(score)}
        best={formatScore(best)}
        extra={locked ? "game over" : null}
        onRestart={restart}
        restartLabel="Reset"
      />

      <div className="playfield relative mx-auto aspect-square w-full max-w-[420px] p-2">
        <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-2">
          {Array.from({ length: CELLS }).map((_, i) => (
            <div key={`slot-${i}`} className="bg-surface-2" style={{ borderRadius: 8 }} />
          ))}
        </div>

        <div
          className="absolute inset-0 select-none p-2"
          style={{ ["--cell"]: "calc((100% - 1rem - 2rem) / 4)" }}
        >
          <div className="relative h-full w-full touch-none" style={{ lineHeight: 1 }}>
            {board.map((cell, i) => {
              if (!cell) return null;
              const x = i % SIZE;
              const y = Math.floor(i / SIZE);
              const anim = extraAt.get(i);

              // Persentase translate dihitung dari ukuran tile itu sendiri,
              // bukan dari lebar papan. Jadi cell = 100% + gap 8px per langkah.
              const shift = (n) => `calc(${n} * 100% + ${n} * 8px)`;
              const pop = Boolean(anim && (anim.born || anim.merged));

              return (
                <div
                  key={cell.id}
                  className={`pointer-events-none absolute ${pop ? "tile-pop" : ""}`}
                  style={{
                    left: 0,
                    top: 0,
                    width: "var(--cell)",
                    height: "var(--cell)",
                    transform: `translate3d(${shift(x)}, ${shift(y)}, 0)`,
                    transition: `transform ${SLIDE_MS}ms ease-out, opacity ${SLIDE_MS}ms ease-out`,
                  }}
                >
                  <Tile value={cell.value} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Area sentuh untuk swipe + fokus keyboard */}
        <div
          className="absolute inset-0"
          style={{ touchAction: "none" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />

        {locked ? (
          <div className="absolute inset-0 grid place-items-center bg-canvas/90 p-4" style={{ borderRadius: 8 }}>
            <div className="w-full max-w-[260px] border border-line bg-surface p-4 text-center" style={{ borderRadius: 8 }}>
              <p className="mono-label text-ink">Game over</p>
              <p className="mt-2 font-mono text-[1.4rem] tabular-nums text-ink">{formatScore(score)}</p>
              <p className="mono-label mt-1 text-[0.56rem]">best {formatScore(best)}</p>
              <button
                type="button"
                onClick={restart}
                className="btn btn-primary mt-4 w-full text-[0.68rem]"
                style={{ borderRadius: 6 }}
              >
                Play again
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="mono-label text-[0.56rem]">arrows / wasd · swipe</p>
        <button
          type="button"
          onClick={restart}
          className="btn btn-ghost px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.1em]"
          style={{ borderRadius: 6 }}
        >
          New game
        </button>
      </div>
    </div>
  );
}
