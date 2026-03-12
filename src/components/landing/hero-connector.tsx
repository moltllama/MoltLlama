"use client";

/**
 * SVG connector: 7 lines from horizontal data rows (left) converge through
 * the "MoltLlama MCP" chip module, then fan out tight to the install snippet (right).
 * Crab emojis animate along each path: left → wiggle at center → right → back.
 */

const LINES = [
  {
    id: "conn-1",
    d: "M 0,31 C 15,31 25,130 35,222 C 48,216 58,228 70,220 C 82,228 92,216 105,222 C 115,222 125,204 140,200",
    dur: "10s",
    begin: "0s",
  },
  {
    id: "conn-2",
    d: "M 0,97 C 15,97 28,170 35,228 C 48,222 58,234 70,226 C 82,234 92,222 105,228 C 115,228 125,218 140,215",
    dur: "13s",
    begin: "-4s",
  },
  {
    id: "conn-3",
    d: "M 0,164 C 15,164 28,200 35,234 C 48,228 58,240 70,232 C 82,240 92,228 105,234 C 115,234 125,230 140,228",
    dur: "9s",
    begin: "-2s",
  },
  {
    id: "conn-4",
    d: "M 0,230 L 35,240 C 48,233 58,247 70,239 C 82,247 92,233 105,240 L 140,240",
    dur: "8s",
    begin: "-6s",
  },
  {
    id: "conn-5",
    d: "M 0,296 C 15,296 28,280 35,248 C 48,254 58,240 70,248 C 82,240 92,254 105,248 C 115,248 125,252 140,252",
    dur: "11s",
    begin: "-7s",
  },
  {
    id: "conn-6",
    d: "M 0,363 C 15,363 28,310 35,254 C 48,260 58,246 70,254 C 82,246 92,260 105,254 C 115,254 125,262 140,265",
    dur: "12s",
    begin: "-3s",
  },
  {
    id: "conn-7",
    d: "M 0,429 C 15,429 25,350 35,258 C 48,264 58,250 70,258 C 82,250 92,264 105,258 C 115,258 125,276 140,280",
    dur: "9.5s",
    begin: "-5s",
  },
];

export function HeroConnector() {
  return (
    <svg
      viewBox="0 0 140 460"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="chip-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connecting lines with glow */}
      <g filter="url(#line-glow)">
        {LINES.map((line) => (
          <path
            key={line.id}
            id={line.id}
            d={line.d}
            fill="none"
            stroke="#9775fb"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
        ))}
      </g>

      {/* MoltLlama MCP chip module */}
      <g filter="url(#chip-glow)">
        {/* Chip body */}
        <rect
          x="30" y="205" width="80" height="70" rx="5"
          fill="#302447" stroke="#9775fb" strokeWidth="1.5"
        />
        {/* Left pins */}
        <line x1="30" y1="218" x2="23" y2="218" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="30" y1="228" x2="23" y2="228" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="30" y1="240" x2="23" y2="240" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="30" y1="252" x2="23" y2="252" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="30" y1="262" x2="23" y2="262" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        {/* Right pins */}
        <line x1="110" y1="218" x2="117" y2="218" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="110" y1="228" x2="117" y2="228" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="110" y1="240" x2="117" y2="240" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="110" y1="252" x2="117" y2="252" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="110" y1="262" x2="117" y2="262" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        {/* Top pins */}
        <line x1="45" y1="205" x2="45" y2="198" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="57" y1="205" x2="57" y2="198" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="70" y1="205" x2="70" y2="198" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="83" y1="205" x2="83" y2="198" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="95" y1="205" x2="95" y2="198" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        {/* Bottom pins */}
        <line x1="45" y1="275" x2="45" y2="282" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="57" y1="275" x2="57" y2="282" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="70" y1="275" x2="70" y2="282" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="83" y1="275" x2="83" y2="282" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="95" y1="275" x2="95" y2="282" stroke="#9775fb" strokeWidth="1" strokeOpacity="0.6" />
        {/* Labels */}
        <text x="70" y="235" textAnchor="middle" fill="#bb9bff" fontSize="12" fontWeight="bold" fontFamily="monospace">
          MoltLlama
        </text>
        <text x="70" y="256" textAnchor="middle" fill="#9775fb" fontSize="16" fontWeight="bold" fontFamily="monospace">
          MCP
        </text>
      </g>

      {/* Animated crabs traveling along the paths */}
      {LINES.map((line) => (
        <text key={`crab-${line.id}`} fontSize="12" dy="4">
          🦀
          <animateMotion
            dur={line.dur}
            begin={line.begin}
            repeatCount="indefinite"
            keyPoints="0;1;0"
            keyTimes="0;0.5;1"
            calcMode="linear"
          >
            <mpath href={`#${line.id}`} />
          </animateMotion>
        </text>
      ))}
    </svg>
  );
}
