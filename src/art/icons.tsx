import { cn } from '../lib/cn';
import { C, INK, stroke } from './ink';

type IconProps = { className?: string; size?: number; title?: string };

function Svg({
  className,
  size,
  title,
  viewBox = '0 0 48 48',
  children,
}: IconProps & { viewBox?: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {children}
    </svg>
  );
}

const HEART =
  'M24 41 C14 34 5 27 5 17 C5 10 10 6 16 6 C20 6 22.5 8.5 24 11 C25.5 8.5 28 6 32 6 C38 6 43 10 43 17 C43 27 34 34 24 41 Z';

export function HeartIcon({ filled = true, ...p }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...p}>
      <path
        d={HEART}
        fill={filled ? C.red : '#a8433a'}
        opacity={filled ? 1 : 0.55}
        {...stroke(3)}
      />
      {filled && (
        <path
          d="M12 13 C13 11 15 10.5 17 11"
          fill="none"
          stroke={C.white}
          strokeWidth={3}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

const BOLT = 'M27 3 L9 27 L21 27 L17 45 L39 18 L26 18 L31 3 Z';

export function BoltIcon({ filled = true, ...p }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...p}>
      <path
        d={BOLT}
        fill={filled ? C.yellow : '#9c8f45'}
        opacity={filled ? 1 : 0.5}
        {...stroke(3)}
      />
    </Svg>
  );
}

/** Băng gạc – the in-game currency. */
export function BandageIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <g transform="rotate(-35 24 24)">
        <rect x={3} y={15} width={42} height={18} rx={9} fill="#f6c99b" {...stroke(3)} />
        <rect x={16} y={15} width={16} height={18} fill="#fbe6cf" {...stroke(2.5)} />
        <g fill={INK} opacity={0.45}>
          <circle cx={9} cy={21} r={1.2} />
          <circle cx={9} cy={27} r={1.2} />
          <circle cx={39} cy={21} r={1.2} />
          <circle cx={39} cy={27} r={1.2} />
        </g>
        <path
          d="M24 28.5 C21 26.5 19.5 25 19.5 23 C19.5 21.6 20.6 20.6 21.8 20.6 C22.8 20.6 23.5 21.2 24 22 C24.5 21.2 25.2 20.6 26.2 20.6 C27.4 20.6 28.5 21.6 28.5 23 C28.5 25 27 26.5 24 28.5 Z"
          fill={C.red}
        />
      </g>
    </Svg>
  );
}

/** Túi vật dụng – first-aid bag. */
export function BagIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path
        d="M17 13 V9 C17 7 18.5 6 20.5 6 H27.5 C29.5 6 31 7 31 9 V13"
        fill="none"
        {...stroke(3)}
      />
      <rect x={5} y={13} width={38} height={29} rx={7} fill={C.red} {...stroke(3)} />
      <path d="M21 19 h6 v6 h6 v6 h-6 v6 h-6 v-6 h-6 v-6 h6 Z" fill={C.white} {...stroke(2)} />
    </Svg>
  );
}

/** Cửa hàng – little shop front with an awning. */
export function ShopIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x={8} y={20} width={32} height={22} fill={C.white} {...stroke(3)} />
      <path d="M5 20 L9 8 H39 L43 20 Z" fill={C.red} {...stroke(3)} />
      <path
        d="M5 20 q4.75 6 9.5 0 q4.75 6 9.5 0 q4.75 6 9.5 0 q4.75 6 9.5 0"
        fill={C.white}
        {...stroke(2.5)}
      />
      <path d="M15 9 L13 20 M24 9 V20 M33 9 L35 20" {...stroke(2)} />
      <rect x={13} y={28} width={9} height={14} fill={C.blue} {...stroke(2.5)} />
      <rect x={26} y={28} width={9} height={7} fill={C.sky} {...stroke(2.5)} />
    </Svg>
  );
}

export function StarIcon({ filled = true, ...p }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...p}>
      <path
        d="M24 4 L29.5 17 L43 18 L32.5 27 L36 41 L24 33.5 L12 41 L15.5 27 L5 18 L18.5 17 Z"
        fill={filled ? C.yellow : '#e9e1c8'}
        {...stroke(3)}
      />
    </Svg>
  );
}

export function LockIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M15 21 V15 C15 9 19 6 24 6 C29 6 33 9 33 15 V21" fill="none" {...stroke(3.5)} />
      <rect x={9} y={20} width={30} height={23} rx={6} fill={C.yellow} {...stroke(3)} />
      <path
        d="M24 35 C21 33 19.5 31.5 19.5 29.5 C19.5 28 20.6 27 21.8 27 C22.8 27 23.5 27.6 24 28.4 C24.5 27.6 25.2 27 26.2 27 C27.4 27 28.5 28 28.5 29.5 C28.5 31.5 27 33 24 35 Z"
        fill={C.redDark}
      />
    </Svg>
  );
}

export function FlameIcon({ lit = true, ...p }: IconProps & { lit?: boolean }) {
  return (
    <Svg {...p}>
      <path
        d="M24 44 C14 44 8 37 9 28 C10 20 16 17 17 9 C22 12 24 17 23 22 C26 20 28 16 28 13 C35 18 40 25 39 32 C38 40 32 44 24 44 Z"
        fill={lit ? '#ff8a3d' : '#d8cfbf'}
        {...stroke(3)}
      />
      <path
        d="M24 44 C19 44 16 40 17 35 C18 31 21 29 22 26 C25 29 26 31 26 33 C28 32 29 30 29.5 29 C32 32 32 36 31 39 C30 42 27 44 24 44 Z"
        fill={lit ? C.yellow : '#eee6d6'}
        {...stroke(2.5)}
      />
    </Svg>
  );
}

export function TrophyIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path
        d="M14 8 H34 V20 C34 27 29.5 31 24 31 C18.5 31 14 27 14 20 Z"
        fill={C.yellow}
        {...stroke(3)}
      />
      <path
        d="M14 11 H7 C7 18 10 21 15 22 M34 11 H41 C41 18 38 21 33 22"
        fill="none"
        {...stroke(3)}
      />
      <path d="M21 31 V37 H27 V31" fill={C.yellow} {...stroke(3)} />
      <rect x={14} y={37} width={20} height={6} rx={2} fill={C.woodDark} {...stroke(3)} />
      <path
        d="M24 13 l2 4 4 .5 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -.5 Z"
        fill={C.white}
        {...stroke(1.6)}
      />
    </Svg>
  );
}

export function GiftIcon({ open = false, ...p }: IconProps & { open?: boolean }) {
  return (
    <Svg {...p}>
      <rect
        x={8}
        y={20}
        width={32}
        height={22}
        rx={3}
        fill={open ? '#e8dfca' : C.red}
        {...stroke(3)}
      />
      <rect
        x={6}
        y={13}
        width={36}
        height={8}
        rx={3}
        fill={open ? '#e8dfca' : C.redDark}
        {...stroke(3)}
        transform={open ? 'rotate(-14 6 21)' : undefined}
      />
      <path d="M24 20 V42" stroke={open ? C.gray : C.yellow} strokeWidth={5} />
      <path d="M24 20 V42" fill="none" {...stroke(1.5)} opacity={0.3} />
      {!open && (
        <path
          d="M24 13 C18 6 12 8 15 12 C17 14 22 13 24 13 C26 13 31 14 33 12 C36 8 30 6 24 13 Z"
          fill={C.yellow}
          {...stroke(2.5)}
        />
      )}
    </Svg>
  );
}

export function ClockIcon({ minutes = 15, ...p }: IconProps & { minutes?: number }) {
  const a = (minutes / 60) * 360;
  const r = (a * Math.PI) / 180;
  return (
    <Svg {...p}>
      <circle cx={24} cy={25} r={18} fill={C.white} {...stroke(3)} />
      <path d={`M24 25 L24 25 L${24 + 13 * Math.sin(r)} ${25 - 13 * Math.cos(r)}`} {...stroke(3)} />
      <path d="M24 25 V13" {...stroke(3)} />
      {a > 0 && (
        <path
          d={`M24 25 L24 9 A16 16 0 ${a > 180 ? 1 : 0} 1 ${24 + 16 * Math.sin(r)} ${25 - 16 * Math.cos(r)} Z`}
          fill={C.red}
          opacity={0.35}
        />
      )}
      <circle cx={24} cy={25} r={2.2} fill={INK} />
      <path d="M18 5 H30 M24 5 V7" {...stroke(3)} />
    </Svg>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x={13} y={4} width={22} height={40} rx={5} fill="#4b5563" {...stroke(3)} />
      <rect x={16} y={9} width={16} height={26} rx={2} fill={C.sky} {...stroke(2)} />
      <circle cx={24} cy={39.5} r={2} fill={C.white} />
      <path
        d="M20 21 c0 4 3 7 7 7 l1.5 -2 -2.5 -2 -1.5 1 c-1.5 -.5 -2.5 -1.5 -3 -3 l1 -1.5 -2 -2.5 Z"
        fill={C.green}
        {...stroke(1.4)}
      />
    </Svg>
  );
}

export function IcePackIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x={6} y={12} width={36} height={26} rx={11} fill={C.ice} {...stroke(3)} />
      <path d="M6 22 H42" stroke={C.blueDark} strokeWidth={2} opacity={0.5} />
      <rect x={14} y={6} width={20} height={8} rx={3} fill={C.blue} {...stroke(2.5)} />
      <path
        d="M15 27 l4 4 M24 25 l4 4 M31 29 l3 3"
        stroke={C.white}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CottonIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path
        d="M12 34 C5 34 4 26 9 23 C7 16 15 12 19 16 C21 10 31 10 32 17 C38 15 44 21 40 27 C44 31 40 37 34 35 C30 40 18 40 12 34 Z"
        fill={C.white}
        {...stroke(3)}
      />
    </Svg>
  );
}

export function TissueIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M17 18 C17 10 22 6 24 6 C27 9 31 10 31 18" fill={C.white} {...stroke(2.5)} />
      <rect x={7} y={18} width={34} height={22} rx={4} fill={C.blue} {...stroke(3)} />
      <rect x={16} y={18} width={16} height={5} rx={2} fill={C.white} {...stroke(2)} />
    </Svg>
  );
}

export function AmbulanceIcon(p: IconProps) {
  return (
    <Svg {...p} viewBox="0 0 64 48">
      <path d="M4 14 H38 V38 H4 Z" fill={C.white} {...stroke(3)} />
      <path d="M38 20 H50 L58 29 V38 H38 Z" fill={C.white} {...stroke(3)} />
      <path d="M41 23 H49 L54 29 H41 Z" fill={C.sky} {...stroke(2)} />
      <path d="M4 30 H58" stroke={C.red} strokeWidth={4} />
      <path d="M18 18 h5 v5 h5 v5 h-5 v5 h-5 v-5 h-5 v-5 h5 Z" fill={C.red} {...stroke(1.6)} />
      <rect x={14} y={8} width={8} height={6} rx={2} fill={C.blue} {...stroke(2)} />
      <circle cx={15} cy={39} r={5.5} fill="#4b5563" {...stroke(2.5)} />
      <circle cx={47} cy={39} r={5.5} fill="#4b5563" {...stroke(2.5)} />
    </Svg>
  );
}

export function PlayIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14 8 L38 24 L14 40 Z" fill={C.white} {...stroke(3.5)} />
    </Svg>
  );
}

export function BackIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M31 8 L13 24 L31 40 Z" fill={C.white} {...stroke(3.5)} />
    </Svg>
  );
}

export function PinIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path
        d="M24 44 C24 44 9 29 9 19 C9 10 16 4 24 4 C32 4 39 10 39 19 C39 29 24 44 24 44 Z"
        fill={C.red}
        {...stroke(3)}
      />
      <circle cx={24} cy={19} r={6} fill={C.white} {...stroke(2.5)} />
    </Svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx={24} cy={24} r={19} fill={C.green} {...stroke(3)} />
      <path
        d="M15 25 L21.5 31.5 L34 17"
        fill="none"
        stroke={C.white}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CrossIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx={24} cy={24} r={19} fill={C.red} {...stroke(3)} />
      <path
        d="M17 17 L31 31 M31 17 L17 31"
        stroke={C.white}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SpeakerIcon({ muted, ...p }: IconProps & { muted?: boolean }) {
  return (
    <Svg {...p}>
      <path d="M8 19 H16 L27 9 V39 L16 29 H8 Z" fill={C.white} {...stroke(3)} />
      {muted ? (
        <path d="M33 18 L43 30 M43 18 L33 30" {...stroke(3.5)} />
      ) : (
        <path d="M33 17 C37 21 37 27 33 31 M37 12 C44 19 44 29 37 36" fill="none" {...stroke(3)} />
      )}
    </Svg>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx={17} cy={17} r={7} fill={C.skin} {...stroke(3)} />
      <circle cx={33} cy={17} r={7} fill={C.skin} {...stroke(3)} />
      <path d="M5 40 C5 31 10 27 17 27 C24 27 29 31 29 40 Z" fill={C.blue} {...stroke(3)} />
      <path d="M21 40 C21 31 26 27 33 27 C40 27 45 31 45 40 Z" fill={C.red} {...stroke(3)} />
    </Svg>
  );
}
