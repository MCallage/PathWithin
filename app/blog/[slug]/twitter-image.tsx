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

function clampText(text: string, max = 110) {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let title = "Paths Within Blog";
  try {
    const { meta } = await getPostBySlug(slug);
    title = meta.title || title;
  } catch {}

  const safeTitle = clampText(title, 100);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(1200px 630px at 18% 20%, rgba(14,165,233,0.22), transparent 55%), linear-gradient(180deg, #070A12 0%, #0B1220 100%)",
          color: "#ffffff",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 22, opacity: 0.85 }}>{siteConfig.name}</div>

          <div
            style={{
              fontSize: 64,
              fontWeight: 850,
              lineHeight: 1.08,
              letterSpacing: -1,
              maxWidth: 1050,
              whiteSpace: "pre-wrap",
            }}
          >
            {safeTitle}
          </div>

          <div style={{ fontSize: 22, opacity: 0.75 }}>path-within.vercel.app/blog</div>
        </div>
      </div>
    ),
    size
  );
}
