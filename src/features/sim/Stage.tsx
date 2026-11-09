import { motion } from 'framer-motion';
import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { C, INK } from '../../art/ink';
import { LivingRoom } from '../../art/LivingRoom';
import { Person } from '../../art/Person';
import { ProfileArt } from '../../art/Profile';
import { COMFORT_MOM, NOSE_POINT, SPOTS, focusBox } from './stageLayout';
import type { CastMember, StageState } from './types';

type StageProps = {
  cast: CastMember[];
  stage: StageState;
  /** Character currently talking (intro). */
  speaker?: CastMember | null;
  /**
   * `wide` shows the whole living room (story intro); `focus` zooms in on the brother so the
   * player can concentrate on him while answering.
   */
  mode: 'wide' | 'focus';
  /** Horizontal position of the brother on screen in focus mode (0–1). */
  focusX?: number;
  /** Side-view close-up of the brother. */
  showCloseup?: boolean;
  /** Highlights the brother's nose as a drop target. */
  dropTarget?: boolean;
  onTargetTap?: () => void;
  children?: React.ReactNode;
};

const WIDE = { y: 24, h: 334 };
const FOCUS = { y: 14, h: 216, x: 200 };

/** The living-room scene filling the whole screen; forwards a ref to the <svg>. */
export const Stage = forwardRef<SVGSVGElement, StageProps>(function Stage(
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
  const box = focus ? focusBox(FOCUS, aspect) : WIDE;
  const w = box.h * aspect;
  const x0 = focus ? FOCUS.x - focusX * w : 200 - w / 2;
  const viewBox = `${x0.toFixed(1)} ${box.y.toFixed(1)} ${w.toFixed(1)} ${box.h.toFixed(1)}`;

  const has = (c: CastMember) => cast.includes(c) && !focus;
  const bleedingFace = stage.bleeding && !stage.icePack;
  const tilt = stage.posture === 'forward' ? 'down' : stage.posture === 'back' ? 'up' : 'normal';

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
        aria-label={focus ? 'Cận cảnh em trai' : 'Phòng khách'}
      >
        {/* backdrop extends the room past its edges on wide screens */}
        <rect x={-1200} y={-600} width={2800} height={792} fill={C.wall} />
        <rect x={-1200} y={192} width={2800} height={900} fill={C.floor} />
        <path d="M-1200 192 H1600" stroke={INK} strokeWidth={2.5} />
        <LivingRoom
          ambulance={stage.ambulance}
          clockHighlight={Boolean(stage.clock)}
          clockMinutes={stage.clock ? 15 : 8}
        />
        {has('grandma') && (
          <Person
            kind="grandma"
            pose="sit"
            {...SPOTS.grandma}
            eyes={speaker === 'grandma' ? 'open' : 'worried'}
            mouth={speaker === 'grandma' ? 'open' : 'flat'}
          />
        )}
        {cast.includes('mom') && stage.comfort && (
          <Person
            kind="mom"
            pose="sit"
            {...COMFORT_MOM}
            armR="shoulder"
            eyes="open"
            mouth="smile"
          />
        )}
        <Person
          kind="brother"
          pose="sit"
          {...SPOTS.brother}
          tilt={tilt}
          armR={stage.pinch ? 'nose' : 'down'}
          eyes={stage.dizzy ? 'dizzy' : stage.bleeding ? 'worried' : 'open'}
          mouth={stage.mouthOpen ? 'open' : speaker === 'brother' ? 'o' : 'frown'}
          blood={bleedingFace}
          icePack={stage.icePack}
          sweat={stage.dizzy}
        />
        {has('player') && (
          <Person
            kind="player"
            {...SPOTS.player}
            armR={stage.phone ? 'phone' : speaker === 'player' ? 'point' : 'down'}
            eyes="worried"
            mouth={speaker === 'player' ? 'open' : 'flat'}
          />
        )}
        {has('mom') && !stage.comfort && (
          <Person
            kind="mom"
            {...SPOTS.mom}
            armL="hip"
            eyes="worried"
            mouth={speaker === 'mom' ? 'open' : 'flat'}
          />
        )}
        {has('dad') && (
          <Person
            kind="dad"
            {...SPOTS.dad}
            armL={speaker === 'dad' ? 'point' : 'down'}
            mouth={speaker === 'dad' ? 'open' : 'flat'}
          />
        )}
        {dropTarget && (
          <g
            role="button"
            tabIndex={0}
            aria-label="Đặt vật dụng lên mũi em trai"
            onClick={onTargetTap}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTargetTap?.()}
            className="cursor-pointer"
          >
            <circle
              cx={NOSE_POINT.x}
              cy={NOSE_POINT.y}
              r={NOSE_POINT.r}
              fill="rgb(255 255 255 / 0.35)"
              stroke={C.redDark}
              strokeWidth={2}
              strokeDasharray="5 4"
            >
              <animate
                attributeName="r"
                values={`${NOSE_POINT.r};${NOSE_POINT.r * 1.15};${NOSE_POINT.r}`}
                dur="1.1s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </motion.svg>

      {showCloseup && !stage.ambulance && (
        <div className="ink-border absolute left-[max(10px,env(safe-area-inset-left))] top-[70px] z-10 aspect-square h-[30%] max-h-44 short:top-[46px] tiny:top-[40px] overflow-hidden rounded-2xl bg-paper shadow-soft">
          <ProfileArt
            key={`${stage.posture}-${stage.pinch}-${stage.mouthOpen}-${stage.icePack}-${stage.dizzy}`}
            className="h-[calc(100%-18px)] w-full"
            lean={stage.posture === 'forward' ? 16 : stage.posture === 'back' ? -12 : 2}
            tilt={stage.posture === 'forward' ? 6 : stage.posture === 'back' ? -28 : 0}
            hand={stage.pinch ? 'pinch-soft' : 'lap'}
            mouth={stage.mouthOpen ? 'open' : 'frown'}
            eyes={stage.dizzy ? 'dizzy' : 'worried'}
            blood={stage.pinch ? 'stopped' : stage.bleeding ? 'drip' : 'none'}
            furniture="sofa"
          >
            {(g) =>
              stage.icePack ? (
                <rect
                  x={g.at(14, -16).x}
                  y={g.at(14, -16).y}
                  width={16}
                  height={9}
                  rx={4}
                  fill="#bfe6f5"
                  stroke="#3b2d26"
                  strokeWidth={2}
                />
              ) : null
            }
          </ProfileArt>
          <p className="border-t-2 border-navy bg-[#fff1c2] text-center font-display text-[11px] leading-4 text-navy">
            Cận cảnh
          </p>
        </div>
      )}
      {children}
    </div>
  );
});
