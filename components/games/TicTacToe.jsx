"use client";

import { useCallback, useEffect, useState } from "react";
import GameHud from "@/components/games/GameHud";
import { useBestScore, formatScore } from "@/lib/scores";

const HUMAN = "X";
const MACHINE = "O";
const DRAW = "draw";
const THINK_MS = 320;

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

function emptyBoard() {
  return Array(9).fill(null);
}

/** Pemenang papan: "X" | "O" | DRAW | null. */
function evaluate(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : DRAW;
}

function winningLine(board) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

/** Cari langkah yang langsung menang untuk `mark`, atau -1. */
function findWin(board, mark) {
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = board.slice();
    next[i] = mark;
    if (evaluate(next) === mark) return i;
  }
  return -1;
}

/**
 * Minimax penuh dengan skor berlapis langkah (menang cepat > menang lambat,
 * kalah lambat > kalah cepat). Kemenangan instan dipangkas lebih dulu.
 */
function minimax(board, turn) {
  const result = evaluate(board);
  if (result === MACHINE) return { score: 10 - board.filter(Boolean).length };
  if (result === HUMAN) return { score: board.filter(Boolean).length - 10 };
  if (result === DRAW) return { score: 0 };

  const winning = findWin(board, turn);
  if (winning !== -1) {
    const next = board.slice();
    next[winning] = turn;
    return { score: minimax(next, turn === MACHINE ? HUMAN : MACHINE).score, move: winning };
  }

  let best = null;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = board.slice();
    next[i] = turn;
    const { score } = minimax(next, turn === MACHINE ? HUMAN : MACHINE);
    const better = best === null || (turn === MACHINE ? score > best.score : score < best.score);
    if (better) best = { score, move: i };
  }
  return best;
}

/** Langkah mesin: menang kalau bisa, blokir kalau perlu, sisanya minimax.
 *  Di antara langkah sama-sama optimal dipilih acak supaya tidak monoton. */
function chooseMachineMove(board) {
  const winning = findWin(board, MACHINE);
  if (winning !== -1) return winning;
  const blocking = findWin(board, HUMAN);
  if (blocking !== -1) return blocking;

  let top = null;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = board.slice();
    next[i] = MACHINE;
    const { score } = minimax(next, HUMAN);
    if (!top || score > top.score) top = { score, moves: [i] };
    else if (score === top.score) top.moves.push(i);
  }
  if (!top) return -1;
  return top.moves[Math.floor(Math.random() * top.moves.length)];
}

/** Pembuka mesin: pojok acak, jalur optimal untuk O. */
function openingMove() {
  const corners = [0, 2, 6, 8];
  return corners[Math.floor(Math.random() * corners.length)];
}

export default function TicTacToe() {
  const [board, setBoard] = useState(emptyBoard);
  const [humanTurn, setHumanTurn] = useState(true);
  const [streak, setStreak] = useState(0);
  const [rounds, setRounds] = useState(1);
  const [machineStarts, setMachineStarts] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [best, submitBest] = useBestScore("tictactoe");

  const outcome = evaluate(board);
  const line = winningLine(board);
  const over = outcome !== null;

  const newRound = useCallback((machineFirst) => {
    setBoard(emptyBoard());
    setLastMove(null);
    setThinking(machineFirst);
    setHumanTurn(!machineFirst);
    setMachineStarts(machineFirst);
    setRounds((n) => n + 1);
  }, []);

  const resetMatch = useCallback(() => {
    setStreak(0);
    newRound(false);
    setRounds(1);
  }, [newRound]);

  /** Hasil ronde: menang memperpanjang streak, seri/kalah mereset. */
  const settle = useCallback(
    (result) => {
      if (result === HUMAN) {
        const next = streak + 1;
        setStreak(next);
        submitBest(next);
      } else if (result) {
        setStreak(0);
      }
    },
    [streak, submitBest]
  );

  // Giliran mesin: jeda pendek biar langkahnya kebaca, lalu minimax.
  useEffect(() => {
    if (humanTurn || over) return undefined;
    const id = setTimeout(() => {
      const move = board.every((cell) => cell === null) ? openingMove() : chooseMachineMove(board);
      if (move === -1) return;
      const next = board.slice();
      next[move] = MACHINE;
      setBoard(next);
      setLastMove(move);
      setHumanTurn(true);
      setThinking(false);
      settle(evaluate(next));
    }, THINK_MS);
    return () => clearTimeout(id);
  }, [board, humanTurn, over, settle]);

  const play = (index) => {
    if (!humanTurn || over || board[index] || thinking) return;
    const next = board.slice();
    next[index] = HUMAN;
    setBoard(next);
    setLastMove(index);
    setHumanTurn(false);
    settle(evaluate(next));
  };

  const statusLabel = over
    ? outcome === HUMAN
      ? "won"
      : outcome === DRAW
        ? "draw"
        : "lost"
    : humanTurn
      ? "your move"
      : "machine";

  const resultLine = over
    ? outcome === HUMAN
      ? "You win — the machine has no answer."
      : outcome === DRAW
        ? "Draw. The machine never blinks."
        : "Machine wins this one."
    : humanTurn
      ? thinking
        ? "Machine opens. Your move."
        : "Your move. Take a square."
      : "Machine is thinking…";

  return (
    <div className="mx-auto w-full max-w-[360px] select-none">
      <GameHud
        title="Tic Tac Toe"
        score={formatScore(streak)}
        best={formatScore(best)}
        extra={statusLabel}
        onRestart={resetMatch}
        restartLabel="Reset"
      />

      <div
        className="playfield grid grid-cols-3 gap-[2px] p-[2px]"
        role="group"
        aria-label="Tic tac toe board"
      >
        {board.map((cell, index) => {
          const isWin = line ? line.includes(index) : false;
          const isLast = lastMove === index;
          const disabled = Boolean(cell) || over || !humanTurn || thinking;
          return (
            <button
              key={index}
              type="button"
              aria-label={`Square ${index + 1}${cell ? `, ${cell}` : ", empty"}`}
              disabled={disabled}
              onClick={() => play(index)}
              className={[
                "relative grid aspect-square place-items-center border transition-colors duration-150",
                "focus:outline-none focus-visible:border-accent-2",
                isWin
                  ? "border-ok bg-ok/15"
                  : cell
                    ? "border-line bg-surface-2"
                    : "border-line bg-surface hover:border-accent hover:bg-surface-2",
              ].join(" ")}
            >
              <span
                className={`font-mono text-[clamp(1.7rem,10vw,2.5rem)] leading-none ${
                  cell === HUMAN ? "text-accent-2" : "text-muted"
                }`}
              >
                {cell || ""}
              </span>
              {isWin ? (
                <span className="absolute bottom-1.5 right-1.5 h-1 w-1 rounded-full bg-ok" />
              ) : isLast ? (
                <span className="absolute bottom-1.5 right-1.5 h-1 w-1 rounded-full bg-accent" />
              ) : null}
            </button>
          );
        })}
      </div>

      <p
        className={`mono-label mt-3 min-h-[1.1em] truncate ${
          over ? (outcome === HUMAN ? "text-ok" : outcome === DRAW ? "text-muted" : "text-danger") : "text-ink"
        }`}
        aria-live="polite"
      >
        {resultLine}
      </p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="mono-label truncate">X is you · O is the machine</p>
        <span className="pill">
          round <span className="text-ink">{formatScore(rounds)}</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => newRound(machineStarts)} className="btn btn-primary flex-1">
          {over ? "Play again" : "New board"}
        </button>
        <button
          type="button"
          onClick={() => newRound(!machineStarts)}
          className="btn btn-ghost flex-1"
          disabled={!over && board.some(Boolean)}
          title="Swap who moves first"
        >
          {machineStarts ? "You open" : "Machine opens"}
        </button>
      </div>
    </div>
  );
}
