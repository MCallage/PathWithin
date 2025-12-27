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
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
          background:
            "radial-gradient(1200px 630px at 20% 10%, rgba(14,165,233,0.20), transparent 60%), linear-gradient(180deg, #070A12 0%, #0B1220 100%)",
          color: "white",
          fontSize: 64,
          fontWeight: 800,
        }}
      >
        Paths Within Blog
      </div>
    ),
    size
  );
}
