import { C, stroke } from './ink';
import type { HairStyle, Look } from './looks';
import { Head } from './Person';

type AvatarLook = Look & { bg: string };

const SKINS = [C.skin, '#f6d2b0', '#e8b98f', '#d9a679'];

// 12 hand-drawn avatars; ids `avatar-1` … `avatar-12` stay stable for saved profiles and bots.
const AVATARS: AvatarLook[] = (
  [
    ['ponytail', '#6b4a2b', 0, C.red, '#ffe3b3'],
    ['boy', '#3b2a20', 1, C.blue, '#d6ecf5'],
    ['bob', '#2f2520', 0, '#f2b8c6', '#fbe0e6'],
    ['spiky', '#7a4a26', 2, C.green, '#e3f2d4'],
    ['pigtails', '#4a3426', 1, C.yellow, '#fff1c2'],
    ['curly', '#3e2a22', 3, '#c7a6d9', '#ece0f5'],
    ['long', '#5a3b28', 0, C.blue, '#d9eef7'],
    ['buzz', '#2f2520', 2, C.red, '#ffe0d6'],
    ['cap', '#5a3b28', 1, C.white, '#ffe3b3'],
    ['short', '#8a5a34', 0, '#f5a35c', '#ffe9d0'],
    ['bun', '#3b2a20', 3, C.green, '#e3f2d4'],
    ['boy', '#c47a3c', 0, '#c7a6d9', '#ece0f5'],
  ] as [HairStyle, string, number, string, string][]
).map(([hairStyle, hair, skin, shirt, bg]) => ({
  hairStyle,
  hair,
  skin: SKINS[skin] ?? C.skin,
  shirt,
  pants: shirt,
  bg,
}));

/** Must match the AVATARS table above. */
export const AVATAR_COUNT = 12;

/** Round head-and-shoulders portrait for avatar id `avatar-N`. */
export function AvatarArt({ id, className }: { id: string; className?: string }) {
  const n = Number(id.replace('avatar-', '')) || 1;
  const look = AVATARS[(n - 1) % AVATARS.length] as AvatarLook;
  return (
    <svg viewBox="-40 -40 80 80" className={className} aria-hidden>
      <defs>
        <clipPath id={`av-${n}`}>
          <circle r={38} />
        </clipPath>
      </defs>
      <circle r={38} fill={look.bg} />
      <g clipPath={`url(#av-${n})`}>
        <path
          d="M-30 44 C-30 26 -18 18 0 18 C18 18 30 26 30 44 Z"
          fill={look.shirt}
          {...stroke(2.5)}
        />
        <g transform="translate(0 -4) scale(1.05)">
          <Head
            look={look}
            face={{ eyes: n % 3 === 0 ? 'happy' : 'open', mouth: n % 2 ? 'smile' : 'grin' }}
          />
        </g>
      </g>
      <circle r={38} fill="none" {...stroke(3)} />
    </svg>
  );
}
