import { ImageResponse } from "next/og";
import { CATALOG_BY_ID } from "@/lib/games";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Cedric Kilian — playable cartridge";

export default function Image({ params }) {
  const item = CATALOG_BY_ID[params?.slug] ?? {
    title: "Play",
    code: "CEKAEL",
    kind: "CARTRIDGE",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0C0E",
          color: "#F2F1ED",
          padding: "76px 84px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #F5A524",
              color: "#F5A524",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            CK
          </div>
          <div style={{ fontSize: 24, color: "#9AA0A6", letterSpacing: "0.14em" }}>
            cekael.vercel.app
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#F5A524", letterSpacing: "0.12em" }}>
            {item.code} · {item.kind}
          </div>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14, letterSpacing: "-0.02em" }}>
            {item.title}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#6B7178" }}>
          Play it on cekael.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}