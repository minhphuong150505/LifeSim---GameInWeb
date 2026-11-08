import { motion } from 'framer-motion';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { C, INK, stroke } from '../../art/ink';
import { Person } from '../../art/Person';
import {
  BANK_ITEMS,
  BankItemArt,
  CHEST_DX,
  LakeBackdrop,
  LifeguardChair,
  LyingPerson,
  PoolBackdrop,
  PressingHands,
  ShoreBackdrop,
  Swimmer,
  type BankItemId,
  type SwimMode,
} from '../../art/WaterScenes';
import { LOOKS } from '../../art/looks';
import type { CameraShot, CastMember, StageState } from './types';

type Pt = { x: number; y: number };
/** `minW`: narrowest the shot may get on tall screens (iPad), so the action stays in view. */
type Cam = { x: number; y: number; h: number; minW?: number };
/** `intro` is used while no side panel is open (story beats: the dialogue box covers the bottom). */
type Shot = Cam & { intro?: Cam };

/** Camera shots per scene, in world units (see `Stage` for how they map to the viewBox). */
const CAMERAS: Record<'pool' | 'lake' | 'shore', Partial<Record<CameraShot, Shot>>> = {
  pool: {
    wide: { x: 180, y: 30, h: 330 },
    focus: { x: 150, y: 84, h: 212, minW: 400, intro: { x: 196, y: 64, h: 262 } },
  },
  lake: {
    wide: { x: 200, y: 30, h: 330 },
    focus: { x: 212, y: 84, h: 206, minW: 380, intro: { x: 205, y: 60, h: 262 } },
    bank: { x: 72, y: 150, h: 168, minW: 300 },
  },
  shore: {
    wide: { x: 200, y: 60, h: 300 },
    focus: { x: 212, y: 130, h: 170, minW: 330, intro: { x: 208, y: 110, h: 220 } },
    face: { x: 196, y: 180, h: 120, minW: 240 },
    chest: { x: 216, y: 178, h: 124, minW: 250 },
  },
};

const K = 0.6; // people are drawn smaller than in the living room: the water scenes are wider

const POOL = {
  player: { x: 85, y: 280 },
  friend: { x: 44, y: 278 },
  victim: { x: 205, y: 178 },
  ashore: { x: 182, y: 252 },
  chair: { x: 350, y: 250 },
  near: { x: 128, y: 282 },
};
const LAKE = {
  friendB: { x: 150, y: 262 },
  player: { x: 190, y: 264 },
  swim: { x: 245, y: 214 },
  far: { x: 270, y: 152 },
  float: { x: 240, y: 206 },
  ashore: { x: 236, y: 254 },
};
const SHORE = { victim: { x: 232, y: 240 }, player: { x: 219, y: 223 } };
const LYING_K = 0.7;

/** Where a thrown float has to land, in world units (radius for the drop test). */
// eslint-disable-next-line react-refresh/only-export-components -- drop-test geometry used by Play
export function waterTarget(stage: StageState): (Pt & { r: number }) | null {
  if (stage.scene === 'pool') return { x: POOL.victim.x, y: POOL.victim.y - 8, r: 18 };
  return null;
}

type WaterStageProps = {
  stage: StageState;
  cast: CastMember[];
  speaker?: CastMember | null;
  /** Shot to show (the story uses the stage's own shot, tasks may ask for another). */
  shot: CameraShot;
  /** Horizontal position of the shot's centre on screen (0–1). */
  focusX?: number;
  dropTarget?: boolean;
  onTargetTap?: () => void;
  /** Lake bank objects the player can tap (find-floats task). */
  bankPick?: { found: BankItemId[]; wrong: BankItemId[]; onPick: (id: BankItemId) => void };
  /** Chest compressions done so far (hands bounce on each one). */
  compressions?: number;
  children?: React.ReactNode;
};

/** Pool / lake / shore scene filling the whole screen; forwards a ref to the <svg>. */
export const WaterStage = forwardRef<SVGSVGElement, WaterStageProps>(function WaterStage(
  {
    stage,
    cast,
    speaker,
    shot,
    focusX = 0.5,
    dropTarget,
    onTargetTap,
    bankPick,
    compressions,
    children,
  },
  ref,
) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(1.7);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setAspect(r.width / r.height);
    };
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scene =
    stage.scene === 'living-room' || stage.scene === 'kitchen' || stage.scene === 'stroke-room'
      ? 'pool'
      : stage.scene;
  const cams = CAMERAS[scene];
  const picked = cams[shot] ?? cams.focus ?? (cams.wide as Shot);
  const noPanel = focusX === 0.5;
  const cam: Cam = noPanel && picked.intro ? picked.intro : picked;
  const w = Math.max(cam.h * aspect, noPanel ? 0 : (cam.minW ?? 0));
  const h = w / aspect;
  // A taller shot grows around the same centre.
  const y0 = cam.y - (h - cam.h) / 2;
  const x0 = noPanel || shot === 'wide' ? cam.x - w / 2 : cam.x - focusX * w;
  const viewBox = `${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden bg-[#cfe9ef]">
      <motion.svg
        ref={ref}
        initial={false}
        animate={{ viewBox }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={SCENE_LABEL[scene]}
      >
        {scene === 'pool' && (
          <PoolScene
            stage={stage}
            cast={cast}
            speaker={speaker}
            dropTarget={dropTarget}
            onTargetTap={onTargetTap}
          />
        )}
        {scene === 'lake' && <LakeScene stage={stage} speaker={speaker} bankPick={bankPick} />}
        {scene === 'shore' && (
          <ShoreScene stage={stage} speaker={speaker} compressions={compressions} />
        )}
      </motion.svg>
      {children}
    </div>
  );
});

const SCENE_LABEL = {
  pool: 'Hồ bơi công cộng',
  lake: 'Hồ nước ở khu dã ngoại',
  shore: 'Bờ hồ, nạn nhân nằm trên bãi cỏ',
} as const;

const RESCUE_DELAYS = [1300, 2900];
const SWIM_OUT_DELAYS = [2000];

/**
 * Counts 0, 1, 2… as each delay (ms) passes after `trigger` becomes non-null; resets when the
 * trigger changes. Used for little scripted animations (swim out, then struggle…).
 */
function useTimedSteps(trigger: string | null, delays: readonly number[]): number {
  const [state, setState] = useState({ trigger, step: 0 });
  if (state.trigger !== trigger) setState({ trigger, step: 0 });
  useEffect(() => {
    if (!trigger) return;
    const timers = delays.map((d, i) =>
      window.setTimeout(
        () => setState((st) => (st.trigger === trigger ? { trigger, step: i + 1 } : st)),
        d,
      ),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [trigger, delays]);
  return state.trigger === trigger ? state.step : 0;
}

/** Moves its content to `to`, animating from wherever it was. */
function At({
  to,
  children,
  duration = 1.2,
  delay = 0,
}: {
  to: Pt;
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.g
      initial={false}
      animate={{ x: to.x, y: to.y }}
      transition={{ duration, delay, ease: 'easeInOut' }}
    >
      {children}
    </motion.g>
  );
}

/* ───────────────────────── 2.1 pool ───────────────────────── */

function PoolScene({
  stage,
  cast,
  speaker,
  dropTarget,
  onTargetTap,
}: {
  stage: StageState;
  cast: CastMember[];
  speaker?: CastMember | null;
  dropTarget?: boolean;
  onTargetTap?: () => void;
}) {
  // The rescue plays in steps: lifeguard swims out, tows the victim, both climb out.
  const rescueStep = useTimedSteps(stage.lifeguard === 'rescue' ? 'rescue' : null, RESCUE_DELAYS);
  const step = stage.lifeguard === 'rescue' ? rescueStep + 1 : 0;

  const edge = { x: 170, y: 230 };
  const victimPos =
    step >= 3 ? POOL.ashore : step === 2 ? { x: edge.x + 30, y: edge.y } : POOL.victim;
  const victimMode: SwimMode =
    stage.victim === 'struggle'
      ? 'struggle'
      : stage.victim === 'float' || step === 2
        ? 'float'
        : 'swim';
  const guardPos =
    step === 1
      ? { x: POOL.victim.x + 26, y: POOL.victim.y + 4 }
      : step === 2
        ? edge
        : stage.lifeguard === 'near' || step === 3
          ? POOL.near
          : { x: POOL.chair.x, y: POOL.chair.y - 44 };
  const guardSwimming = step === 1 || step === 2;
  const guardOnChair = stage.lifeguard === 'seat' || stage.lifeguard === 'alert';
  const playerPoints = stage.lifeguard === 'near' || stage.lifeguard === 'rescue';
  const hasRing = stage.victim === 'float' && step < 3;

  return (
    <g>
      <PoolBackdrop />
      {/* background swimmers and a girl resting on the edge */}
      <g transform="translate(86 140)">
        <Swimmer kind="mom" mode="swim" k={0.45} />
      </g>
      <g transform="translate(286 214)">
        <Swimmer kind="brother" mode="play" k={0.45} />
      </g>
      <Person
        kind="grandma"
        pose="sit"
        x={20}
        y={112}
        scale={0.45}
        eyes="happy"
        look={{ ...LOOKS.friendB, shirt: C.yellow }}
      />

      <g transform={`translate(${POOL.chair.x} ${POOL.chair.y})`}>
        <g transform="scale(0.78)">
          <LifeguardChair />
        </g>
      </g>

      {/* victim */}
      <At to={victimPos} duration={step >= 2 ? 1.4 : 1}>
        {step >= 3 || stage.victim === 'ashore' ? (
          <Person kind="victim" pose="sit" x={0} y={0} scale={K} eyes="worried" mouth="flat" />
        ) : (
          <Swimmer kind="victim" mode={victimMode} k={K} />
        )}
      </At>

      {/* lifeguard */}
      {cast.includes('lifeguard') && (
        <At to={guardPos} duration={step === 1 ? 1.2 : step === 2 ? 1.5 : 1.1}>
          {guardSwimming ? (
            <Swimmer kind="lifeguard" mode="tow" k={K} />
          ) : (
            <Person
              kind="lifeguard"
              pose={guardOnChair ? 'sit' : 'stand'}
              x={0}
              y={0}
              scale={K}
              armR={stage.lifeguard === 'alert' ? 'point' : 'down'}
              armL={step === 3 ? 'shoulder' : 'down'}
              eyes={stage.lifeguard === 'seat' ? 'open' : 'wide'}
              mouth={speaker === 'lifeguard' || stage.lifeguard === 'alert' ? 'open' : 'flat'}
            />
          )}
          {stage.lifeguard === 'alert' && (
            <text
              x={-30}
              y={-84}
              fontFamily="Itim, sans-serif"
              fontSize={30}
              fill={C.red}
              stroke={INK}
              strokeWidth={1.4}
            >
              !
            </text>
          )}
        </At>
      )}

      {/* rope from the player's hand to the life ring */}
      {hasRing && (
        <path
          d={`M${POOL.player.x + 6} ${POOL.player.y - 30} Q${(POOL.player.x + POOL.victim.x) / 2} ${POOL.victim.y + 40} ${POOL.victim.x - 14} ${POOL.victim.y}`}
          fill="none"
          stroke="#c79a6c"
          strokeWidth={2.6}
          strokeDasharray="5 3"
        />
      )}

      {cast.includes('friend') && (
        <Person
          kind="friend"
          {...POOL.friend}
          scale={K}
          armL={speaker === 'friend' ? 'point' : 'down'}
          eyes={stage.victim === 'swim' ? 'happy' : 'wide'}
          mouth={speaker === 'friend' ? 'open' : stage.victim === 'swim' ? 'smile' : 'flat'}
        />
      )}
      <Person
        kind="player"
        {...POOL.player}
        scale={K}
        armR={hasRing ? 'hold' : 'down'}
        armL={playerPoints && step < 3 ? 'point' : speaker === 'player' ? 'wave' : 'down'}
        eyes={stage.victim === 'swim' ? 'happy' : 'worried'}
        mouth={speaker === 'player' ? 'open' : stage.victim === 'swim' ? 'smile' : 'flat'}
      />

      {dropTarget && (
        <DropRing at={POOL.victim} r={24} onTap={onTargetTap} label="Ném phao tới người gặp nạn" />
      )}
    </g>
  );
}

function DropRing({
  at,
  r,
  onTap,
  label,
}: {
  at: Pt;
  r: number;
  onTap?: () => void;
  label: string;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onTap}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTap?.()}
      className="cursor-pointer"
    >
      <circle
        cx={at.x}
        cy={at.y - 10}
        r={r}
        fill="rgb(255 255 255 / 0.3)"
        stroke={C.redDark}
        strokeWidth={2.4}
        strokeDasharray="6 4"
      >
        <animate
          attributeName="r"
          values={`${r};${r * 1.15};${r}`}
          dur="1.1s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

/* ───────────────────────── 2.2 lake ───────────────────────── */

function LakeScene({
  stage,
  speaker,
  bankPick,
}: {
  stage: StageState;
  speaker?: CastMember | null;
  bankPick?: WaterStageProps['bankPick'];
}) {
  // Friend A first swims out for ~2 s, then starts to struggle.
  const swimOut = useTimedSteps(stage.victim === 'struggle' ? 'struggle' : null, SWIM_OUT_DELAYS);
  const arrived = stage.victim !== 'struggle' || swimOut >= 1;

  const pos =
    stage.victim === 'struggle'
      ? LAKE.far
      : stage.victim === 'float'
        ? LAKE.float
        : stage.victim === 'ashore'
          ? LAKE.ashore
          : LAKE.swim;
  const mode: SwimMode =
    stage.victim === 'struggle'
      ? arrived
        ? 'struggle'
        : 'swim'
      : stage.victim === 'float'
        ? 'float'
        : 'play';
  const helping = stage.victim === 'float';
  const used = (id: BankItemId) => helping && (id === 'long-branch' || id === 'plastic-box');
  const scared = stage.victim === 'struggle' && arrived;

  return (
    <g>
      <LakeBackdrop />
      {BANK_ITEMS.map((it) => {
        if (used(it.id) || stage.victim === 'ashore') {
          if (it.id === 'long-branch' || it.id === 'plastic-box') return null;
        }
        const found = bankPick?.found.includes(it.id);
        const wrong = bankPick?.wrong.includes(it.id);
        const art = (
          <g transform={`translate(${it.x} ${it.y})`}>
            <BankItemArt id={it.id} />
            {found && (
              <g>
                <circle
                  r={it.r + 4}
                  fill="none"
                  stroke={C.green}
                  strokeWidth={3}
                  strokeDasharray="5 3"
                />
                <circle cx={it.r} cy={-it.r} r={7} fill={C.green} {...stroke(1.6)} />
                <path
                  d={`M${it.r - 3.5} ${-it.r} l2.5 2.5 l4.5 -5`}
                  fill="none"
                  stroke={C.white}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </g>
            )}
            {wrong && (
              <g>
                <circle
                  r={it.r + 4}
                  fill="rgb(236 106 76 / 0.12)"
                  stroke={C.redDark}
                  strokeWidth={2.6}
                />
                <path
                  d="M-7 -7 L7 7 M7 -7 L-7 7"
                  stroke={C.redDark}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
        );
        if (!bankPick || found || wrong) return <g key={it.id}>{art}</g>;
        return (
          <g
            key={it.id}
            role="button"
            tabIndex={0}
            aria-label={BANK_LABELS[it.id]}
            onClick={() => bankPick.onPick(it.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && bankPick.onPick(it.id)}
            className="cursor-pointer"
          >
            <circle
              cx={it.x}
              cy={it.y}
              r={it.r + 6}
              fill="rgb(255 255 255 / 0.28)"
              stroke={C.white}
              strokeWidth={2}
              strokeDasharray="3 4"
            />
            {art}
          </g>
        );
      })}

      <At to={pos} duration={stage.victim === 'struggle' ? 2 : 1.2}>
        {stage.victim === 'ashore' ? (
          <Person kind="friendA" pose="sit" x={0} y={0} scale={K} eyes="worried" mouth="flat" />
        ) : (
          <Swimmer kind="friendA" mode={mode} k={K} holding="box" />
        )}
      </At>

      {helping && (
        <g>
          <path
            d={`M${LAKE.player.x + 6} ${LAKE.player.y - 30} L${LAKE.float.x - 10} ${LAKE.float.y - 4}`}
            stroke={INK}
            strokeWidth={8}
            strokeLinecap="round"
          />
          <path
            d={`M${LAKE.player.x + 6} ${LAKE.player.y - 30} L${LAKE.float.x - 10} ${LAKE.float.y - 4}`}
            stroke={C.woodDark}
            strokeWidth={4.5}
            strokeLinecap="round"
          />
        </g>
      )}

      <Person
        kind="friendB"
        {...LAKE.friendB}
        scale={K}
        armL={speaker === 'friendB' && scared ? 'point' : 'down'}
        armR={stage.called ? 'phone' : 'down'}
        eyes={scared ? 'wide' : 'open'}
        mouth={speaker === 'friendB' ? 'open' : scared ? 'flat' : 'smile'}
      />
      <Person
        kind="player"
        {...LAKE.player}
        scale={K}
        armL={helping ? 'hold' : 'down'}
        eyes={scared ? 'worried' : 'happy'}
        mouth={speaker === 'player' ? 'open' : scared ? 'flat' : 'smile'}
      />
    </g>
  );
}

const BANK_LABELS: Record<BankItemId, string> = {
  'long-branch': 'Cành cây dài, chắc chắn',
  'short-branch': 'Cành cây nhỏ, ngắn',
  'plastic-box': 'Thùng nhựa rỗng có nắp',
  backpack: 'Ba lô đựng đầy đồ',
  rock: 'Viên đá lớn',
  sandals: 'Đôi dép',
  'small-towel': 'Khăn nhỏ',
};

/* ───────────────────────── 2.3 shore ───────────────────────── */

function ShoreScene({
  stage,
  speaker,
  compressions = 0,
}: {
  stage: StageState;
  speaker?: CastMember | null;
  compressions?: number;
}) {
  const s = LYING_K * LOOKS.friendA.scale;
  const chest = { x: SHORE.victim.x + CHEST_DX * s, y: SHORE.victim.y };
  return (
    <g>
      <ShoreBackdrop />
      <Person
        kind="player"
        pose="sit"
        {...SHORE.player}
        scale={K}
        armR={stage.hands ? 'press' : stage.called ? 'phone' : 'down'}
        armL={stage.hands ? 'press' : 'down'}
        eyes="worried"
        mouth={speaker === 'player' ? 'open' : 'flat'}
      />
      <g transform={`translate(${SHORE.victim.x} ${SHORE.victim.y})`}>
        <LyingPerson
          kind="friendA"
          k={LYING_K}
          airway={stage.airway}
          mouthDirty={!stage.mouthClear}
        />
      </g>
      {stage.hands && (
        <PressingHands
          key={compressions}
          x={chest.x}
          y={chest.y - 2}
          down={compressions % 2 === 1}
        />
      )}
      {stage.called && !stage.hands && (
        <g transform={`translate(${SHORE.player.x + 34} ${SHORE.player.y - 44})`}>
          <rect x={-18} y={-12} width={36} height={22} rx={8} fill={C.white} {...stroke(2)} />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fontFamily="Itim, sans-serif"
            fontSize={13}
            fill={C.redDark}
          >
            115
          </text>
        </g>
      )}
    </g>
  );
}
