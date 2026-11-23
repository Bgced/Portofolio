import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Cedric Kilian — Front-End Developer Portfolio";

export default function OpengraphImage() {
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
              fontSize: 20,
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
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
            Cedric Kilian
          </div>
          <div style={{ fontSize: 42, color: "#F5A524", marginTop: 16 }}>
            Front-End Developer
          </div>
          <div
            style={{
              fontSize: 25,
              color: "#9AA0A6",
              marginTop: 22,
              maxWidth: "840px",
              lineHeight: 1.35,
            }}
          >
            Front-end yang ngerti sirkuit. Web yang jalan di HP murah, plus tool interaktif buat konsep elektro.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 21, color: "#6B7178" }}>
          Electrical Engineering · UNY
        </div>
      </div>
    ),
    { ...size }
  );
}