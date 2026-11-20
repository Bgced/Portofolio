/**
 * Cangkang kartu mengambang: shell kaca (padding 6px) + surface cekung.
 * Tanpa hook, tanpa akses window — aman dirender di server.
 *
 * - `as`      : tag luar, default div. Buat kartu yang seluruhnya klik, pakai
 *               `as="button"` + `interactive` supaya lift-nya jujur.
 * - `glow`    : haze sudut. Dosis maksimal 1-2 per halaman.
 * - `surfaceClassName` : layout/padding tambahan untuk bidang dalam.
 */
export default function FloatingCard({
  as: Tag = "div",
  className = "",
  surfaceClassName = "",
  glow = false,
  interactive = false,
  children,
  ...rest
}) {
  return (
    <Tag
      className={`card-shell${interactive ? " card-lift" : ""}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {glow ? <span aria-hidden="true" className="card-glow" /> : null}
      <div className={`card-surface${surfaceClassName ? ` ${surfaceClassName}` : ""}`}>{children}</div>
    </Tag>
  );
}
