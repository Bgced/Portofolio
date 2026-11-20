/**
 * Katalog kartrid: 9 game + 4 tool. Semua yang ada di sini beneran jalan.
 * Kode C-xx buat game, T-xx buat tool. `accent` dipakai buat ikon tile.
 */
export const GAMES = [
  {
    id: "snake",
    code: "C-01",
    kind: "GAME",
    title: "Snake",
    desc: "One arena, one snake. Eat, grow, and stay off your own tail.",
    hint: "Arrow keys / swipe",
    icon: "snake",
    best: true,
  },
  {
    id: "2048",
    code: "C-02",
    kind: "GAME",
    title: "2048",
    desc: "Merge matching tiles until one of them reads 2048.",
    hint: "Arrow keys / swipe",
    icon: "tiles",
    best: true,
  },
  {
    id: "tictactoe",
    code: "C-03",
    kind: "GAME",
    title: "Tic Tac Toe",
    desc: "Nine squares, one opponent. Get three in a line before it does.",
    hint: "Click a cell",
    icon: "grid",
    best: false,
  },
  {
    id: "rps",
    code: "C-04",
    kind: "GAME",
    title: "Rock Paper Scissors",
    desc: "Five rounds of rock, paper, scissors against the machine.",
    hint: "Pick a hand",
    icon: "hand",
    best: true,
  },
  {
    id: "flappy",
    code: "C-05",
    kind: "GAME",
    title: "Flappy Bird",
    desc: "One button, endless pipes. Time the taps and keep the bird up.",
    hint: "Space / tap",
    icon: "bird",
    best: true,
  },
  {
    id: "tetris",
    code: "C-06",
    kind: "GAME",
    title: "Tetris",
    desc: "Falling blocks, tight gaps. Clear lines before the stack hits the top.",
    hint: "Arrows, space to drop",
    icon: "blocks",
    best: true,
  },
  {
    id: "memory",
    code: "C-07",
    kind: "GAME",
    title: "Memory Match",
    desc: "Sixteen cards, eight pairs. Flip two at a time and remember where they were.",
    hint: "Click to flip",
    icon: "cards",
    best: true,
  },
  {
    id: "whack",
    code: "C-08",
    kind: "GAME",
    title: "Whack-a-Mole",
    desc: "Thirty seconds, nine holes. Hit the mole before it ducks.",
    hint: "Click the mole",
    icon: "hammer",
    best: true,
  },
  {
    id: "wordle",
    code: "C-09",
    kind: "GAME",
    title: "Wordle",
    desc: "Six tries to guess a five-letter word. Green means right place.",
    hint: "Type, then Enter",
    icon: "letters",
    best: true,
  },
];

export const TOOLS = [
  {
    id: "qr",
    code: "T-01",
    kind: "TOOL",
    title: "QR Studio",
    desc: "QR codes for links, Wi-Fi, WhatsApp, and greeting cards.",
    icon: "qr",
    best: false,
  },
  {
    id: "calc",
    code: "T-02",
    kind: "TOOL",
    title: "Calculator",
    desc: "A clean keypad for everyday arithmetic.",
    icon: "calc",
    best: false,
  },
  {
    id: "bmi",
    code: "T-03",
    kind: "TOOL",
    title: "BMI Calculator",
    desc: "Body mass index plus your healthy weight range.",
    icon: "bmi",
    best: false,
  },
  {
    id: "ai",
    code: "T-04",
    kind: "TOOL",
    title: "Cekael AI",
    desc: "Ask about the profile, the projects, or the stack.",
    icon: "ai",
    best: false,
  },
];

export const CATALOG = [...GAMES, ...TOOLS];

export const CATALOG_BY_ID = Object.fromEntries(CATALOG.map((item) => [item.id, item]));

export const COUNT = {
  games: GAMES.length,
  tools: TOOLS.length,
  titles: CATALOG.length,
};
