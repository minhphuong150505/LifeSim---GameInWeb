import { C, INK } from '../art/ink';

/** Hand-lettered LifeSim wordmark with the heart-and-cross badge. */
export function Logo({ height = 40 }: { height?: number }) {
  return (
    <svg
      viewBox="0 0 172 64"
      height={height}
      width={(height * 172) / 64}
      role="img"
      aria-label="LifeSim"
    >
      <text
        x={4}
        y={50}
        fontFamily="Itim, sans-serif"
        fontSize={46}
        fill={C.red}
        stroke={INK}
        strokeWidth={7}
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        Life
        <tspan fill={C.blue}>Sim</tspan>
      </text>
      <g transform="translate(142 4) rotate(12)">
        <path
          d="M12 22 C6 18 1 14 1 8.5 C1 4.5 4 2 7.5 2 C9.6 2 11 3.2 12 4.6 C13 3.2 14.4 2 16.5 2 C20 2 23 4.5 23 8.5 C23 14 18 18 12 22 Z"
          fill={C.red}
          stroke={INK}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path d="M10.5 6.5 h3 v3 h3 v3 h-3 v3 h-3 v-3 h-3 v-3 h3 Z" fill={C.white} />
      </g>
    </svg>
  );
}
