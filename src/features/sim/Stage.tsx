import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef } from 'react';
import { BagIcon, BandageIcon, ClockIcon, ShopIcon } from '../../art/icons';
import { LivingRoom, ROOM_H, ROOM_W } from '../../art/LivingRoom';
import { Person } from '../../art/Person';
import { ProfileArt } from '../../art/Profile';
import { cn } from '../../lib/cn';
import { CAST_NAMES, COMFORT_MOM, NOSE_TARGET, SPOTS } from './stageLayout';
import type { CastMember, StageState } from './types';

type StageProps = {
  cast: CastMember[];
  stage: StageState;
  /** Character currently talking (intro). */
  speaker?: CastMember | null;
  line?: string | null;
  caption?: string | null;
  /** Side-view close-up of the brother (hidden during the story intro). */
  showCloseup?: boolean;
  bandages: number;
  bagCount: number;
  onOpenBag?: () => void;
  onOpenShop?: () => void;
  /** Bouncing arrow pointing at a button. */
  pointAt?: 'bag' | 'shop' | null;
  /** Highlights the brother's nose as a drop target. */
  dropTarget?: boolean;
  onTargetTap?: () => void;
  children?: React.ReactNode;
};

function SpeechBubble({
  who,
  text,
  spot,
}: {
  who: CastMember;
  text: string;
  spot: { x: number; headTop: number };
}) {
  const xPct = (spot.x / ROOM_W) * 100;
  const align = xPct < 32 ? 'left' : xPct > 68 ? 'right' : 'center';
  return (
    // Positioning lives on the outer div: framer-motion owns the inner element's transform.
    <div
      className="absolute z-10 max-w-[62%]"
      style={{
        top: `${(spot.headTop / ROOM_H) * 100}%`,
        ...(align === 'left' && { left: '2%' }),
        ...(align === 'right' && { right: '2%' }),
        ...(align === 'center' && { left: `${xPct}%` }),
        transform: `translate(${align === 'center' ? '-50%' : '0'}, calc(-100% - 6px))`,
      }}
    >
      <motion.div
        key={`${who}-${text}`}
        initial={{ opacity: 0, scale: 0.6, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ transformOrigin: 'bottom' }}
        className="ink-border relative rounded-2xl bg-paper px-2.5 py-1.5 text-[13px] font-semibold leading-snug text-navy shadow-soft"
      >
        <span className="font-display text-sm text-primary-dark">{CAST_NAMES[who]}: </span>
        {text}
        <span
          aria-hidden
          className="absolute -bottom-[9px] h-4 w-4 rotate-45 border-b-[2.5px] border-r-[2.5px] border-navy bg-paper"
          style={{
            left: align === 'center' ? 'calc(50% - 8px)' : undefined,
            ...(align === 'left' && { left: `calc(${(xPct / 62) * 100}% - 8px)` }),
            ...(align === 'right' && { right: `calc(${((100 - xPct) / 62) * 100}% - 8px)` }),
          }}
        />
      </motion.div>
    </div>
  );
}

function SideButton({
  label,
  onClick,
  children,
  badge,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="ink-border relative grid h-12 w-12 place-items-center rounded-2xl bg-paper shadow-pop active:translate-y-0.5"
    >
      {children}
      {badge ? (
        <span className="ink-border absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1 font-display text-sm text-navy">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function PointArrow() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute -left-11 top-1/2 -translate-y-1/2"
      animate={{ x: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 0.9 }}
    >
      <svg viewBox="0 0 40 30" width={36} height={27}>
        <path
          d="M2 10 H22 V3 L38 15 L22 27 V20 H2 Z"
          fill="#fffdf6"
          stroke="#3b2d26"
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </svg>
    </motion.span>
  );
}

/** The living-room scene with every character of the round. */
export const Stage = forwardRef<HTMLDivElement, StageProps>(function Stage(
  {
    cast,
    stage,
    speaker,
    line,
    caption,
    showCloseup,
    bandages,
    bagCount,
    onOpenBag,
    onOpenShop,
    pointAt,
    dropTarget,
    onTargetTap,
    children,
  },
  ref,
) {
  const has = (c: CastMember) => cast.includes(c);
  const bleedingFace = stage.bleeding && !stage.icePack;
  const tilt = stage.posture === 'forward' ? 'down' : stage.posture === 'back' ? 'up' : 'normal';
  const momSpot = stage.comfort ? COMFORT_MOM : SPOTS.mom;
  const spotOf = (c: CastMember) => (c === 'mom' ? momSpot : SPOTS[c]);

  return (
    <div
      ref={ref}
      className="ink-border relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-[#f3eed3]"
    >
      <svg
        viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
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
        {has('mom') && stage.comfort && (
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
            armR={speaker === 'dad' ? 'point' : 'down'}
            mouth={speaker === 'dad' ? 'open' : 'flat'}
          />
        )}
      </svg>

      {/* bandage balance */}
      <div className="ink-border absolute right-2 top-2 flex items-center gap-1 rounded-xl bg-paper py-0.5 pl-1 pr-2 font-display text-lg text-navy shadow-soft">
        <BandageIcon size={26} />
        <span aria-label={`${bandages} băng gạc`}>{bandages}</span>
      </div>

      {stage.clock && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ink-border absolute flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-display text-sm text-navy"
          style={{ left: '57%', top: '27%' }}
        >
          <ClockIcon minutes={15} size={20} />
          {stage.clock}
        </motion.div>
      )}

      {showCloseup && !stage.ambulance && (
        <div className="ink-border absolute left-2 top-2 w-[27%] overflow-hidden rounded-2xl bg-paper shadow-soft">
          <ProfileArt
            key={`${stage.posture}-${stage.pinch}-${stage.mouthOpen}-${stage.icePack}-${stage.dizzy}`}
            className="aspect-square w-full"
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
          <p className="border-t-2 border-navy bg-[#fff1c2] text-center font-display text-[11px] leading-5 text-navy">
            Cận cảnh
          </p>
        </div>
      )}

      {dropTarget && (
        <motion.button
          type="button"
          aria-label="Đặt vật dụng lên mũi em trai"
          onClick={onTargetTap}
          className="absolute rounded-full border-[3px] border-dashed border-primary-dark bg-white/30"
          style={{
            left: `${NOSE_TARGET.x - NOSE_TARGET.r}%`,
            top: `calc(${NOSE_TARGET.y}% - ${(NOSE_TARGET.r * 4) / 3}%)`,
            width: `${NOSE_TARGET.r * 2}%`,
            aspectRatio: '1',
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 1.1 }}
        />
      )}

      <div className="absolute right-2 top-[17%] flex flex-col gap-2.5">
        <div className="relative">
          {pointAt === 'bag' && <PointArrow />}
          <SideButton label={`Túi vật dụng (${bagCount} món)`} onClick={onOpenBag} badge={bagCount}>
            <BagIcon size={34} />
          </SideButton>
        </div>
        <div className="relative">
          {pointAt === 'shop' && <PointArrow />}
          <SideButton label="Cửa hàng vật dụng" onClick={onOpenShop}>
            <ShopIcon size={34} />
          </SideButton>
        </div>
      </div>

      <AnimatePresence>
        {speaker && line && (
          <SpeechBubble key={line} who={speaker} text={line} spot={spotOf(speaker)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {caption && (
          <motion.p
            key={caption}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'ink-border absolute bottom-2 left-2 right-2 rounded-xl bg-paper/95 px-2 py-1 text-[12px] font-semibold leading-snug text-navy',
            )}
          >
            ✨ {caption}
          </motion.p>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
});
