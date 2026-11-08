import { motion } from 'framer-motion';
import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { C, INK, stroke } from '../../art/ink';
import { LivingRoom, SOFA_SEAT_Y } from '../../art/LivingRoom';
import { LOOKS } from '../../art/looks';
import { Person, type ArmPose, type Eyes, type HeadTilt, type Mouth } from '../../art/Person';
import {
  Aspirin,
  BreathMarks,
  Cup,
  LYING_CHEST_DX,
  NamHead,
  NamOnBack,
  NamRecovery,
  SideTable,
  SlurBubble,
} from '../../art/StrokeArt';
import { PressingHands } from '../../art/WaterScenes';
import type { CastMember, NamState, StageState } from './types';

/* Scenario 3 stage: the living room with Bác Nam on the sofa (or on the floor once he loses
 * consciousness), the player, cô Lan and – at the very end – the ambulance crew. */

const NAM_K = LOOKS.nam.scale;
const SEAT = { x: 200, y: SOFA_SEAT_Y + 4 };
/** Hips of Bác Nam lying on the rug (head to the left). */
const FLOOR = { x: 244, y: 262 };
const LYING_K = 0.9;
const TABLE = { x: 304, y: 214 };
const LAN = { x: 348, y: 292 };
const PLAYER = { x: 70, y: 290 };
/** Player sitting next to Bác Nam on the right sofa cushion. */
const BESIDE = { x: 268, y: SOFA_SEAT_Y };

const onFloor = (n: NamState) => n === 'recovery' || n === 'floor' || n === 'cpr';

/** Face and arms of Bác Nam sitting on the sofa, by state. */
function namLook(
  stage: StageState,
  talking: boolean,
): { eyes: Eyes; mouth: Mouth; tilt: HeadTilt; armR: ArmPose; armL: ArmPose } {
  switch (stage.nam) {
    case 'calm':
      return {
        eyes: 'open',
        mouth: talking ? 'open' : 'smile',
        tilt: 'normal',
        armR: stage.cup === 'hand' ? 'hold' : 'down',
        armL: 'down',
      };
    case 'better':
      return {
        eyes: 'open',
        mouth: talking ? 'open' : 'flat',
        tilt: 'normal',
        armR: 'down',
        armL: 'down',
      };
    case 'unresponsive':
      return { eyes: 'closed', mouth: 'droop', tilt: 'down', armR: 'down', armL: 'limp' };
    default:
      return { eyes: 'worried', mouth: 'droop', tilt: 'normal', armR: 'down', armL: 'limp' };
  }
}

type StrokeStageProps = {
  cast: CastMember[];
  stage: StageState;
  speaker?: CastMember | null;
  /** `wide` = the whole living room (story), `focus` = zoomed on Bác Nam while answering. */
  mode: 'wide' | 'focus';
  /** Horizontal position of Bác Nam on screen in focus mode (0–1). */
  focusX?: number;
  showCloseup?: boolean;
  children?: React.ReactNode;
};

const WIDE = { y: 24, h: 334 };
const FOCUS = { y: 46, h: 196, x: 200 };
const FOCUS_FLOOR = { y: 112, h: 236, x: 236 };

function clockOf(label: string | null): { h: number; m: number } | null {
  const m = label?.match(/^(\d{1,2}):(\d{2})$/);
  return m ? { h: Number(m[1]), m: Number(m[2]) } : null;
}

export const StrokeStage = forwardRef<SVGSVGElement, StrokeStageProps>(function StrokeStage(
  { cast, stage, speaker, mode, focusX = 0.5, showCloseup, children },
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
  const floor = onFloor(stage.nam);
  const box = focus ? (floor ? FOCUS_FLOOR : FOCUS) : WIDE;
  const w = box.h * aspect;
  const x0 = focus ? (floor ? FOCUS_FLOOR.x : FOCUS.x) - focusX * w : 200 - w / 2;
  const viewBox = `${x0.toFixed(1)} ${box.y} ${w.toFixed(1)} ${box.h}`;
  const has = (c: CastMember) => cast.includes(c) && !focus;
  const clock = clockOf(stage.clock);

  const look = namLook(stage, speaker === 'nam');
  const head = { x: SEAT.x, y: SEAT.y - 62 * NAM_K };
  const mouth = { x: head.x, y: head.y + 15 * 1.12 * NAM_K };
  const weakHand = { x: SEAT.x + 25 * NAM_K, y: SEAT.y + 10 * NAM_K };
  const lyingS = LYING_K * NAM_K;
  const chest = { x: FLOOR.x + LYING_CHEST_DX * lyingS, y: FLOOR.y };
  const face = { x: FLOOR.x - 62 * lyingS, y: FLOOR.y };

  // Where the player is: kneeling for CPR, kneeling by his head, next to him on the sofa, standing.
  const sofaCare =
    !floor && stage.nam !== 'calm' && stage.nam !== 'stroke' && (stage.phone || stage.lanPhone);
  const kneelHead = floor && !stage.hands;
  // Close to Bác Nam the player stays visible even in the zoomed-in shot.
  const playerShown = cast.includes('player');

  const phoneBubble = (x: number, y: number) => (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-21} y={-11} width={42} height={20} rx={8} fill={C.white} {...stroke(2)} />
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fontFamily="Itim, sans-serif"
        fontSize={11}
        fill={C.redDark}
      >
        115 🔊
      </text>
    </g>
  );

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden bg-[#f3eed3]">
      <motion.svg
        ref={ref}
        initial={false}
        animate={{ viewBox }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={focus ? 'Cận cảnh bác Nam' : 'Phòng khách nhà bác Nam'}
      >
        <rect x={-1200} y={-600} width={2800} height={792} fill={C.wall} />
        <rect x={-1200} y={192} width={2800} height={900} fill={C.floor} />
        <path d="M-1200 192 H1600" stroke={INK} strokeWidth={2.5} />
        <LivingRoom
          ambulance={stage.ambulance}
          clockMinutes={clock?.m ?? 10}
          clockHours={clock?.h}
          clockHighlight={stage.freeze}
          tvOn={!floor && !stage.ambulance}
        />

        <SideTable {...TABLE} />
        {stage.cup === 'table' && <Cup x={TABLE.x - 7} y={TABLE.y - 40} />}
        {stage.aspirin === 'table' && (
          <Aspirin x={TABLE.x + 9} y={TABLE.y - 34} s={0.7} rot={-8} crossed />
        )}
        {stage.cup === 'floor' && <Cup x={176} y={214} tipped />}

        {/* Player sitting beside Bác Nam or kneeling on the floor is drawn behind him. */}
        {playerShown && sofaCare && (
          <Person
            kind="player"
            pose="sit"
            {...BESIDE}
            scale={0.92}
            armR={stage.phone ? 'phone' : 'shoulder'}
            eyes="worried"
            mouth={speaker === 'player' ? 'open' : 'flat'}
          />
        )}
        {playerShown && stage.hands && (
          <Person
            kind="player"
            pose="sit"
            x={chest.x}
            y={chest.y - 2 - 22 * 0.95}
            scale={0.95}
            armR="press"
            armL="press"
            eyes="worried"
            mouth="flat"
          />
        )}
        {playerShown && kneelHead && (
          <Person
            kind="player"
            pose="sit"
            x={face.x - 10}
            y={FLOOR.y - 26}
            scale={0.92}
            armR="down"
            armL="point"
            eyes="worried"
            mouth={speaker === 'player' ? 'open' : 'flat'}
          />
        )}

        {floor ? (
          <g transform={`translate(${FLOOR.x} ${FLOOR.y})`}>
            {stage.nam === 'recovery' ? <NamRecovery k={LYING_K} /> : <NamOnBack k={LYING_K} />}
          </g>
        ) : (
          <Person kind="nam" pose="sit" {...SEAT} {...look} />
        )}
        {stage.hands && <PressingHands x={chest.x} y={chest.y - 2} />}
        {floor && stage.breathing && (
          <BreathMarks
            x={face.x - 4}
            y={FLOOR.y - (stage.nam === 'recovery' ? 30 : 26)}
            mode={stage.breathing}
          />
        )}
        {!floor && stage.cup === 'hand' && <Cup x={SEAT.x - 7 * NAM_K} y={SEAT.y - 19 * NAM_K} />}

        {/* Face–Arm–Speech signs circled once spotted */}
        {stage.signs && !floor && (
          <g fill="none" stroke={C.redDark} strokeWidth={2} strokeDasharray="4 3">
            <ellipse cx={mouth.x + 2} cy={mouth.y + 1} rx={11} ry={8} />
            <ellipse cx={weakHand.x - 2} cy={weakHand.y - 10} rx={9} ry={20} />
          </g>
        )}
        {!floor && (stage.nam === 'stroke' || (stage.signs && stage.nam !== 'calm')) && (
          <SlurBubble x={head.x + 46} y={head.y - 30} s={0.9} />
        )}

        {has('lan') && (
          <Person
            kind="lan"
            {...LAN}
            armR={stage.cup === 'lan' ? 'hold' : 'down'}
            armL={
              stage.lanPhone
                ? 'phone'
                : stage.aspirin === 'lan'
                  ? 'hold'
                  : speaker === 'lan'
                    ? 'point'
                    : 'hip'
            }
            eyes="worried"
            mouth={speaker === 'lan' ? 'open' : 'flat'}
          />
        )}
        {has('lan') && stage.cup === 'lan' && <Cup x={LAN.x - 7.5} y={LAN.y - 50} />}
        {has('lan') && stage.aspirin === 'lan' && (
          <Aspirin x={LAN.x + 9} y={LAN.y - 49} s={0.6} rot={10} />
        )}

        {has('player') && !sofaCare && !stage.hands && !kneelHead && (
          <Person
            kind="player"
            {...PLAYER}
            armR={stage.phone ? 'phone' : speaker === 'player' ? 'point' : 'down'}
            eyes="worried"
            mouth={speaker === 'player' ? 'open' : 'flat'}
          />
        )}
        {has('paramedic') && stage.ambulance && (
          <Person
            kind="paramedic"
            x={136}
            y={294}
            armR="hold"
            armL="down"
            eyes="open"
            mouth="flat"
          />
        )}

        {stage.called &&
          !stage.ambulance &&
          (stage.lanPhone
            ? has('lan') && phoneBubble(LAN.x + 34, LAN.y - 112)
            : stage.phone &&
              (sofaCare
                ? !focus && phoneBubble(BESIDE.x + 36, BESIDE.y - 76)
                : !focus && phoneBubble(PLAYER.x + 36, PLAYER.y - 140)))}
      </motion.svg>

      {showCloseup && !floor && !stage.ambulance && stage.nam !== 'calm' && (
        <div className="ink-border absolute left-[max(10px,env(safe-area-inset-left))] top-[70px] z-10 aspect-square h-[30%] max-h-44 overflow-hidden rounded-2xl bg-paper shadow-soft short:top-[46px] tiny:top-[40px]">
          <svg viewBox="-36 -40 72 72" className="h-[calc(100%-18px)] w-full" aria-hidden>
            <rect x={-36} y={-40} width={72} height={72} fill="#fff7e6" />
            <NamHead x={0} y={-2} eyes={look.eyes} mouth={look.mouth} />
            {stage.signs && (
              <ellipse
                cx={3}
                cy={14}
                rx={11}
                ry={7}
                fill="none"
                stroke={C.redDark}
                strokeWidth={1.6}
                strokeDasharray="3 2"
              />
            )}
          </svg>
          <p className="border-t-2 border-navy bg-[#fff1c2] text-center font-display text-[11px] leading-4 text-navy">
            Cận cảnh
          </p>
        </div>
      )}

      {(stage.freeze || stage.banner) && (
        <div className="pointer-events-none absolute bottom-[max(10px,env(safe-area-inset-bottom))] left-[max(10px,env(safe-area-inset-left))] z-10 flex flex-col items-start gap-1">
          {stage.banner && (
            <motion.span
              key={stage.banner}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ink-border rounded-full bg-primary px-3 py-0.5 font-display text-[15px] text-white shadow-soft short:text-[12px]"
            >
              {stage.banner}
            </motion.span>
          )}
          {stage.freeze && (
            <span className="ink-border rounded-full bg-paper px-3 py-0.5 font-display text-[13px] text-navy shadow-soft short:text-[11px]">
              ⏸ Tạm dừng thời gian để học
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
});
