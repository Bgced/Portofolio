"use client";

import { useEffect, useReducer, useRef } from "react";
import GameHud from "@/components/games/GameHud";
import { useBestScore, formatScore } from "@/lib/scores";

const COLS = 10;
const ROWS = 20;

// Tujuh warna bidak, semuanya dari palet situs.
const COLORS = {
  I: "#6f9bff",
  O: "#eaf1ff",
  T: "#2a5fe8",
  S: "#35d6a4",
  Z: "#ff5d5d",
  J: "#8299c4",
  L: "#1e2a48",
};

// Empat matriks rotasi per bidak (SRS).
const SHAPES = {
  I: [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
  ],
  O: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
  ],
};

// Wall kick SRS, sudah dikonversi ke koordinat layar (y bertambah ke bawah).
const KICKS_JLSTZ = {
  "0>1": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  "1>0": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  "1>2": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  "2>1": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  "2>3": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  "3>2": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  "3>0": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  "0>3": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
};

const KICKS_I = {
  "0>1": [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  "1>0": [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  "1>2": [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
  "2>1": [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  "2>3": [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  "3>2": [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  "3>0": [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  "0>3": [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
};

// Skor baris: 1 = 100, 2 = 300, 3 = 500, 4 = 800.
const LINE_SCORE = [0, 100, 300, 500, 800];
const START_SPEED = 900;
const MIN_SPEED = 110;

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function bag() {
  const order = ["I", "O", "T", "S", "Z", "J", "L"];
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function newPiece(type) {
  return {
    type,
    matrix: SHAPES[type][0],
    x: type === "O" ? 4 : 3,
    y: type === "I" ? -1 : 0,
    rot: 0,
  };
}

function speedAt(level) {
  return Math.max(MIN_SPEED, START_SPEED - (level - 1) * 80);
}

function collides(board, matrix, px, py) {
  for (let r = 0; r < matrix.length; r += 1) {
    for (let c = 0; c < matrix.length; c += 1) {
      if (!matrix[r][c]) continue;
      const x = px + c;
      const y = py + r;
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y >= 0 && board[y][x]) return true;
    }
  }
  return false;
}

function rotated(type, rot, x, y, board) {
  const next = (rot + 1) % 4;
  const table = type === "O" ? [[0, 0]] : type === "I" ? KICKS_I[`${rot}>${next}`] : KICKS_JLSTZ[`${rot}>${next}`];
  const matrix = SHAPES[type][next];
  for (const [dx, dy] of table) {
    if (!collides(board, matrix, x + dx, y + dy)) {
      return { matrix, x: x + dx, y: y + dy, rot: next };
    }
  }
  return null;
}

function merge(board, piece) {
  const rows = board.map((row) => row.slice());
  piece.matrix.forEach((line, r) => {
    line.forEach((cell, c) => {
      if (cell && piece.y + r >= 0 && piece.y + r < ROWS) {
        rows[piece.y + r][piece.x + c] = piece.type;
      }
    });
  });
  return rows;
}

function clearRows(board) {
  const kept = board.filter((row) => row.some((cell) => !cell));
  const cleared = ROWS - kept.length;
  if (!cleared) return { board, cleared: 0 };
  const blank = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return { board: [...blank, ...kept], cleared };
}

/** Isi ulang antrean dengan kantong acak 7 bidak kalau sudah menipis. */
function refill(queue) {
  let filled = queue;
  while (filled.length < 1) filled = filled.concat(bag());
  return filled;
}

/** Bidak baru dari antrean; null kalau kotak spawn sudah penuh (game over). */
function takeNext(state) {
  const queue = refill(state.bag);
  const piece = newPiece(queue[0]);
  if (collides(state.board, piece.matrix, piece.x, piece.y)) return null;
  const rest = refill(queue.slice(1));
  return { piece, bag: rest, next: rest[0], holdLocked: false };
}

function lock(state, piece) {
  const { board, cleared } = clearRows(merge(state.board, piece));
  const lines = state.lines + cleared;
  const level = Math.floor(lines / 10) + 1;
  const base = { ...state, board, score: state.score + LINE_SCORE[cleared], lines, level };
  const spawned = takeNext(base);
  if (!spawned) return { ...base, status: "over" };
  return { ...base, ...spawned };
}

function descend(state) {
  const { piece, board } = state;
  if (!collides(board, piece.matrix, piece.x, piece.y + 1)) {
    return { ...state, piece: { ...piece, y: piece.y + 1 } };
  }
  return lock(state, piece);
}

function initial() {
  const queue = refill(bag());
  const rest = refill(queue.slice(1));
  return {
    board: emptyBoard(),
    piece: newPiece(queue[0]),
    bag: rest,
    next: rest[0],
    hold: null,
    holdLocked: false,
    score: 0,
    lines: 0,
    level: 1,
    status: "playing",
    paused: false,
  };
}

function reducer(state, action) {
  const idle = state.status !== "playing" || state.paused;

  switch (action.type) {
    case "start":
      return initial();

    case "togglePause":
      return state.status === "playing" ? { ...state, paused: !state.paused } : state;

    case "pause":
      return state.status === "playing" && !state.paused ? { ...state, paused: true } : state;

    case "move": {
      if (idle) return state;
      const x = state.piece.x + action.dx;
      if (collides(state.board, state.piece.matrix, x, state.piece.y)) return state;
      return { ...state, piece: { ...state.piece, x } };
    }

    case "rotate": {
      if (idle || state.piece.type === "O") return state;
      const turned = rotated(state.piece.type, state.piece.rot, state.piece.x, state.piece.y, state.board);
      return turned ? { ...state, piece: { ...state.piece, ...turned } } : state;
    }

    case "drop": {
      // Soft drop cuma turun satu baris; terkunci tetap lewat gravitasi.
      if (idle || collides(state.board, state.piece.matrix, state.piece.x, state.piece.y + 1)) return state;
      return { ...state, piece: { ...state.piece, y: state.piece.y + 1 } };
    }

    case "gravity":
      return idle ? state : descend(state);

    case "hardDrop": {
      if (idle) return state;
      let y = state.piece.y;
      while (!collides(state.board, state.piece.matrix, state.piece.x, y + 1)) y += 1;
      return lock(state, { ...state.piece, y });
    }

    case "hold": {
      if (idle || state.holdLocked) return state;
      const current = state.piece.type;

      if (state.hold) {
        const swapped = newPiece(state.hold);
        if (collides(state.board, swapped.matrix, swapped.x, swapped.y)) return state;
        return { ...state, piece: swapped, hold: current, holdLocked: true };
      }

      const spawned = takeNext(state);
      if (!spawned) return { ...state, status: "over" };
      return { ...state, ...spawned, hold: current, holdLocked: true };
    }

    default:
      return state;
  }
}

function cellStyle(color) {
  return { background: color, outline: "1px solid #050b1f", outlineOffset: "-1px" };
}

function Board({ board, piece, ghostY }) {
  return (
    <div
      className="playfield grid overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
        aspectRatio: `${COLS} / ${ROWS}`,
        // Grid 24px bawaan .playfield tidak sejajar dengan 10x20 sel, jadi dimatikan.
        backgroundImage: "none",
        backgroundColor: "#050b1f",
      }}
      role="img"
      aria-label="Tetris board"
    >
      {board.map((row, r) =>
        row.map((cell, c) => {
          const inPiece =
            r >= piece.y &&
            r < piece.y + piece.matrix.length &&
            c >= piece.x &&
            c < piece.x + piece.matrix.length &&
            piece.matrix[r - piece.y][c - piece.x];
          const inGhost =
            !inPiece &&
            r >= ghostY &&
            r < ghostY + piece.matrix.length &&
            c >= piece.x &&
            c < piece.x + piece.matrix.length &&
            piece.matrix[r - ghostY][c - piece.x];

          let style = null;
          if (inPiece) style = cellStyle(COLORS[piece.type]);
          else if (cell) style = cellStyle(COLORS[cell]);
          else if (inGhost) style = { border: `1px solid ${COLORS[piece.type]}`, opacity: 0.35 };

          return (
            <div
              key={`${r}-${c}`}
              className="border-r border-b border-line/30"
              style={style || undefined}
            />
          );
        })
      )}
    </div>
  );
}

/** Potong baris/kolom kosong supaya preview bidak I tidak tampak kosong. */
function trimmed(type) {
  const source = SHAPES[type][0];
  const rows = source.filter((row) => row.some(Boolean));
  const cols = rows[0].map((_, c) => rows.some((row) => row[c]));
  return rows.map((row) => row.filter((_, c) => cols[c]));
}

function Mini({ type, label }) {
  const matrix = type ? trimmed(type) : null;
  return (
    <div className="border-line bg-surface p-1.5" style={{ borderWidth: 1 }}>
      <p className="mono-label mb-1 text-[0.52rem]">{label}</p>
      <div className="grid h-[52px] place-items-center">
        {matrix ? (
          <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${matrix.length}, 10px)` }}>
            {matrix.flat().map((on, i) => (
              <span
                key={i}
                className="block h-[10px] w-[10px]"
                style={on ? cellStyle(COLORS[type]) : undefined}
              />
            ))}
          </div>
        ) : (
          <span className="font-mono text-[0.6rem] text-muted">—</span>
        )}
      </div>
    </div>
  );
}

export default function Tetris() {
  const [best, submitBest] = useBestScore("tetris");
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const prevStatus = useRef(state.status);
  const scoreRef = useRef(state.score);

  scoreRef.current = state.score;

  // Kirim skor sekali saja, tepat saat run berakhir.
  useEffect(() => {
    if (prevStatus.current === "playing" && state.status === "over") {
      submitBest(scoreRef.current);
    }
    prevStatus.current = state.status;
  }, [state.status, submitBest]);

  // Satu interval gravitasi; dibersihkan saat level berubah, pause, atau unmount.
  useEffect(() => {
    if (state.paused || state.status !== "playing") return undefined;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      dispatch({ type: "gravity" });
    }, speedAt(state.level));
    return () => window.clearInterval(timer);
  }, [state.level, state.paused, state.status]);

  // Tab disembunyikan: otomatis pause supaya tidak menumpuk langkah.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key;
      let used = true;
      if (key === "ArrowLeft") dispatch({ type: "move", dx: -1 });
      else if (key === "ArrowRight") dispatch({ type: "move", dx: 1 });
      else if (key === "ArrowDown") dispatch({ type: "drop" });
      else if (key === "ArrowUp" || key === "x" || key === "X") dispatch({ type: "rotate" });
      else if (key === " " || key === "Spacebar") dispatch({ type: "hardDrop" });
      else if (key === "c" || key === "C" || key === "Shift") dispatch({ type: "hold" });
      else if (key === "p" || key === "P" || key === "Escape") dispatch({ type: "togglePause" });
      else used = false;
      if (used) e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const { board, piece, next, hold, score, lines, level, status, paused } = state;

  let ghostY = piece.y;
  while (ghostY < ROWS && !collides(board, piece.matrix, piece.x, ghostY + 1)) ghostY += 1;

  const ended = status === "over";
  const showOverlay = ended || paused;

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <GameHud title="Tetris" score={formatScore(score)} best={formatScore(best)} extra={`Lv ${level}`} />

      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Board board={board} piece={piece} ghostY={ghostY} />

          {showOverlay ? (
            <div className="absolute inset-0 grid place-items-center border border-line bg-canvas/90 p-2">
              {ended ? (
                <div className="w-full border-line bg-surface p-3 text-center" style={{ borderWidth: 1 }}>
                  <p className="mono-label text-ink">Game over</p>
                  <p className="mt-2 font-mono text-[1.1rem] text-ink">{formatScore(score)}</p>
                  <p className="mono-label mt-1 text-[0.54rem]">best {formatScore(best)}</p>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "start" })}
                    className="btn btn-primary mt-3 w-full text-[0.68rem]"
                  >
                    Play again
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mono-label text-ink">Paused</p>
                  <p className="mono-label mt-1 text-[0.52rem]">press P to resume</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex w-[74px] shrink-0 flex-col gap-2">
          <Mini type={next} label="Next" />
          <Mini type={hold} label="Hold" />
          <div className="border-line bg-surface px-1.5 py-1.5" style={{ borderWidth: 1 }}>
            <p className="mono-label text-[0.52rem]">Lines</p>
            <p className="font-mono text-[0.78rem] text-ink">{lines}</p>
            <p className="mono-label mt-1.5 text-[0.52rem]">Level</p>
            <p className="font-mono text-[0.78rem] text-accent-2">{level}</p>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "togglePause" })}
          disabled={status !== "playing"}
          className="btn btn-ghost flex-1 py-1.5 text-[0.62rem] uppercase tracking-[0.1em]"
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "start" })}
          className="btn btn-ghost flex-1 py-1.5 text-[0.62rem] uppercase tracking-[0.1em]"
        >
          Restart
        </button>
      </div>

      <p className="mono-label mt-2 text-center text-[0.52rem] leading-relaxed">
        ← → move · ↑ rotate · ↓ soft · space hard · C hold · P pause
      </p>
    </div>
  );
}
