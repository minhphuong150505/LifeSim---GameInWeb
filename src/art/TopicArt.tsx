import type { Topic } from '../data/topics';
import { BandageIcon, BoltIcon, HeartIcon, StarIcon } from './icons';
import { C, INK, stroke } from './ink';
import { Kitchen, TAP } from './Kitchen';
import { LivingRoom } from './LivingRoom';
import { Person } from './Person';
import { PoolBackdrop, Swimmer } from './WaterScenes';

/** Cover illustration of a topic card (Core game topic picker, Hub course thumbnails). */
export function TopicArt({ topic, className }: { topic: Topic; className?: string }) {
  if (topic === 'nosebleed') {
    return (
      <svg
        viewBox="120 70 160 170"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        aria-hidden
      >
        <LivingRoom />
        <Person
          kind="brother"
          pose="sit"
          x={200}
          y={170}
          scale={1.1}
          tilt="down"
          armR="nose"
          blood
          eyes="worried"
          mouth="frown"
        />
      </svg>
    );
  }
  if (topic === 'drowning') {
    return (
      <svg
        viewBox="110 96 170 150"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        aria-hidden
      >
        <PoolBackdrop />
        <g transform="translate(200 186)">
          <Swimmer kind="victim" mode="struggle" k={1.1} />
        </g>
        <g transform="translate(150 196) rotate(-12)">
          <circle r={14} fill={C.red} {...stroke(2.5)} />
          <circle r={6} fill="#8fd0ea" {...stroke(2)} />
        </g>
      </svg>
    );
  }
  if (topic === 'cpr') {
    return (
      <svg
        viewBox="0 0 160 170"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        aria-hidden
      >
        <rect width={160} height={170} fill="#dbeef6" />
        <rect x={10} y={20} width={140} height={60} rx={6} fill="#2f5d50" {...stroke(3)} />
        <path
          d="M18 52 H52 L60 34 L70 70 L80 44 L88 52 H142"
          fill="none"
          stroke={C.yellow}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        <g transform="translate(56 88)">
          <HeartIcon size={48} />
        </g>
        <rect x={0} y={140} width={160} height={30} fill={C.floor} />
        <path d="M0 140 H160" {...stroke(2.5)} />
      </svg>
    );
  }
  if (topic === 'choking') {
    return (
      <svg
        viewBox="0 0 160 170"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        aria-hidden
      >
        <rect width={160} height={170} fill="#fde3da" />
        <rect x={0} y={112} width={160} height={58} fill={C.wood} />
        <path d="M0 112 H160" {...stroke(2.5)} />
        <ellipse cx={80} cy={112} rx={52} ry={14} fill={C.white} {...stroke(3)} />
        <ellipse cx={80} cy={108} rx={34} ry={7} fill="#f3c9a6" />
        <path d="M56 80 C70 70 90 70 104 80" fill="none" {...stroke(3)} />
        <circle cx={80} cy={52} r={22} fill={C.skin} {...stroke(3)} />
        <path d="M70 50 l4 4 M74 50 l-4 4 M86 50 l4 4 M90 50 l-4 4" {...stroke(2.2)} />
        <ellipse cx={80} cy={63} rx={4} ry={3} fill={INK} />
        <path d="M58 70 C62 78 70 80 74 76 M102 70 C98 78 90 80 86 76" fill="none" {...stroke(3)} />
        <text
          x={118}
          y={36}
          fontFamily="Itim, sans-serif"
          fontSize={28}
          fill={C.red}
          stroke={INK}
          strokeWidth={1.5}
        >
          !
        </text>
      </svg>
    );
  }
  if (topic === 'burn') {
    // The sister holding her burned hand under the kitchen tap.
    return (
      <svg
        viewBox="96 120 150 150"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        aria-hidden
      >
        <Kitchen water />
        <Person
          kind="sister"
          x={TAP.x + 36 * 0.8}
          y={TAP.waterY - 4 + 82 * 0.8}
          armR="reach"
          armL="hold"
          eyes="worried"
          mouth="frown"
          burnArm={{ level: 'red' }}
        />
      </svg>
    );
  }
  const Icon = topic === 'bleeding' ? BandageIcon : topic === 'seizure' ? BoltIcon : StarIcon;
  const bg = topic === 'bleeding' ? '#fde3da' : topic === 'seizure' ? '#fff1c2' : '#e8e0f5';
  return (
    <svg
      viewBox="0 0 160 170"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <rect width={160} height={170} fill={bg} />
      <rect x={0} y={128} width={160} height={42} fill={C.floor} />
      <path d="M0 128 H160" {...stroke(2.5)} />
      <g transform="translate(40 40)">
        <Icon size={80} />
      </g>
    </svg>
  );
}
