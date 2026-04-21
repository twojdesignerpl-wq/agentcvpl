import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "agentcv — Pracuś AI").slice(0, 120);
  const eyebrow = (searchParams.get("eyebrow") ?? "agentcv.pl").slice(0, 60);
  const tone = searchParams.get("tone") ?? "cream"; // cream | ink

  const isInk = tone === "ink";
  const bg = isInk ? "#0A0E1A" : "#F5F1E8";
  const fg = isInk ? "#F5F1E8" : "#0A0E1A";
  const accent = "#E8A628"; // saffron

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 88px",
          background: bg,
          color: fg,
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: accent,
            }}
          />
          {eyebrow}
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            maxWidth: 1024,
          }}
        >
          {title}
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            agentcv
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: accent,
                marginLeft: 4,
              }}
            />
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.55,
              }}
            >
              .pl
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.55,
            }}
          >
            <span>CV · AI · PL · RODO</span>
          </div>
        </div>

        {/* decorative underline */}
        <div
          style={{
            position: "absolute",
            top: 305,
            left: 88,
            width: 96,
            height: 6,
            background: accent,
          }}
        />
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
