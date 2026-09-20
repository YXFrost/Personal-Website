import { ImageResponse } from "next/og";
const size = { width: 1200, height: 630 };
export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "#11110f",
        color: "#eeeae0",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "76px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#eeb95e" }}>
        YN. / A PERSONAL NOTEBOOK
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 88,
          marginTop: 70,
          letterSpacing: -4,
        }}
      >
        I learn by building.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 30,
          color: "#b4b2a7",
          marginTop: 30,
        }}
      >
        Studying, writing & making things.
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #44443c",
          marginTop: 65,
          paddingTop: 24,
          fontSize: 22,
        }}
      >
        WRITING / PROJECTS / PROGRESS
      </div>
    </div>,
    size,
  );
}
