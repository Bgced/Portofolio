"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import GameHud from "@/components/games/GameHud";
import { useBestScore, formatScore } from "@/lib/scores";

const ROWS = 6;
const COLS = 5;

const ANSWERS = [
  "ABOUT", "ABOVE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN", "AGENT",
  "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIEN", "ALIGN", "ALIVE", "ALLOW", "ALONE",
  "ALONG", "ALTER", "AMBER", "AMONG", "ANGEL", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE",
  "APPLY", "ARENA", "ARGUE", "ARISE", "ARMOR", "AROMA", "ARRAY", "ARROW", "ASIDE", "ASSET",
  "AUDIO", "AUDIT", "AVOID", "AWARD", "AWARE", "BACON", "BADGE", "BASIC", "BASIL", "BEACH",
  "BEARD", "BEAST", "BEGIN", "BEING", "BELLY", "BELOW", "BENCH", "BERRY", "BIRTH", "BLACK",
  "BLADE", "BLAME", "BLANK", "BLAST", "BLAZE", "BLEND", "BLIND", "BLINK", "BLOCK", "BLOOM",
  "BOARD", "BONUS", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND", "BRASS", "BRAVE", "BREAD",
  "BREAK", "BREED", "BRICK", "BRIDE", "BRIEF", "BRING", "BROAD", "BROKE", "BROOK", "BROWN",
  "BRUSH", "BUILD", "BUILT", "BUNCH", "BURST", "CABIN", "CABLE", "CAMEL", "CANAL", "CANDY",
  "CANOE", "CARGO", "CARRY", "CARVE", "CATCH", "CAUSE", "CHAIN", "CHAIR", "CHALK", "CHARM",
  "CHART", "CHASE", "CHEAP", "CHEAT", "CHECK", "CHEEK", "CHEER", "CHESS", "CHEST", "CHIEF",
  "CHILD", "CHILL", "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLERK", "CLICK",
  "CLIFF", "CLIMB", "CLOCK", "CLOSE", "CLOTH", "CLOUD", "COACH", "COAST", "COCOA", "COMET",
  "CORAL", "COUCH", "COUNT", "COURT", "COVER", "CRAFT", "CRANE", "CRASH", "CRAZY", "CREAM",
  "CREEK", "CRISP", "CROSS", "CROWD", "CROWN", "CRUEL", "CRUSH", "CRUST", "CURRY", "CURVE",
  "CYCLE", "DAILY", "DAIRY", "DANCE", "DEALT", "DEATH", "DEBUT", "DELAY", "DEPTH", "DIARY",
  "DIRTY", "DOUBT", "DOZEN", "DRAFT", "DRAIN", "DRAMA", "DREAM", "DRESS", "DRIFT", "DRILL",
  "DRINK", "DRIVE", "DROVE", "EAGER", "EAGLE", "EARLY", "EARTH", "EIGHT", "ELITE", "EMPTY",
  "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "ESSAY", "EVENT", "EVERY", "EXACT",
  "EXIST", "EXTRA", "FAINT", "FAITH", "FALSE", "FAULT", "FAVOR", "FEAST", "FENCE", "FERRY",
  "FETCH", "FEVER", "FIBER", "FIELD", "FIGHT", "FINAL", "FIRST", "FLAME", "FLASH", "FLEET",
  "FLESH", "FLOAT", "FLOCK", "FLOOD", "FLOOR", "FLOUR", "FLUID", "FOCUS", "FORCE", "FORGE",
  "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRESH", "FRONT", "FROST", "FROWN", "FRUIT",
  "FULLY", "FUNNY", "GHOST", "GIANT", "GIVEN", "GLASS", "GLAZE", "GLEAM", "GLIDE", "GLOBE",
  "GLORY", "GLOVE", "GOING", "GRACE", "GRADE", "GRAIN", "GRAND", "GRANT", "GRAPE", "GRAPH",
  "GRASP", "GRASS", "GRAVE", "GREAT", "GREEN", "GREET", "GRIEF", "GRILL", "GRIND", "GROUP",
  "GROVE", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "GUILD", "GUILT", "HABIT", "HAPPY",
  "HARSH", "HAVEN", "HEART", "HEAVY", "HEDGE", "HERON", "HONEY", "HONOR", "HORSE", "HOTEL",
  "HOUND", "HOUSE", "HUMAN", "HUMOR", "IDEAL", "IMAGE", "IMPLY", "INDEX", "INNER", "INPUT",
  "ISSUE", "IVORY", "JELLY", "JEWEL", "JOINT", "JUDGE", "JUICE", "KAYAK", "KNEEL", "KNIFE",
  "KNOCK", "KNOWN", "LABEL", "LARGE", "LASER", "LATER", "LAUGH", "LAYER", "LEARN", "LEASE",
  "LEAST", "LEAVE", "LEGAL", "LEVEL", "LIGHT", "LIMIT", "LINEN", "LIVER", "LOCAL", "LODGE",
  "LOGIC", "LOOSE", "LOVER", "LOWER", "LOYAL", "LUCKY", "LUNAR", "LUNCH", "MAGIC", "MAJOR",
  "MAKER", "MANGO", "MAPLE", "MARCH", "MATCH", "MAYBE", "MAYOR", "MEDAL", "MEDIA", "MERCY",
  "MERGE", "MERIT", "MERRY", "METAL", "MIGHT", "MINOR", "MIXED", "MODEL", "MONEY", "MONTH",
  "MORAL", "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVIE", "MUSIC", "NAIVE", "NASTY", "NAVAL",
  "NERVE", "NEVER", "NEWLY", "NIGHT", "NOBLE", "NOISE", "NORTH", "NOVEL", "NURSE", "OASIS",
  "OCEAN", "OFFER", "OFTEN", "OLIVE", "ONION", "OPERA", "ORBIT", "ORDER", "OTHER", "OUGHT",
  "OUTER", "OWNER", "PAINT", "PANEL", "PANIC", "PAPER", "PARTY", "PASTA", "PATCH", "PAUSE",
  "PEACE", "PEARL", "PHASE", "PHONE", "PHOTO", "PIANO", "PIECE", "PILOT", "PITCH", "PIXEL",
  "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "PLAZA", "PLEAD", "POINT", "POLAR", "PORCH",
  "POUND", "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF",
  "PROUD", "PROVE", "PULSE", "PUPIL", "QUEEN", "QUERY", "QUEST", "QUICK", "QUIET", "QUITE",
  "QUOTE", "RADAR", "RAISE", "RALLY", "RANCH", "RANGE", "RAPID", "RATIO", "REACH", "REACT",
  "READY", "REALM", "RELAX", "REPLY", "RIDER", "RIDGE", "RIGHT", "RIGID", "RINSE", "RISKY",
  "RIVAL", "RIVER", "ROAST", "ROBIN", "ROBOT", "ROCKY", "ROUGH", "ROUND", "ROUTE", "ROYAL",
  "RUGBY", "RULER", "RURAL", "SAINT", "SALAD", "SALON", "SALSA", "SANDY", "SAUCE", "SCALE",
  "SCARE", "SCARF", "SCENE", "SCENT", "SCOPE", "SCORE", "SCOUT", "SCRAP", "SCREW", "SEIZE",
  "SENSE", "SERVE", "SEVEN", "SHADE", "SHAKE", "SHALL", "SHAME", "SHAPE", "SHARE", "SHARK",
  "SHARP", "SHEEP", "SHEER", "SHEET", "SHELF", "SHELL", "SHIFT", "SHINE", "SHINY", "SHIRT",
  "SHOCK", "SHOOT", "SHORE", "SHORT", "SHOUT", "SHOWN", "SIGHT", "SINCE", "SKILL", "SLATE",
  "SLEEP", "SLICE", "SLIDE", "SLOPE", "SMALL", "SMART", "SMELL", "SMILE", "SMOKE", "SNACK",
  "SNAKE", "SNEAK", "SNOWY", "SOLAR", "SOLID", "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE",
  "SPARE", "SPARK", "SPEAK", "SPEED", "SPELL", "SPEND", "SPICE", "SPICY", "SPIKE", "SPILL",
  "SPINE", "SPITE", "SPLIT", "SPOKE", "SPOON", "SPORT", "SPRAY", "STACK", "STAFF", "STAGE",
  "STAIN", "STAIR", "STAKE", "STALE", "STALK", "STAMP", "STAND", "STARE", "STARK", "START",
  "STATE", "STEAK", "STEAL", "STEAM", "STEEL", "STEEP", "STEER", "STICK", "STIFF", "STILL",
  "STING", "STOCK", "STONE", "STOOD", "STOOL", "STORE", "STORM", "STORY", "STOVE", "STRAP",
  "STRAW", "STRAY", "STRIP", "STUCK", "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE", "SUNNY",
  "SUPER", "SURGE", "SWEAR", "SWEAT", "SWEEP", "SWEET", "SWELL", "SWEPT", "SWIFT", "SWING",
  "SWORD", "TABLE", "TAKEN", "TASTE", "TEACH", "TEETH", "TEMPO", "THANK", "THEFT", "THEIR",
  "THERE", "THESE", "THICK", "THING", "THINK", "THIRD", "THORN", "THOSE", "THREE", "THREW",
  "THROW", "THUMB", "TIGER", "TIGHT", "TIMER", "TIRED", "TITLE", "TOAST", "TODAY", "TOKEN",
  "TOTAL", "TOUCH", "TOUGH", "TOWEL", "TOWER", "TOXIC", "TRACE", "TRACK", "TRADE", "TRAIL",
  "TRAIN", "TRAIT", "TREAT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TROOP", "TRUCK",
  "TRULY", "TRUNK", "TRUST", "TRUTH", "TULIP", "TUTOR", "TWICE", "TWIST", "ULTRA", "UNCLE",
  "UNDER", "UNION", "UNITE", "UNITY", "UNTIL", "UPPER", "UPSET", "URBAN", "USAGE", "USUAL",
  "VAGUE", "VALID", "VALUE", "VAULT", "VENOM", "VERGE", "VERSE", "VIDEO", "VIRAL", "VIRUS",
  "VISIT", "VITAL", "VIVID", "VOCAL", "VOICE", "WAGON", "WAIST", "WASTE", "WATCH", "WATER",
  "WEARY", "WEAVE", "WEDGE", "WEIGH", "WEIRD", "WHALE", "WHEAT", "WHEEL", "WHERE", "WHICH",
  "WHILE", "WHITE", "WHOLE", "WHOSE", "WIDEN", "WIDOW", "WIDTH", "WINDY", "WITCH", "WOMAN",
  "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOUND", "WOVEN", "WRECK", "WRIST", "WRITE",
  "WRONG", "WROTE", "YACHT", "YEARN", "YEAST", "YIELD", "YOUNG", "YOUTH", "ZEBRA", "ZESTY",
];

const KEYBOARD = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
];

const RANK = { absent: 1, present: 2, correct: 3 };

const TILE_CLASS = {
  correct: "border-ok/40 bg-ok/20 text-ok",
  present: "border-accent/40 bg-accent/20 text-accent-2",
  absent: "border-line bg-surface-2 text-muted",
  filled: "border-muted/60 bg-surface text-ink",
  empty: "border-line bg-surface",
};

const KEY_CLASS = {
  correct: "border-ok/40 bg-ok/20 text-ok",
  present: "border-accent/40 bg-accent/20 text-accent-2",
  absent: "border-line bg-surface-2 text-muted",
  idle: "border-line bg-surface text-ink hover:bg-surface-2",
};

/** Standard Wordle scoring: exact matches first, remaining letters consumed from a pool. */
function evaluateGuess(guess, answer) {
  const marks = Array(COLS).fill("absent");
  const pool = answer.split("");

  for (let i = 0; i < COLS; i += 1) {
    if (guess[i] === answer[i]) {
      marks[i] = "correct";
      pool[i] = "";
    }
  }

  for (let i = 0; i < COLS; i += 1) {
    if (marks[i] === "correct") continue;
    const at = pool.indexOf(guess[i]);
    if (at !== -1) {
      marks[i] = "present";
      pool[at] = "";
    }
  }

  return marks;
}

function pickWord() {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
}

export default function Wordle() {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [keys, setKeys] = useState({});
  const [notice, setNotice] = useState("");
  const [streak, setStreak] = useState(0);
  const [best, submitBest] = useBestScore("wordle");

  useEffect(() => {
    setAnswer(pickWord());
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 1500);
    return () => clearTimeout(timer);
  }, [notice]);

  const submit = useCallback(() => {
    if (!answer || status !== "playing") return;
    if (current.length !== COLS) {
      setNotice("Not enough letters");
      return;
    }

    const marks = evaluateGuess(current, answer);
    const nextGuesses = [...guesses, current];

    setKeys((prev) => {
      const next = { ...prev };
      current.split("").forEach((letter, i) => {
        if ((RANK[marks[i]] || 0) > (RANK[next[letter]] || 0)) next[letter] = marks[i];
      });
      return next;
    });

    setGuesses(nextGuesses);
    setCurrent("");

    if (current === answer) {
      setStatus("won");
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      submitBest(nextStreak);
    } else if (nextGuesses.length >= ROWS) {
      setStatus("lost");
      setStreak(0);
    }
  }, [answer, current, guesses, status, streak, submitBest]);

  const press = useCallback(
    (key) => {
      if (status !== "playing") return;
      if (key === "ENTER") {
        submit();
      } else if (key === "BACK") {
        setCurrent((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key)) {
        setCurrent((prev) => (prev.length < COLS ? prev + key : prev));
      }
    },
    [status, submit]
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toUpperCase();
      if (key === "ENTER") {
        event.preventDefault();
        press("ENTER");
      } else if (key === "BACKSPACE") {
        event.preventDefault();
        press("BACK");
      } else if (/^[A-Z]$/.test(key)) {
        press(key);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [press]);

  const restart = () => {
    setAnswer(pickWord());
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
    setKeys({});
    setNotice("");
  };

  const rows = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, r) => {
        if (r < guesses.length) {
          return { letters: guesses[r].split(""), marks: evaluateGuess(guesses[r], answer) };
        }
        if (r === guesses.length && status === "playing") {
          return {
            letters: Array.from({ length: COLS }, (_, c) => current[c] || ""),
            marks: null,
          };
        }
        return { letters: Array(COLS).fill(""), marks: null };
      }),
    [guesses, current, answer, status]
  );

  return (
    <div className="mx-auto w-full max-w-[340px] select-none">
      <GameHud
        title="Wordle"
        score={formatScore(streak)}
        best={formatScore(best)}
        extra={`${guesses.length}/6`}
        onRestart={restart}
      />

      <div className="relative">
        <div className="playfield relative p-2" role="grid" aria-label="Wordle board">
          <div className="grid grid-rows-6 gap-1.5">
            {rows.map((row, r) => (
              <div key={r} className="grid grid-cols-5 gap-1.5" role="row">
                {row.letters.map((letter, c) => {
                  const variant = row.marks ? row.marks[c] : letter ? "filled" : "empty";
                  return (
                    <div
                      key={c}
                      role="gridcell"
                      className={`flex aspect-square items-center justify-center rounded-[4px] border font-mono text-lg font-semibold uppercase transition-colors ${TILE_CLASS[variant]}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div
            className={`pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center transition-opacity duration-150 ${
              notice ? "opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            <span className="inline-block border border-line bg-surface-2 px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink">
              {notice || "\u00a0"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1.5">
          {KEYBOARD.map((row, r) => (
            <div key={r} className="flex justify-center gap-1.5">
              {row.map((key) => {
                const wide = key === "ENTER" || key === "BACK";
                const variant = wide ? "idle" : keys[key] || "idle";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => press(key)}
                    disabled={status !== "playing"}
                    aria-label={key === "BACK" ? "Backspace" : key === "ENTER" ? "Enter guess" : key}
                    className={`h-10 min-w-0 rounded-[4px] border font-mono uppercase transition-colors disabled:opacity-50 ${
                      wide ? "flex-[1.7] text-[0.58rem] tracking-[0.06em]" : "flex-1 text-[0.66rem]"
                    } ${KEY_CLASS[variant]}`}
                  >
                    {key === "BACK" ? "DEL" : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {status !== "playing" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-line bg-canvas/95 p-4 text-center">
            <span className="mono-label">{status === "won" ? "solved" : "out of turns"}</span>
            <span className="font-mono text-xl font-semibold uppercase tracking-[0.22em] text-ink">
              {answer}
            </span>
            <span className="text-[0.78rem] text-muted">
              streak <span className="text-ink">{formatScore(streak)}</span>
              {"  ·  "}
              best <span className="text-accent-2">{formatScore(best)}</span>
            </span>
            <button type="button" onClick={restart} className="btn btn-primary">
              Play again
            </button>
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-center text-[0.64rem] text-muted">
        Any 5-letter word is accepted as a guess.
      </p>
    </div>
  );
}
