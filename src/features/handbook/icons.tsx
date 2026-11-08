import type { HandbookIcon } from '../../data/handbook';

/** Plain line icons for the handbook (reference-document style, not the game's hand-drawn art). */
type Props = { size?: number; className?: string; strokeWidth?: number };

function Svg({
  size = 20,
  className,
  strokeWidth = 1.8,
  children,
}: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const GLYPHS: Record<HandbookIcon, React.ReactNode> = {
  drop: <path d="M12 3.5s6 6.4 6 10.8a6 6 0 0 1-12 0c0-4.4 6-10.8 6-10.8z" />,
  flame: (
    <path d="M12 3c1 3.6 5.5 5.6 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.6 1.4-4.3 2.6-5.3.2 1.8 1 2.9 2.1 3.3C11.2 8.3 11.6 5.6 12 3z" />
  ),
  throat: (
    <>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 21c0-4.2 3.1-6.8 7-6.8s7 2.6 7 6.8" />
      <path d="M10 14.3v2.2M14 14.3v2.2" />
    </>
  ),
  recovery: (
    <>
      <path d="M3 6v13M3 15.5h18V19M21 15.5v-2.5a3 3 0 0 0-3-3h-7.5v5.5" />
      <circle cx="7" cy="11.5" r="2" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />
      <path d="M12.8 9.5 10.8 13h2.6l-2 3.4" />
    </>
  ),
  wave: (
    <path d="M3 9c2-1.8 4-1.8 6 0s4 1.8 6 0 4-1.8 6 0M3 15c2-1.8 4-1.8 6 0s4 1.8 6 0 4-1.8 6 0" />
  ),
  bone: (
    <>
      <path d="m8.3 8.3 7.4 7.4" />
      <path d="M8.3 8.3a2.2 2.2 0 1 0-3.1-.6 2.2 2.2 0 1 0 .6 3.1zM15.7 15.7a2.2 2.2 0 1 0 3.1.6 2.2 2.2 0 1 0-.6-3.1z" />
    </>
  ),
  swim: (
    <>
      <circle cx="15" cy="7" r="2.2" />
      <path d="M3 17c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0M6 13l4.5-3.5 3 2.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  brain: (
    <path d="M12 5.5a3 3 0 0 0-5.6-1.3A3 3 0 0 0 4.5 9a3 3 0 0 0 0 5.5A3 3 0 0 0 7 19a3 3 0 0 0 5 1V5.5zM12 5.5a3 3 0 0 1 5.6-1.3A3 3 0 0 1 19.5 9a3 3 0 0 1 0 5.5A3 3 0 0 1 17 19a3 3 0 0 1-5 1" />
  ),
  'heart-pulse': (
    <>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />
      <path d="M4.5 12.5h3.5l1.5-2.5 2 4.5 1.5-2h6.5" />
    </>
  ),
};

export function TopicGlyph({ icon, ...p }: Props & { icon: HandbookIcon }) {
  return <Svg {...p}>{GLYPHS[icon]}</Svg>;
}

export const ChevronLeft = (p: Props) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);
export const ChevronRight = (p: Props) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
);
export const SearchGlyph = (p: Props) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Svg>
);
export const EyeGlyph = (p: Props) => (
  <Svg {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
export const CheckCircle = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.3 2.7 2.7L16 9.5" />
  </Svg>
);
export const XGlyph = (p: Props) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const XCircle = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6M15 9l-6 6" />
  </Svg>
);
export const PhoneGlyph = (p: Props) => (
  <Svg {...p}>
    <path d="M6.6 3.5h-2a1.5 1.5 0 0 0-1.5 1.6A17 17 0 0 0 18.9 20.9a1.5 1.5 0 0 0 1.6-1.5v-2a1.5 1.5 0 0 0-1.2-1.5l-3.2-.7a1.5 1.5 0 0 0-1.5.5l-1 1.2a12 12 0 0 1-5.5-5.5l1.2-1a1.5 1.5 0 0 0 .5-1.5l-.7-3.2a1.5 1.5 0 0 0-1.5-1.2z" />
  </Svg>
);
export const PlayGlyph = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" />
  </Svg>
);
export const ExternalGlyph = (p: Props) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </Svg>
);
export const InfoGlyph = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.8v.2" />
  </Svg>
);
export const AlertGlyph = (p: Props) => (
  <Svg {...p}>
    <path d="M10.3 4.2 2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
    <path d="M12 9.5v4.5M12 17v.2" />
  </Svg>
);
export const DocGlyph = (p: Props) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </Svg>
);
export const CrossMark = (p: Props) => (
  <Svg {...p}>
    <path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z" />
  </Svg>
);
