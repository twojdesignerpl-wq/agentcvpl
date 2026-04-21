/**
 * CobaltDecorativeBlobs — autorskie organic shapes pinned to A4 corners.
 * Renderowane na poziomie cv-page (przez PageA4 decorations prop), nie w cv-body.
 * Identyczne paths w preview i w PDF Puppeteer (parity).
 */
export function CobaltDecorativeBlobs() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Top-right cluster — kotwiczony do top-right corner A4 */}
      <svg
        viewBox="0 0 200 200"
        className="absolute right-0 top-0"
        style={{ width: "85mm", height: "85mm", transform: "translate(18%, -22%)" }}
      >
        <path
          d="M150 18 C 175 28, 192 50, 188 80 C 184 110, 158 124, 138 116 C 116 108, 108 84, 118 60 C 124 44, 138 22, 150 18 Z"
          fill="var(--cv-blob-blue)"
          opacity="0.92"
        />
        <path
          d="M82 32 C 110 28, 138 46, 144 70 C 148 92, 130 108, 108 102 C 84 96, 70 78, 70 60 C 70 48, 76 36, 82 32 Z"
          fill="var(--cv-blob-pink)"
          opacity="0.88"
        />
        <path
          d="M178 92 C 194 100, 200 122, 188 138 C 174 154, 152 150, 144 132 C 138 116, 152 96, 168 92 C 172 91, 175 91, 178 92 Z"
          fill="var(--cv-blob-navy)"
          opacity="0.95"
        />
      </svg>

      {/* Bottom-left cluster */}
      <svg
        viewBox="0 0 200 200"
        className="absolute bottom-0 left-0"
        style={{ width: "78mm", height: "78mm", transform: "translate(-30%, 32%)" }}
      >
        <path
          d="M30 110 C 22 86, 36 60, 64 56 C 92 52, 116 70, 118 96 C 120 124, 100 144, 72 142 C 50 140, 36 128, 30 110 Z"
          fill="var(--cv-blob-pink)"
          opacity="0.86"
        />
        <path
          d="M104 138 C 130 128, 158 138, 162 162 C 166 184, 144 200, 122 192 C 98 184, 88 162, 96 148 C 98 144, 100 140, 104 138 Z"
          fill="var(--cv-blob-navy)"
          opacity="0.95"
        />
        <path
          d="M52 168 C 70 164, 90 178, 88 196 C 86 212, 64 218, 50 208 C 36 198, 38 178, 50 170 C 51 169, 51 168, 52 168 Z"
          fill="var(--cv-blob-blue)"
          opacity="0.9"
        />
      </svg>

      {/* Bottom-right accent */}
      <svg
        viewBox="0 0 200 200"
        className="absolute bottom-0 right-0"
        style={{ width: "82mm", height: "82mm", transform: "translate(34%, 34%)" }}
      >
        <path
          d="M138 78 C 168 70, 196 90, 194 122 C 192 154, 162 174, 134 168 C 104 162, 92 132, 104 108 C 112 92, 124 82, 138 78 Z"
          fill="var(--cv-blob-navy)"
          opacity="0.95"
        />
        <path
          d="M70 130 C 96 124, 122 142, 124 168 C 126 192, 102 208, 78 200 C 54 192, 46 168, 56 148 C 60 140, 64 134, 70 130 Z"
          fill="var(--cv-blob-pink)"
          opacity="0.88"
        />
      </svg>
    </div>
  );
}
