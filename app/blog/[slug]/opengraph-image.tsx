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
  } catch {

  }

  return url;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let title = "Blog";
  let description = siteConfig.description;
  let cover: string | undefined;

  try {
    const { meta } = await getPostBySlug(slug);
    title = meta.title || title;
    description = meta.description || description;
    cover = toOgCover(meta.cover);
  } catch {
    // keep fallbacks
  }

  const safeTitle = clampText(title, 84);
  const safeDesc = clampText(description, 170);

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
                "radial-gradient(1200px 630px at 15% 15%, rgba(14,165,233,0.22), transparent 55%), radial-gradient(900px 600px at 85% 25%, rgba(99,102,241,0.18), transparent 55%), linear-gradient(180deg, #070A12 0%, #0B1220 100%)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(7,10,18,0.20) 0%, rgba(7,10,18,0.55) 45%, rgba(7,10,18,0.78) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 28,
          }}
        >
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
              <div style={{ fontSize: 22, opacity: 0.92 }}>
                {siteConfig.name}
              </div>
            </div>

            <div
              style={{
                fontSize: 62,
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

            <div
              style={{
                fontSize: 26,
                opacity: 0.92,
                maxWidth: 980,
                lineHeight: 1.35,
                textShadow: "0 10px 24px rgba(0,0,0,0.30)",
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
              gap: 18,
            }}
          >
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(0,0,0,0.18)",
                  fontSize: 18,
                  backdropFilter: "blur(6px)",
                }}
              >
                path-within.vercel.app
              </span>

              <span
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(0,0,0,0.18)",
                  fontSize: 18,
                  backdropFilter: "blur(6px)",
                }}
              >
                Blog
              </span>
            </div>

            <div style={{ fontSize: 18, opacity: 0.8 }}>
              {new URL(siteConfig.url).host}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
