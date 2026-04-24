import { ImageResponse } from "next/og";

export const alt = "agentcv — Twój Agent CV, który pisze CV dostające rozmowy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const bg = "#F5F1E8";
  const ink = "#0A0E1A";
  const saffron = "#E8A628";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 88px",
          background: bg,
          color: ink,
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: saffron,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: saffron }} />
          Agent Pracuś online
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 82,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            maxWidth: 1024,
          }}
        >
          <span>Twój agent pisze</span>
          <span>CV, które dostaje</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                background: saffron,
                padding: "0 16px",
                lineHeight: 1,
                paddingTop: 8,
                paddingBottom: 14,
                borderRadius: 8,
              }}
            >
              rozmowy
            </span>
            <span>.</span>
          </span>
        </div>

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
              fontSize: 42,
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
                background: saffron,
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
              gap: 10,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.55,
            }}
          >
            <span>5 MIN</span>
            <span>·</span>
            <span>26 BRANŻ PL</span>
            <span>·</span>
            <span>RODO</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
