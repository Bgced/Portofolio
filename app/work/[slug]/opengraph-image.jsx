import { ImageResponse } from "next/og";
import { PROJECTS_BY_SLUG } from "@/lib/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Cedric Kilian — project case study";

export default function Image({ params }) {
  const project = PROJECTS_BY_SLUG[params?.slug] ?? {
    title: "Project",
    code: "WORK",
    year: "",
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
            {project.code}
            {project.year ? ` · ${project.year}` : ""}
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.08,
              marginTop: 14,
              letterSpacing: "-0.02em",
              maxWidth: "960px",
            }}
          >
            {project.title}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#6B7178" }}>
          Cedric Kilian · case study
        </div>
      </div>
    ),
    { ...size }
  );
}