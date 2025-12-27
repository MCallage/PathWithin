import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Paths Within Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(1200px 630px at 20% 10%, rgba(14,165,233,0.20), transparent 60%), radial-gradient(1000px 600px at 85% 30%, rgba(99,102,241,0.18), transparent 55%), linear-gradient(180deg, #070A12 0%, #0B1220 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 22, opacity: 0.9 }}>Paths Within</div>

          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
            Blog
          </div>

          <div style={{ fontSize: 28, opacity: 0.85, maxWidth: 900 }}>
            Evidence-based reflections for self-knowledge and emotional clarity.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            fontSize: 18,
            opacity: 0.85,
          }}
        >
          <span style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" }}>
            Anxiety
          </span>
          <span style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" }}>
            Mindfulness
          </span>
          <span style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" }}>
            Habits
          </span>
          <span style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" }}>
            Self-knowledge
          </span>
        </div>
      </div>
    ),
    size
  );
}
