import { ImageResponse } from "next/og";

export const alt = "MoltLlama - DeFi Data for Task-Executing Agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#27173b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 16 }}>🦞</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            background: "linear-gradient(135deg, #f5217f, #9775fb)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 24,
          }}
        >
          MoltLlama
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 500,
          }}
        >
          DeFi Data for Task-Executing Agents
        </div>
      </div>
    ),
    { ...size },
  );
}
