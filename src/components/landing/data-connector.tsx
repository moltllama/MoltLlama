"use client";

/**
 * Horizontal connector line with animated pulses flowing left → right.
 * Used between the protocol table and the JSON preview.
 */
export function DataConnector() {
  return (
    <svg
      viewBox="0 0 60 200"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="pulse-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9775fb" stopOpacity="0" />
          <stop offset="50%" stopColor="#9775fb" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f5217f" stopOpacity="0" />
        </linearGradient>
        <filter id="dc-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Static line */}
      <line
        x1="0" y1="100" x2="60" y2="100"
        stroke="#9775fb"
        strokeWidth="1.5"
        strokeOpacity="0.25"
        filter="url(#dc-glow)"
      />

      {/* Animated pulses */}
      {[0, 1, 2].map((i) => (
        <circle key={i} r="3" fill="url(#pulse-grad)" filter="url(#dc-glow)">
          <animateMotion
            dur="2.5s"
            begin={`${i * 0.8}s`}
            repeatCount="indefinite"
            path="M 0,100 L 60,100"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.1;0.8;1"
            dur="2.5s"
            begin={`${i * 0.8}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}
