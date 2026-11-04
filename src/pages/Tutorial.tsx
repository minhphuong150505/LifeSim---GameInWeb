import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastFace } from '../art/CastFace';
import {
  BagIcon,
  BandageIcon,
  BoltIcon,
  CheckIcon,
  FlameIcon,
  GiftIcon,
  HeartIcon,
  PinIcon,
  ShopIcon,
  TrophyIcon,
} from '../art/icons';
import { LivingRoom } from '../art/LivingRoom';
import { Mascot } from '../art/Mascot';
import { Person } from '../art/Person';
import { STATION_H, STATION_W, StationRoom } from '../art/StationRoom';
import { DEFAULT_VARIANT, getVariant } from '../data/station';
import { Button } from '../components/Button';
import { cn } from '../lib/cn';
import { useUserStore } from '../store/user';

type Slide = {
  title: string;
  body: React.ReactNode;
  art: React.ReactNode;
};

const tile = 'ink-border flex items-center gap-2 rounded-2xl bg-paper px-3 py-2 shadow-soft';

function LobbyArt() {
  const btn = 'wood ink-border rounded-xl px-3 py-1.5 font-display text-lg text-navy shadow-pop';
  const side = 'ink-border grid h-9 w-9 place-items-center rounded-xl bg-paper text-xs shadow-soft';
  return (
    <div className="ink-border relative h-full w-full overflow-hidden rounded-[20px] bg-[#f3eed3] p-2">
      <div className="flex items-center gap-1">
        <span className="ink-border h-8 w-8 rounded-full bg-accent" />
        <span className="font-display text-sm text-navy">Tên · Lv</span>
        <FlameIcon size={20} />
        <span className="ml-auto flex items-center font-display text-sm text-navy">
          <BandageIcon size={20} />
          50
        </span>
      </div>
      <div className="mt-2 flex h-[calc(100%-44px)] items-center gap-2">
        <div className="w-1/4">
          <Mascot className="mx-auto h-24 w-20" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <span className={btn}>Core game</span>
          <span className={btn}>Streak</span>
          <span className={btn}>Trạm cứu hộ</span>
          <span className={btn}>Hub</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={side}>?</span>
          <span className={side}>📋</span>
          <span className={cn(side, 'bg-success/60')}>🎓</span>
          <span className={side}>🏆</span>
          <span className={side}>📖</span>
        </div>
      </div>
    </div>
  );
}

function StoryArt() {
  return (
    <div className="ink-border relative h-full w-full overflow-hidden rounded-[20px]">
      <svg
        viewBox="40 60 320 200"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden
      >
        <LivingRoom />
        <Person kind="brother" pose="sit" x={200} y={170} blood eyes="worried" mouth="o" />
        <Person kind="player" x={110} y={290} armR="point" eyes="worried" mouth="open" />
      </svg>
      <div className="ink-border absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-2xl bg-paper/95 p-2">
        <CastFace kind="brother" size={36} />
        <p className="text-sm font-semibold text-navy">
          <span className="font-display text-primary-dark">Em trai: </span>Chị ơi, mũi em chảy máu!
        </p>
      </div>
    </div>
  );
}

function AnswerArt() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2">
      {[
        ['A', 'Ngồi thẳng, hơi cúi đầu về trước', true],
        ['B', 'Ngửa đầu ra phía sau', false],
        ['C', 'Nằm ngửa trên giường', false],
      ].map(([letter, text, ok]) => (
        <div key={letter as string} className={cn(tile, !ok && 'opacity-60')}>
          <span className="ink-border grid h-7 w-7 place-items-center rounded-full bg-accent font-display text-navy">
            {letter}
          </span>
          <span className="flex-1 text-sm font-semibold text-navy">{text}</span>
          {ok ? <HeartIcon size={24} /> : <BoltIcon size={24} />}
        </div>
      ))}
    </div>
  );
}

function RulesArt() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-2">
      <div className={cn(tile, 'flex-col justify-center text-center')}>
        <span className="flex">
          <HeartIcon size={34} />
          <HeartIcon size={34} />
          <HeartIcon size={34} filled={false} />
        </span>
        <span className="font-display text-lg text-success-dark">Đúng: +1 tim</span>
      </div>
      <div className={cn(tile, 'flex-col justify-center text-center')}>
        <span className="flex">
          <BoltIcon size={34} />
          <BoltIcon size={34} filled={false} />
          <BoltIcon size={34} filled={false} />
        </span>
        <span className="font-display text-lg text-primary-dark">Sai: +1 tia sét</span>
      </div>
      <div className={cn(tile, 'col-span-2 justify-center')}>
        <BoltIcon size={26} />
        <BoltIcon size={26} />
        <BoltIcon size={26} />
        <span className="font-display text-base text-navy">= thua · chơi lại 10</span>
        <BandageIcon size={26} />
      </div>
    </div>
  );
}

function ItemsArt() {
  return (
    <div className="grid h-full w-full grid-cols-3 items-center gap-2 text-center">
      {[
        [<BandageIcon key="b" size={52} />, 'Băng gạc: tiền trong game'],
        [<ShopIcon key="s" size={52} />, 'Cửa hàng: mua vật dụng'],
        [<BagIcon key="g" size={52} />, 'Túi đồ: dùng trong màn chơi'],
      ].map(([icon, label]) => (
        <div key={label as string} className={cn(tile, 'h-full flex-col justify-center')}>
          {icon}
          <span className="text-sm font-semibold text-navy">{label}</span>
        </div>
      ))}
    </div>
  );
}

function StationArt() {
  const placed = {
    theme: getVariant(DEFAULT_VARIANT),
    cabinet: getVariant('cabinet-kinh'),
    bed: getVariant('bed-xanh'),
    poster: getVariant('poster-115'),
    plant: getVariant('plant-hoa'),
    rug: getVariant('rug-do'),
    chair: getVariant('chair-banh'),
    lamp: getVariant('lamp-vom'),
  };
  return (
    <div className="ink-border h-full w-full overflow-hidden rounded-[20px]">
      <svg
        viewBox={`0 0 ${STATION_W} ${STATION_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden
      >
        <StationRoom placed={placed} />
      </svg>
    </div>
  );
}

function DailyArt() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-2">
      <div className={cn(tile, 'flex-col justify-center text-center')}>
        <FlameIcon size={54} />
        <span className="font-display text-lg text-navy">Streak mỗi ngày</span>
        <span className="text-xs text-muted">3 câu nhanh · quà theo mốc</span>
      </div>
      <div className={cn(tile, 'flex-col justify-center text-center')}>
        <GiftIcon size={54} />
        <span className="font-display text-lg text-navy">Nhiệm vụ</span>
        <span className="text-xs text-muted">Làm xong nhận băng gạc</span>
      </div>
      <div className={cn(tile, 'flex-col justify-center text-center')}>
        <TrophyIcon size={48} />
        <span className="font-display text-base text-navy">Bảng xếp hạng</span>
      </div>
      <div className={cn(tile, 'flex-col justify-center text-center')}>
        <PinIcon size={48} />
        <span className="font-display text-base text-navy">Hub: khoá học thật</span>
      </div>
    </div>
  );
}

const SLIDES: Slide[] = [
  {
    title: 'Chào mừng đến với LifeSim!',
    body: (
      <>
        Bạn vào vai người sơ cứu, xử lý các tình huống hay gặp trong đời sống. Mỗi màn chỉ vài phút:{' '}
        <b>học – luyện – sẵn sàng</b>.
      </>
    ),
    art: <Mascot mood="happy" className="mx-auto h-full max-h-56 w-44" />,
  },
  {
    title: 'Màn hình chính',
    body: (
      <>
        Giữa màn hình: <b>Core game</b>, <b>Streak</b>, <b>Trạm cứu hộ</b> và <b>Hub</b>. Cột phải:
        Hướng dẫn, Nhiệm vụ, <b>Khoá học</b>, Bảng xếp hạng, Cẩm nang.
      </>
    ),
    art: <LobbyArt />,
  },
  {
    title: 'Vào tình huống',
    body: (
      <>
        Chọn chủ đề rồi chọn màn. Bấm <b>Hướng dẫn</b> trong bảng màn để xem luật. Chạm vào{' '}
        <b>bất kỳ đâu</b> để đọc tiếp lời thoại.
      </>
    ),
    art: <StoryArt />,
  },
  {
    title: 'Chọn cách xử lý',
    body: (
      <>
        Mỗi câu có 3 đáp án A, B, C. Chọn đúng: nhận <b>1 trái tim</b> và lời giải thích. Chọn sai:{' '}
        <b>tia sét đánh xuống</b>, nghe gợi ý rồi chọn lại.
      </>
    ),
    art: <AnswerArt />,
  },
  {
    title: 'Trái tim & tia sét',
    body: (
      <>
        Đủ <b>3 tia sét là thua</b> – chơi lại bằng 10 băng gạc hoặc xem quảng cáo. Càng ít tia sét
        càng nhiều sao.
      </>
    ),
    art: <RulesArt />,
  },
  {
    title: 'Vật dụng',
    body: (
      <>
        Mua vật dụng ở <b>Cửa hàng</b>, lấy ra từ <b>Túi đồ</b> rồi <b>kéo thả</b> lên người bị nạn
        (hoặc chạm vào vòng tròn nhấp nháy).
      </>
    ),
    art: <ItemsArt />,
  },
  {
    title: 'Trạm cứu hộ của bạn',
    body: (
      <>
        Thắng màn, giữ streak, làm nhiệm vụ để nhận <b>băng gạc</b>. Dùng băng gạc mua tủ thuốc,
        giường, poster… – mỗi món có <b>nhiều mẫu</b>. Thiếu thì mua thêm <b>gói băng gạc</b>.
      </>
    ),
    art: <StationArt />,
  },
  {
    title: 'Mỗi ngày một chút',
    body: (
      <>
        Giữ <b>Streak</b> mỗi ngày, leo <b>Bảng xếp hạng</b> và xem <b>Khoá học</b> sơ cứu thật từ
        đối tác. Sẵn sàng chưa?
      </>
    ),
    art: <DailyArt />,
  },
];

/** "How to play" guide shown before entering the game for the first time (and from the lobby). */
export function Tutorial() {
  const navigate = useNavigate();
  const finishTutorial = useUserStore((s) => s.finishTutorial);
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index] as Slide;
  const last = index === SLIDES.length - 1;

  const finish = () => {
    finishTutorial();
    navigate('/', { replace: true });
  };

  return (
    <main className="paper flex h-app flex-col px-[max(16px,env(safe-area-inset-left))] py-[max(10px,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between gap-2">
        <p className="ink-border wood rounded-xl px-3 py-1 font-display text-lg text-navy">
          📖 Hướng dẫn chơi · {index + 1}/{SLIDES.length}
        </p>
        <Button variant="secondary" onClick={finish}>
          Bỏ qua
        </Button>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          aria-live="polite"
          className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-5 overflow-hidden py-3 short:gap-3 short:py-1.5"
        >
          <div className="flex h-full max-h-72 min-h-0 items-center justify-center short:[&_svg]:max-h-full">
            {slide.art}
          </div>
          <div>
            <h1 className="font-display text-[clamp(24px,4vw,40px)] leading-tight short:text-[20px] text-navy">
              {slide.title}
            </h1>
            <p className="mt-2 text-[clamp(15px,1.9vw,19px)] leading-relaxed short:text-[13px] short:leading-snug text-ink">
              {slide.body}
            </p>
          </div>
        </motion.section>
      </AnimatePresence>

      <footer className="flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          ◂ Trước
        </Button>
        <ol className="flex gap-1.5" aria-label="Tiến độ hướng dẫn">
          {SLIDES.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                aria-label={`Trang ${i + 1}: ${s.title}`}
                aria-current={i === index ? 'step' : undefined}
                onClick={() => setIndex(i)}
                className={cn(
                  'ink-border block h-3.5 rounded-full transition-all',
                  i === index ? 'w-8 bg-primary' : 'w-3.5 bg-paper',
                )}
              />
            </li>
          ))}
        </ol>
        {last ? (
          <Button variant="green" onClick={finish}>
            <CheckIcon size={22} /> Vào game
          </Button>
        ) : (
          <Button onClick={() => setIndex((i) => i + 1)}>Tiếp ▸</Button>
        )}
      </footer>
    </main>
  );
}
