"use client";

import dynamic from "next/dynamic";

function GameLoading() {
  return (
    <div className="playfield grid min-h-[320px] place-items-center">
      <p className="mono-label text-[0.6rem]">loading cartridge…</p>
    </div>
  );
}

/**
 * Game dimuat lazy dengan path statis. next/dynamic butuh object literal,
 * jadi opsinya ditulis langsung di tiap panggilan.
 */
export const GAME_COMPONENTS = {
  snake: dynamic(() => import("@/components/games/SnakeGame"), {
    ssr: false,
    loading: GameLoading,
  }),
  "2048": dynamic(() => import("@/components/games/Game2048"), {
    ssr: false,
    loading: GameLoading,
  }),
  tictactoe: dynamic(() => import("@/components/games/TicTacToe"), {
    ssr: false,
    loading: GameLoading,
  }),
  rps: dynamic(() => import("@/components/games/RockPaperScissors"), {
    ssr: false,
    loading: GameLoading,
  }),
  flappy: dynamic(() => import("@/components/games/FlappyBird"), {
    ssr: false,
    loading: GameLoading,
  }),
  tetris: dynamic(() => import("@/components/games/Tetris"), {
    ssr: false,
    loading: GameLoading,
  }),
  memory: dynamic(() => import("@/components/games/MemoryMatch"), {
    ssr: false,
    loading: GameLoading,
  }),
  whack: dynamic(() => import("@/components/games/WhackAMole"), {
    ssr: false,
    loading: GameLoading,
  }),
  wordle: dynamic(() => import("@/components/games/Wordle"), {
    ssr: false,
    loading: GameLoading,
  }),
};

export function getGameComponent(id) {
  return GAME_COMPONENTS[id] ?? null;
}
