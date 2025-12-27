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

function clampText(text: string, max = 120) {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function toOgCover(url?: string) {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.hostname.includes("images.unsplash.com")) {
      if (!u.searchParams.has("w")) u.searchParams.set("w", "1200");
      if (!u.searchParams.has("q")) u.searchParams.set("q", "80");
      if (!u.searchParams.has("fit")) u.searchParams.set("fit", "crop");
      return u.toString();
    }
  } catch {}
  return url;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let title = "Paths Within Blog";
  let cover: string | undefined;

  try {
    const { meta } = await getPostBySlug(slug);
    title = meta.title || title;
    cover = toOgCover(meta.cover);
  } catch {}

  const safeTitle = clampText(title, 110);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          padding: 64,
          color: "#fff",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
          overflow: "hidden",
          background: "#0B1220",
          alignItems: "flex-end",
        }}
      >
        {cover ? (
          <img
            src={cover}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(1200px 630px at 18% 20%, rgba(14,165,233,0.22), transparent 55%), linear-gradient(180deg, #070A12 0%, #0B1220 100%)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(7,10,18,0.12) 0%, rgba(7,10,18,0.45) 55%, rgba(7,10,18,0.80) 100%)",
          }}
        />

        <div style={{ position: "relative", width: "100%" }}>
          <div style={{ fontSize: 20, opacity: 0.9 }}>{siteConfig.name}</div>
          <div
            style={{
              marginTop: 14,
              fontSize: 64,
              fontWeight: 850,
              lineHeight: 1.08,
              letterSpacing: -1,
              maxWidth: 1050,
              textShadow: "0 12px 30px rgba(0,0,0,0.35)",
              whiteSpace: "pre-wrap",
            }}
          >
            {safeTitle}
          </div>
          <div style={{ marginTop: 16, fontSize: 22, opacity: 0.8 }}>
            path-within.vercel.app/blog
          </div>
        </div>
      </div>
    ),
    size
  );
}
