import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = "Portfolio OS — interactive macOS-style portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #1e2a4a 0%, #141428 60%, #0d0d1a 100%)",
        }}
      >
        <div style={{ fontSize: 28, color: "#9fb3ff", letterSpacing: 6 }}>◈ PORTFOLIO OS</div>
        <div style={{ fontSize: 84, color: "white", fontStyle: "italic", fontWeight: 800 }}>{SITE.name}</div>
        <div style={{ fontSize: 30, color: "#a7f3d0" }}>{SITE.role}</div>
      </div>
    ),
    { ...size }
  );
}
