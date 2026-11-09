import { motion } from 'framer-motion';
import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import {
  DiningChair,
  DiningRoom,
  DiningTable,
  DINING_FLOOR_Y,
  WaterGlass,
} from '../../art/DiningRoom';
import { C, INK, stroke } from '../../art/ink';
import { LOOKS } from '../../art/looks';
import { Head, Limb, Person, type Eyes, type Mouth } from '../../art/Person';
import { LyingPerson, PressingHands } from '../../art/WaterScenes';
import { focusBox } from './stageLayout';
import type { CastMember, ChokeLevel, StageState } from './types';

/** Scale of the brother (his look's own scale). */
const K = LOOKS.brother.scale;
/** Seat point at the table, standing spot next to it, hips when lying on the floor. */
const SEAT = { x: 232, y: 246 };
const STAND = { x: 140, y: 292 };
const LYING = { x: 214, y: 272 };
const LYING_K = 0.9;
/** The player's own chair at the table (round 4.1 starts with both of them eating). */
const PLAYER_SEAT = { x: 300, y: 246 };

type BrotherSpot = { x: number; y: number; pose: 'sit' | 'stand' | 'lie' };

/** Where the brother is for the current state. */
// eslint-disable-next-line react-refresh/only-export-components -- shared scene geometry
export function brotherSpot(stage: StageState): BrotherSpot {
  if (stage.choke === 'down' || stage.choke === 'breathing') return { ...LYING, pose: 'lie' };
  const standing =
    stage.choke === 'severe' || stage.rescuer === 'back' || stage.rescuer === 'thrust';
  return standing ? { ...STAND, pose: 'stand' } : { ...SEAT, pose: 'sit' };
}

function faceFor(choke: ChokeLevel): { eyes: Eyes; mouth: Mouth } {
  switch (choke) {
    case 'cough':
      return { eyes: 'closed', mouth: 'open' };
    case 'weak':
      return { eyes: 'worried', mouth: 'o' };
    case 'severe':
      return { eyes: 'wide', mouth: 'o' };
    default:
      return { eyes: 'open', mouth: 'smile' };
  }
}

/** "Khụ khụ" puffs next to the mouth: big and bold for a strong cough, small and faint when weak. */
function CoughMarks({
  x,
  y,
  weak,
  size = 11,
}: {
  x: number;
  y: number;
  weak?: boolean;
  size?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={weak ? 0.75 : 1}>
      <text
        x={0}
        y={0}
        textAnchor="middle"
        fontFamily="Itim, sans-serif"
        fontSize={weak ? size * 0.75 : size}
        fill={weak ? '#7a6a8c' : C.redDark}
        stroke={C.white}
        strokeWidth={2.4}
        paintOrder="stroke"
      >
        {weak ? 'khụ…' : 'khụ khụ!'}
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
      </text>
    </g>
  );
}

/** Burst drawn where the heel of the hand lands between the shoulder blades. */
function Impact({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        initial={{ scale: 0.4, opacity: 1 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <path
          d="M0 -12 L3 -4 L11 -6 L5 1 L11 7 L3 5 L0 13 L-3 5 L-11 7 L-5 1 L-11 -6 L-3 -4 Z"
          fill={C.yellow}
          {...stroke(1.6)}
        />
      </motion.g>
    </g>
  );
}

type DiningStageProps = {
  cast: CastMember[];
  stage: StageState;
  speaker?: CastMember | null;
  /** `wide` = the whole dining room (story), `focus` = zoomed on the brother while answering. */
  mode: 'wide' | 'focus';
  focusX?: number;
  showCloseup?: boolean;
  /** Back blows / abdominal thrusts / compressions done so far (animates the hands). */
  presses?: number;
  children?: React.ReactNode;
};

const WIDE = { y: 26, h: 290 };
/** Zoom used while answering: the brother and the player next to him. */
const FOCUS = { y: 50, h: 264 };

/** Scenario 4 stage: the dining room filling the screen; forwards a ref to the <svg>. */
export const DiningStage = forwardRef<SVGSVGElement, DiningStageProps>(function DiningStage(
  { cast, stage, speaker, mode, focusX = 0.5, showCloseup, presses = 0, children },
  ref,
) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(2);
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

  const focus = mode === 'focus';
  const bro = brotherSpot(stage);
  const box = focus ? focusBox(FOCUS, aspect) : WIDE;
  const w = box.h * aspect;
  // Centre on the brother, nudged towards wherever the player is helping from.
  const cx = bro.pose === 'lie' ? bro.x - 4 : bro.pose === 'stand' ? bro.x + 6 : bro.x - 22;
  const x0 = focus ? cx - focusX * w : 200 - w / 2;
  const viewBox = `${x0.toFixed(1)} ${box.y.toFixed(1)} ${w.toFixed(1)} ${box.h.toFixed(1)}`;
  // Zoomed in, only the brother and the player are shown.
  const has = (c: CastMember) => cast.includes(c) && !focus;
  const talking = (c: CastMember) => speaker === c;
  const face = faceFor(stage.choke);
  const choking = stage.choke === 'cough' || stage.choke === 'weak' || stage.choke === 'severe';
  const lean = stage.posture === 'forward';
  const rescuer = stage.rescuer;

  // Brother's body landmarks (scene units) for the current pose.
  const hip = bro.pose === 'stand' ? bro.y - 30 * K : bro.y;
  const headY = hip + (lean ? -58 : -62) * K;
  const backSpot = { x: bro.x, y: hip - 25 * K };
  const fist = { x: bro.x, y: hip - 13 * K };

  const playerLook = LOOKS.player;
  const blowUp = presses % 2 === 0;

  const player = () => {
    if (rescuer === 'kneel')
      return (
        <Person
          kind="player"
          pose="sit"
          x={bro.x - 10}
          y={bro.y - 20}
          armR={stage.hands ? 'press' : stage.phone ? 'phone' : 'down'}
          armL={stage.hands ? 'press' : 'down'}
          tilt="down"
          eyes="worried"
          mouth={talking('player') ? 'open' : 'flat'}
        />
      );
    if (rescuer === 'back')
      return (
        <Person
          kind="player"
          x={bro.x + 22}
          y={bro.y - 10}
          armR={blowUp ? 'wave' : 'down'}
          armL="down"
          eyes="worried"
          mouth={talking('player') ? 'open' : 'flat'}
        />
      );
    if (rescuer === 'thrust')
      return (
        <Person
          kind="player"
          x={bro.x + 4}
          y={bro.y - 10}
          eyes="worried"
          mouth={talking('player') ? 'open' : 'flat'}
        />
      );
    if (rescuer === 'beside') {
      const x = bro.pose === 'sit' ? bro.x - 58 : bro.x - 56;
      return (
        <Person
          kind="player"
          x={x}
          y={298}
          armL={stage.phone ? 'down' : 'shoulder'}
          armR={stage.phone ? 'phone' : 'down'}
          tilt="down"
          eyes="worried"
          mouth={talking('player') ? 'open' : 'flat'}
        />
      );
    }
    return null;
  };

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden bg-[#eef3df]">
      <motion.svg
        ref={ref}
        initial={false}
        animate={{ viewBox }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={focus ? 'Cận cảnh em trai' : 'Phòng ăn'}
      >
        {/* backdrop extends the room past its edges on wide screens */}
        <rect x={-1200} y={-600} width={2800} height={600 + DINING_FLOOR_Y} fill="#eef3df" />
        <rect x={-1200} y={DINING_FLOOR_Y} width={2800} height={900} fill="#ddb688" />
        <path d={`M-1200 ${DINING_FLOOR_Y} H1600`} stroke={INK} strokeWidth={2.5} />
        <DiningRoom ambulance={stage.ambulance} />

        {/* chairs behind the table, then whoever sits on them, then the table in front */}
        <DiningChair x={SEAT.x} seatY={SEAT.y} />
        <DiningChair x={PLAYER_SEAT.x} seatY={PLAYER_SEAT.y} />
        {rescuer === 'none' && bro.pose === 'sit' && (
          <Person
            kind="player"
            pose="sit"
            {...PLAYER_SEAT}
            armL="hold"
            eyes={choking ? 'worried' : 'happy'}
            mouth={talking('player') ? 'open' : choking ? 'flat' : 'smile'}
          />
        )}
        {bro.pose === 'sit' && (
          <Person
            kind="brother"
            pose="sit"
            x={bro.x}
            y={bro.y}
            tilt={lean ? 'down' : 'normal'}
            armR={stage.choke === 'none' ? 'hold' : 'down'}
            armL={stage.choke === 'weak' ? 'throat' : 'down'}
            eyes={face.eyes}
            mouth={talking('brother') ? 'open' : face.mouth}
            sweat={stage.choke === 'weak'}
          />
        )}
        <DiningTable grapes />

        {has('grandma') && (
          <Person
            kind="grandma"
            x={58}
            y={296}
            armL={talking('grandma') ? 'point' : 'down'}
            eyes={talking('grandma') ? 'open' : 'worried'}
            mouth={talking('grandma') ? 'open' : 'flat'}
          />
        )}

        {/* standing brother with the player behind him */}
        {bro.pose === 'stand' && (rescuer === 'back' || rescuer === 'thrust') && player()}
        {bro.pose === 'stand' && (
          <Person
            kind="brother"
            x={bro.x}
            y={bro.y}
            tilt={lean ? 'down' : 'normal'}
            armR={rescuer === 'thrust' || rescuer === 'back' ? 'down' : 'throat'}
            armL={rescuer === 'thrust' || rescuer === 'back' ? 'down' : 'throat'}
            eyes={face.eyes}
            mouth={talking('brother') ? 'open' : face.mouth}
            sweat
          />
        )}
        {bro.pose === 'stand' && rescuer === 'back' && (
          <>
            {/* supporting hand on the chest keeps him leaning forward */}
            <Limb
              d={`M${bro.x + 20} ${hip - 26 * K} L${bro.x + 5} ${hip - 20 * K}`}
              color={playerLook.skin}
              width={5.5}
            />
            <ellipse
              cx={bro.x + 4}
              cy={hip - 20 * K}
              rx={5.4}
              ry={3.8}
              fill={playerLook.skin}
              {...stroke(2)}
            />
            <path
              d={`M${bro.x + 1} ${hip - 22 * K} v3 M${bro.x + 4} ${hip - 22.5 * K} v3`}
              stroke={INK}
              strokeWidth={0.9}
              opacity={0.6}
            />
            {!blowUp && <Impact key={presses} x={backSpot.x + 16} y={backSpot.y - 4} />}
          </>
        )}
        {bro.pose === 'stand' && rescuer === 'thrust' && (
          <motion.g
            key={presses}
            initial={{ y: presses > 0 ? -4 : 0 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Limb
              d={`M${fist.x - 20} ${fist.y - 6} L${fist.x - 4} ${fist.y}`}
              color={playerLook.skin}
              width={6}
            />
            <Limb
              d={`M${fist.x + 20} ${fist.y - 6} L${fist.x + 4} ${fist.y}`}
              color={playerLook.skin}
              width={6}
            />
            <circle cx={fist.x} cy={fist.y} r={5.4} fill={playerLook.skin} {...stroke(2)} />
            <circle
              cx={fist.x + 2}
              cy={fist.y - 1}
              r={4.4}
              fill={playerLook.skin}
              {...stroke(1.8)}
            />
          </motion.g>
        )}

        {/* on the floor: player kneeling behind, brother lying in front */}
        {bro.pose === 'lie' && rescuer === 'kneel' && player()}
        {bro.pose === 'lie' && (
          <g transform={`translate(${bro.x} ${bro.y})`}>
            <LyingPerson kind="brother" k={LYING_K} awake={stage.choke === 'breathing'} />
          </g>
        )}
        {bro.pose === 'lie' && stage.hands && (
          <PressingHands
            key={presses}
            x={bro.x - 20 * LYING_K * K}
            y={bro.y - 2}
            down={presses % 2 === 1}
          />
        )}
        {bro.pose === 'lie' && stage.choke === 'breathing' && (
          <path
            d={`M${bro.x - 72 * LYING_K * K} ${bro.y - 16} q4 -4 8 0 t8 0`}
            fill="none"
            stroke={C.blueDark}
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
          </path>
        )}
        {rescuer === 'beside' && player()}

        {stage.called && !stage.hands && bro.pose === 'lie' && (
          <g transform={`translate(${bro.x + 26} ${bro.y - 92})`}>
            <rect x={-26} y={-12} width={52} height={22} rx={8} fill={C.white} {...stroke(2)} />
            <text
              x={0}
              y={4}
              textAnchor="middle"
              fontFamily="Itim, sans-serif"
              fontSize={12}
              fill={C.redDark}
            >
              115 🔊
            </text>
          </g>
        )}

        {/* coughing / choking signs */}
        {(stage.choke === 'cough' || stage.choke === 'weak') && (
          <CoughMarks x={bro.x - 4} y={headY - 30 * K} weak={stage.choke === 'weak'} />
        )}
        {stage.choke === 'severe' && (
          <text
            x={bro.x - 34 * K}
            y={headY - 18}
            fontFamily="Itim, sans-serif"
            fontSize={18}
            fill={C.red}
            stroke={INK}
            strokeWidth={1.2}
          >
            !
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </text>
        )}

        {has('mom') && (
          <Person
            kind="mom"
            x={318}
            y={302}
            armL={talking('mom') ? 'point' : 'hip'}
            armR={cast.includes('grandma') ? 'hold' : 'down'}
            flip
            eyes="worried"
            mouth={talking('mom') ? 'open' : 'flat'}
          />
        )}
        {has('mom') && cast.includes('grandma') && (
          <g transform="translate(326 258)">
            <WaterGlass x={0} y={0} k={1.1} />
          </g>
        )}
        {has('dad') && (
          <Person
            kind="dad"
            x={372}
            y={298}
            armL={talking('dad') ? 'point' : 'down'}
            flip
            mouth={talking('dad') ? 'open' : 'flat'}
          />
        )}
        {stage.ambulance && (
          <Person kind="medic" x={bro.x + 96} y={300} armL="wave" flip eyes="open" mouth="smile" />
        )}
      </motion.svg>

      {showCloseup && stage.choke !== 'none' && !stage.ambulance && (
        <div className="ink-border absolute left-[max(10px,env(safe-area-inset-left))] top-[70px] z-10 aspect-square h-[30%] max-h-44 overflow-hidden rounded-2xl bg-paper shadow-soft short:top-[46px] tiny:top-[40px]">
          <svg viewBox="-42 -40 84 82" className="h-[calc(100%-18px)] w-full" aria-hidden>
            <rect x={-42} y={-40} width={84} height={82} fill="#eef3df" />
            <path
              d="M-20 42 Q-22 26 -10 22 H10 Q22 26 20 42 Z"
              fill={LOOKS.brother.shirt}
              {...stroke(2)}
            />
            <g transform="scale(1.05)">
              <Head
                look={LOOKS.brother}
                face={
                  stage.choke === 'down'
                    ? { eyes: 'closed', mouth: 'flat' }
                    : stage.choke === 'breathing'
                      ? { eyes: 'open', mouth: 'smile' }
                      : { ...face, tilt: lean ? 'down' : 'normal' }
                }
              />
            </g>
            {stage.choke === 'severe' && !lean && (
              <g>
                <circle cx={-7} cy={27} r={6} fill={LOOKS.brother.skin} {...stroke(2)} />
                <circle cx={7} cy={27} r={6} fill={LOOKS.brother.skin} {...stroke(2)} />
              </g>
            )}
            {(stage.choke === 'cough' || stage.choke === 'weak') && (
              <CoughMarks x={24} y={38} size={9} weak={stage.choke === 'weak'} />
            )}
          </svg>
          <p className="border-t-2 border-navy bg-[#fff1c2] text-center font-display text-[11px] leading-4 text-navy">
            Cận cảnh
          </p>
        </div>
      )}
      {children}
    </div>
  );
});
