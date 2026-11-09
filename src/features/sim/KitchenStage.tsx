import { motion } from 'framer-motion';
import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { BurnArm, TapStream } from '../../art/BurnArm';
import { C, INK, stroke, type Pt } from '../../art/ink';
import { Kitchen, KITCHEN_FLOOR_Y, TAP } from '../../art/Kitchen';
import { LOOKS } from '../../art/looks';
import { Person, type ArmPose } from '../../art/Person';
import { focusBox } from './stageLayout';
import type { CastMember, StageState } from './types';

/** Scale of the sister (on top of her look's own scale). */
const K = LOOKS.sister.scale;
/** Standing in the middle of the kitchen, at the sink (hand under the tap), or on a stool. */
const SISTER = { x: 200, y: 268 };
const AT_SINK = { x: TAP.x + 36 * K, y: TAP.waterY - 4 + (52 + 30) * K };
const STOOL = { x: 206, y: 250 };

function sisterSpot(stage: StageState): {
  x: number;
  y: number;
  pose: 'stand' | 'sit';
  arm: ArmPose;
} {
  if (stage.atSink) return { ...AT_SINK, pose: 'stand', arm: 'reach' };
  if (stage.rest) return { ...STOOL, pose: 'sit', arm: 'down' };
  return { ...SISTER, pose: 'stand', arm: 'down' };
}

/** Middle of the burned forearm in kitchen units – the drop target for the cling film. */
// eslint-disable-next-line react-refresh/only-export-components -- shared scene geometry
export function kitchenTarget(stage: StageState): Pt & { r: number } {
  const s = sisterSpot(stage);
  const lift = s.pose === 'sit' ? 0 : -30;
  // Forearm middle of the right arm (viewer's left) for the current pose, in body units.
  const fore = s.arm === 'reach' ? { x: -31.5, y: -41 } : { x: -20.5, y: -11 };
  return { x: s.x + fore.x * K, y: s.y + (fore.y + lift) * K, r: 14 };
}

type KitchenStageProps = {
  cast: CastMember[];
  stage: StageState;
  speaker?: CastMember | null;
  /** `wide` = whole kitchen (story), `focus` = zoomed on the sister while answering. */
  mode: 'wide' | 'focus';
  focusX?: number;
  showCloseup?: boolean;
  dropTarget?: boolean;
  onTargetTap?: () => void;
  children?: React.ReactNode;
};

const WIDE = { y: 20, h: 290 };
/** Zoom used while answering: the sister's whole body plus the tap, centred on her. */
const FOCUS = { y: 52, h: 250 };

/** Scenario 5 stage: the kitchen filling the screen; forwards a ref to the <svg>. */
export const KitchenStage = forwardRef<SVGSVGElement, KitchenStageProps>(function KitchenStage(
  { cast, stage, speaker, mode, focusX = 0.5, showCloseup, dropTarget, onTargetTap, children },
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
  const sis = sisterSpot(stage);
  const box = focus ? focusBox(FOCUS, aspect) : WIDE;
  const w = box.h * aspect;
  const x0 = focus ? sis.x - 8 - focusX * w : 200 - w / 2;
  const viewBox = `${x0.toFixed(1)} ${box.y.toFixed(1)} ${w.toFixed(1)} ${box.h.toFixed(1)}`;
  // Zoomed in, only the sister is shown (the others would stand in front of the camera).
  const has = (c: CastMember) => cast.includes(c) && !focus;
  const hurt = stage.burn !== 'none' && !stage.wrap;
  const target = kitchenTarget(stage);
  const severe = stage.burn === 'severe';

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden bg-[#fbeedb]">
      <motion.svg
        ref={ref}
        initial={false}
        animate={{ viewBox }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={focus ? 'Cận cảnh em gái' : 'Phòng bếp'}
      >
        {/* backdrop extends the room past its edges on wide screens */}
        <rect x={-1200} y={-600} width={2800} height={600 + KITCHEN_FLOOR_Y} fill="#fbeedb" />
        <rect x={-1200} y={KITCHEN_FLOOR_Y} width={2800} height={900} fill="#e4ccaa" />
        <Kitchen
          water={stage.atSink}
          steam={stage.burn !== 'none' && !stage.atSink && !stage.wrap && !stage.ambulance}
          spilled={severe}
          clockHighlight={Boolean(stage.clock)}
          clockMinutes={stage.clock ? 20 : 10}
          ambulance={stage.ambulance}
        />

        {has('grandma') && (
          <Person
            kind="grandma"
            x={356}
            y={298}
            armL={speaker === 'grandma' ? 'point' : 'down'}
            flip
            eyes={speaker === 'grandma' ? 'open' : 'worried'}
            mouth={speaker === 'grandma' ? 'open' : 'flat'}
          />
        )}
        {stage.rest && (
          <g>
            <rect
              x={STOOL.x - 20}
              y={STOOL.y}
              width={40}
              height={7}
              rx={3}
              fill={C.wood}
              {...stroke(2)}
            />
            <path
              d={`M${STOOL.x - 14} ${STOOL.y + 7} L${STOOL.x - 18} ${STOOL.y + 42} M${STOOL.x + 14} ${STOOL.y + 7} L${STOOL.x + 18} ${STOOL.y + 42}`}
              stroke={INK}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
        )}
        <Person
          kind="sister"
          pose={sis.pose}
          x={sis.x}
          y={sis.y}
          armR={sis.arm}
          armL={stage.rest || stage.blanket ? 'down' : 'hold'}
          eyes={hurt ? (stage.blanket ? 'closed' : 'worried') : 'open'}
          mouth={speaker === 'sister' ? 'open' : hurt ? 'frown' : 'smile'}
          sweat={hurt && !stage.atSink}
          burnArm={{ level: stage.burn, sleeve: stage.sleeve, wrap: stage.wrap }}
          chestBurn={severe}
          blanket={stage.blanket}
        />
        {has('player') && (
          <Person
            kind="player"
            x={92}
            y={300}
            armR={stage.phone ? 'phone' : speaker === 'player' ? 'point' : 'down'}
            flip
            eyes="worried"
            mouth={speaker === 'player' ? 'open' : 'flat'}
          />
        )}
        {has('mom') && (
          <Person
            kind="mom"
            x={298}
            y={300}
            armL={speaker === 'mom' ? 'point' : 'hip'}
            flip
            eyes="worried"
            mouth={speaker === 'mom' ? 'open' : 'flat'}
          />
        )}

        {dropTarget && (
          <g
            role="button"
            tabIndex={0}
            aria-label="Phủ màng bọc lên vết bỏng của em gái"
            onClick={onTargetTap}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTargetTap?.()}
            className="cursor-pointer"
          >
            <circle
              cx={target.x}
              cy={target.y}
              r={target.r}
              fill="rgb(255 255 255 / 0.35)"
              stroke={C.redDark}
              strokeWidth={2}
              strokeDasharray="5 4"
            >
              <animate
                attributeName="r"
                values={`${target.r};${target.r * 1.15};${target.r}`}
                dur="1.1s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </motion.svg>

      {showCloseup && stage.burn !== 'none' && !stage.ambulance && (
        <div className="ink-border absolute left-[max(10px,env(safe-area-inset-left))] top-[70px] z-10 aspect-square h-[30%] max-h-44 overflow-hidden rounded-2xl bg-paper shadow-soft short:top-[46px] tiny:top-[40px]">
          <svg viewBox="0 0 100 100" className="h-[calc(100%-18px)] w-full" aria-hidden>
            <rect width={100} height={100} fill={stage.atSink ? '#e4f2f7' : '#fbeedb'} />
            <BurnArm level={stage.burn} ring={stage.ring} sleeve={stage.sleeve} wrap={stage.wrap} />
            {stage.atSink && <TapStream />}
          </svg>
          <p className="border-t-2 border-navy bg-[#fff1c2] text-center font-display text-[11px] leading-4 text-navy">
            Cận cảnh vết bỏng
          </p>
        </div>
      )}
      {children}
    </div>
  );
});
