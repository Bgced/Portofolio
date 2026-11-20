"use client";

/** Header HUD yang dipakai semua game: judul mono + score/best kanan. */
export default function GameHud({ title, score, best, extra, onRestart, restartLabel = "Restart" }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-ink">
          {title}
        </span>
        {extra ? <span className="pill">{extra}</span> : null}
      </div>

      <div className="flex items-center gap-3 font-mono text-[0.66rem] uppercase tracking-[0.12em]">
        <span className="text-muted">
          score <span className="text-ink">{score}</span>
        </span>
        <span className="text-muted">
          best <span className="text-accent-2">{best}</span>
        </span>
        {onRestart ? (
          <button
            type="button"
            onClick={onRestart}
            className="border border-line px-2 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-ink"
          >
            {restartLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
