import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

export const alt = "Paths Within Blog Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

function clampText(text: string, max = 140) {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let title = "Blog";
  let description = siteConfig.description;

  try {
    const { meta } = await getPostBySlug(slug);
    title = meta.title || title;
    description = meta.description || description;
  } catch {
  }

  const safeTitle = clampText(title, 80);
  const safeDesc = clampText(description, 160);

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
            "radial-gradient(1200px 630px at 15% 15%, rgba(14,165,233,0.22), transparent 55%), radial-gradient(900px 600px at 85% 25%, rgba(99,102,241,0.18), transparent 55%), linear-gradient(180deg, #070A12 0%, #0B1220 100%)",
          color: "#ffffff",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        {/* Top */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "rgba(14,165,233,0.95)",
              }}
            />
            <div style={{ fontSize: 22, opacity: 0.9 }}>{siteConfig.name}</div>
          </div>

          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -1,
              maxWidth: 1020,
              whiteSpace: "pre-wrap",
            }}
          >
            {safeTitle}
          </div>

          <div
            style={{
              fontSize: 26,
              opacity: 0.85,
              maxWidth: 980,
              lineHeight: 1.35,
              whiteSpace: "pre-wrap",
            }}
          >
            {safeDesc}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            opacity: 0.9,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 18,
              }}
            >
            path-within.vercel.app
            </span>
            <span
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 18,
              }}
            >
              Blog
            </span>
          </div>

          <div style={{ fontSize: 18, opacity: 0.75 }}>
            {new URL(siteConfig.url).host}
          </div>
        </div>
      </div>
    ),
    size
  );
}
