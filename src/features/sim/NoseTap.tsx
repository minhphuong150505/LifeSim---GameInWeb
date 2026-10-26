import { motion } from 'framer-motion';
import { useState } from 'react';
import { C, INK, stroke } from '../../art/ink';
import { Button } from '../../components/Button';
import { cn } from '../../lib/cn';
import { playSound, vibrate } from '../../lib/sound';

type Zone = 'bridge' | 'soft' | 'nostril';

/** Tap areas in % of the close-up (x, y, w, h). */
const ZONES: { id: Zone; label: string; box: [number, number, number, number]; tip: string }[] = [
  {
    id: 'bridge',
    label: 'Sống mũi (phần xương cứng)',
    box: [38, 4, 24, 40],
    tip: 'Đây là phần xương cứng – bóp ở đây không tạo đủ áp lực cầm máu.',
  },
  { id: 'soft', label: 'Phần mềm của mũi, ngay trên hai lỗ mũi', box: [28, 52, 44, 18], tip: '' },
  {
    id: 'nostril',
    label: 'Chỉ một bên lỗ mũi',
    box: [62, 70, 14, 14],
    tip: 'Chỉ bịt một bên lỗ mũi là chưa đủ – cần bóp cả hai cánh mũi.',
  },
];

/** Close-up of the nose: the player taps where to pinch (no penalty, just guidance). */
export function NoseTap({ onDone }: { onDone: () => void }) {
  const [miss, setMiss] = useState<Zone | null>(null);
  const [done, setDone] = useState(false);

  const tap = (zone: Zone) => {
    if (done) return;
    if (zone === 'soft') {
      setDone(true);
      setMiss(null);
      playSound('correct');
    } else {
      setMiss(zone);
      playSound('wrong');
      vibrate(80);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="ink-border rounded-card bg-[#fff1c2] p-3">
        <p className="font-display text-lg leading-snug text-navy">
          Nhiệm vụ: Chạm vào đúng vị trí cần bóp giữ trên hình cận cảnh mũi của em trai.
        </p>
      </div>
      <div className="ink-border relative mx-auto aspect-[5/4] w-full max-w-[340px] overflow-hidden rounded-[22px]">
        <svg viewBox="0 0 200 160" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect width={200} height={160} fill={C.skin} />
          <ellipse cx={34} cy={96} rx={22} ry={12} fill={C.blush} opacity={0.6} />
          <ellipse cx={166} cy={96} rx={22} ry={12} fill={C.blush} opacity={0.6} />
          <path d="M28 22 Q48 34 66 22" fill="none" {...stroke(3)} />
          <path d="M134 22 Q152 34 172 22" fill="none" {...stroke(3)} />
          <path d="M88 4 C90 40 86 70 74 94" fill="none" {...stroke(3)} />
          <path d="M112 4 C110 40 114 70 126 94" fill="none" {...stroke(3)} />
          <path
            d="M74 94 C58 98 58 120 74 122 C80 128 92 126 100 122 C108 126 120 128 126 122 C142 120 142 98 126 94 C120 104 110 104 100 104 C90 104 80 104 74 94 Z"
            fill={C.skinShade}
            {...stroke(3)}
          />
          <ellipse cx={88} cy={117} rx={7} ry={3.5} fill={INK} />
          <ellipse cx={112} cy={117} rx={7} ry={3.5} fill={INK} />
          {!done && (
            <path
              d="M112 121 C111 130 108 136 112 140 C116 136 114 130 112 121 Z"
              fill={C.blood}
              stroke={C.blood}
              strokeWidth={2}
            />
          )}
          <path d="M80 150 Q100 142 120 150" fill="none" {...stroke(3)} />
          {done && (
            <g>
              <ellipse cx={58} cy={110} rx={15} ry={12} fill={C.skin} {...stroke(3)} />
              <ellipse cx={142} cy={110} rx={15} ry={12} fill={C.skin} {...stroke(3)} />
              <path
                d="M40 130 C30 140 26 152 26 160 M160 130 C170 140 174 152 174 160"
                fill="none"
                {...stroke(3)}
              />
            </g>
          )}
        </svg>
        {ZONES.map((z) => (
          <button
            key={z.id}
            type="button"
            aria-label={z.label}
            onClick={() => tap(z.id)}
            className={cn(
              'absolute rounded-2xl',
              done && z.id === 'soft' && 'border-[3px] border-success-dark bg-success/20',
              miss === z.id && 'border-[3px] border-dashed border-primary-dark bg-primary/15',
            )}
            style={{
              left: `${z.box[0]}%`,
              top: `${z.box[1]}%`,
              width: `${z.box[2]}%`,
              height: `${z.box[3]}%`,
            }}
          />
        ))}
      </div>
      <motion.p
        key={done ? 'ok' : (miss ?? 'idle')}
        role="status"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'text-center font-semibold',
          done ? 'text-success-dark' : miss ? 'text-primary-dark' : 'text-muted',
        )}
      >
        {done
          ? 'Chính xác! Ngón cái và ngón trỏ bóp giữ phần mềm hai bên cánh mũi.'
          : miss
            ? `${ZONES.find((z) => z.id === miss)?.tip} Thử lại nhé!`
            : 'Gợi ý: phần mũi mềm, có thể bóp lại được.'}
      </motion.p>
      {done && (
        <Button size="lg" block variant="green" className="mt-auto" onClick={onDone}>
          Tiếp tục ▸
        </Button>
      )}
    </div>
  );
}
