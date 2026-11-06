import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastFace } from '../art/CastFace';
import { CheckIcon, FlameIcon, GiftIcon, PinIcon } from '../art/icons';
import { LivingRoom } from '../art/LivingRoom';
import { Mascot } from '../art/Mascot';
import { Person } from '../art/Person';
import { STATION_H, STATION_W, StationRoom } from '../art/StationRoom';
import { DEFAULT_SPOT, DEFAULT_VARIANT, getVariant, type ItemSlot } from '../data/station';
import { Button } from '../components/Button';
import { getCourse, type Course } from '../data/courses';
import { CourseCover } from '../features/courses/CourseBanner';
import { cn } from '../lib/cn';
import { useUserStore } from '../store/user';


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

function StationArt() {
  const layout = Object.fromEntries(
    ['cabinet-kinh', 'bed-xanh', 'poster-115', 'plant-hoa', 'rug-do', 'chair-banh', 'lamp-vom'].map(
      (id) => [id, DEFAULT_SPOT[getVariant(id)?.slot as ItemSlot]],
    ),
  );

  return (
    <div className="ink-border h-full w-full overflow-hidden rounded-[20px]">
      <svg
        viewBox={`0 0 ${STATION_W} ${STATION_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden
      >
        <StationRoom theme={DEFAULT_VARIANT} layout={layout} />
      </svg>
    </div>
  );
}

function DailyArt() {
  return (
    <div className="ink-border relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[20px] bg-[#fff1c2] p-3">
      <span className="flex items-center gap-2">
        <FlameIcon size={52} lit />
        <span className="font-display text-[26px] leading-none text-navy">Streak 3 ngày</span>
      </span>
      <div className="ink-border w-full max-w-[260px] rounded-2xl bg-paper px-3 py-2 shadow-soft">
        <p className="text-[13px] font-semibold text-navy">Câu hỏi nhanh hôm nay</p>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink">
          <CheckIcon size={20} /> Chảy máu cam: ngồi thẳng, cúi đầu
        </p>
        <p className="flex items-center gap-1.5 text-[13px] text-ink">
          <GiftIcon size={20} /> Quà theo mốc chuỗi ngày
        </p>
      </div>
    </div>
  );
}

/** Mini "Khám phá khóa học" screen: green header and a grid of course cards. */
function HubArt() {
  return (
    <div className="ink-border flex h-full w-full flex-col overflow-hidden rounded-[20px] bg-cream">
      <div className="flex shrink-0 items-center gap-2 border-b-[2.5px] border-navy bg-success px-3 py-1.5">
        <span className="ink-border grid h-9 w-9 place-items-center rounded-xl bg-paper">
          <PinIcon size={26} />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[20px] leading-none text-navy">Khám phá khóa học</span>
          <span className="block truncate text-[11px] font-semibold text-navy/80">
            Tìm khoá học sơ cứu thực tế gần bạn
          </span>
        </span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5 p-1.5">
        {HUB_PREVIEW.map((c) => (
          <div
            key={c.id}
            className="ink-border flex min-h-0 flex-col overflow-hidden rounded-xl bg-paper"
          >
            <div className="relative min-h-0 flex-1" style={{ backgroundColor: c.tone }}>
              <div className="absolute inset-0">
                <CourseCover course={c} />
              </div>
            </div>
            <p className="truncate border-t-2 border-navy px-1 text-[10px] font-semibold text-navy">
              {c.title}
            </p>
            <p className="px-1 pb-0.5 text-[10px] font-bold text-primary-dark">{c.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const HUB_PREVIEW = ['cpr-aed', 'hctd-tphcm', 'wb-bls', 'so-cuu-co-ban', 'cc115', 'wb-du-lich']
  .map((id) => getCourse(id))
  .filter((c): c is Course => Boolean(c));

/** The mascot's welcome, one line per tap. */
const WELCOME_LINES: React.ReactNode[] = [
  <span key="1" className="font-display text-[clamp(30px,4.6vw,46px)] leading-tight text-primary-dark">
    Chào mừng đến với LifeSim!
  </span>,
  'Khám phá kiến thức về sơ cấp cứu thông qua những tình huống mô phỏng thực tế, nơi bạn sẽ học cách đưa ra quyết định, xử lý tình huống khẩn cấp và rèn luyện kỹ năng qua những thử thách tương tác thú vị!',
  <span key="3" className="font-display text-[clamp(26px,3.6vw,38px)] leading-tight text-navy">
    Hãy cùng mình khám phá LifeSim nhé!
  </span>,
];

type Screen = { title: string; body: string; art: React.ReactNode };

function Feature({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="flex h-full min-h-0 flex-col items-center gap-1.5">
      <div className="min-h-0 w-full flex-1">{children}</div>
      <figcaption className="ink-border shrink-0 rounded-full bg-paper px-3 font-display text-[18px] text-navy short:text-[15px]">
        {label}
      </figcaption>
    </figure>
  );
}

const SCREENS: Screen[] = [
  {
    title: 'TRAU DỒI KIẾN THỨC – TÍCH LŨY KINH NGHIỆM!',
    body: 'Khám phá các tình huống sơ cấp cứu thường gặp, rèn luyện kỹ năng để sẵn sàng ứng phó trong đời sống thực tế và tích lũy băng gạc qua mỗi thử thách!',
    art: (
      <div className="grid h-full w-full grid-cols-2 gap-4">
        <Feature label="Xử lý các tình huống sơ cấp cứu">
          <StoryArt />
        </Feature>
        <Feature label="Ôn lại kiến thức mỗi ngày">
          <DailyArt />
        </Feature>
      </div>
    ),
  },
  {
    title: 'XÂY DỰNG TRẠM CỨU HỘ CỦA RIÊNG BẠN!',
    body: 'Hoàn thành các nhiệm vụ mỗi ngày để tích lũy băng gạc, mở khóa vật phẩm và trang trí trạm cứu hộ theo phong cách riêng của bạn.',
    art: <StationArt />,
  },
  {
    title: 'NÂNG CAO KỸ NĂNG VỚI CÁC KHÓA HỌC THỰC TẾ!',
    body: 'Tìm hiểu và đăng ký các khóa học sơ cấp cứu từ những đơn vị đào tạo uy tín ngay trên LifeSim, giúp bạn rèn luyện kỹ năng thực hành và tự tin hơn khi đối mặt với các tình huống khẩn cấp ngoài đời thực!',
    art: <HubArt />,
  },
];

/**
 * "How to play": the mascot says hello (three lines, tap anywhere to go on), then three
 * screens about playing, the Rescue Station and real courses.
 * Shown before entering the game for the first time; replayable from Settings.
 */
export function Tutorial() {
  const navigate = useNavigate();
  const finishTutorial = useUserStore((s) => s.finishTutorial);
  const [line, setLine] = useState(0);
  const [index, setIndex] = useState(-1);
  const intro = index < 0;
  const screen = SCREENS[Math.max(0, index)] as Screen;
  const last = index === SCREENS.length - 1;

  const finish = () => {
    finishTutorial();
    navigate('/', { replace: true });
  };
  const nextLine = () => {
    if (line < WELCOME_LINES.length - 1) setLine((l) => l + 1);
    else setIndex(0);
  };

  return (
    <main className="paper relative flex h-app flex-col px-[max(16px,env(safe-area-inset-left))] py-[max(10px,env(safe-area-inset-top))]">
      <header className="relative z-10 flex shrink-0 justify-end">
        <Button variant="secondary" onClick={finish}>
          Bỏ qua
        </Button>
      </header>

      <AnimatePresence mode="wait">
        {intro ? (
          <motion.button
            key="intro"
            type="button"
            onClick={nextLine}
            aria-label="Chạm để tiếp tục"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)] items-center gap-6 text-left"
          >
            <Mascot mood="happy" className="mx-auto h-[min(76%,340px)] w-auto aspect-[11/16]" />
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={line}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  aria-live="polite"
                  className="ink-border relative rounded-[28px] bg-paper px-6 py-5 text-[clamp(17px,2.2vw,22px)] font-semibold leading-relaxed text-navy shadow-pop short:px-4 short:py-3"
                >
                  {WELCOME_LINES[line]}
                  {/* speech-bubble tail pointing at the mascot */}
                  <span
                    aria-hidden
                    className="absolute -left-[13px] top-1/2 h-6 w-6 -translate-y-1/2 rotate-45 border-b-[2.5px] border-l-[2.5px] border-navy bg-paper"
                  />
                </motion.div>
              </AnimatePresence>
              <p className="mt-3 text-right font-display text-lg text-muted">
                Chạm để tiếp tục ▸
              </p>
            </div>
          </motion.button>
        ) : (
          <motion.section
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            aria-live="polite"
            className={cn(
              'grid min-h-0 flex-1 gap-4 overflow-hidden py-2 short:gap-2',
              index === 0
                ? 'grid-rows-[auto_minmax(0,1fr)]'
                : 'grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-center',
            )}
          >
            {index === 0 ? (
              <>
                <div className="mx-auto max-w-4xl text-center">
                  <h1 className="text-[clamp(22px,3.4vw,34px)] leading-tight text-primary-dark short:text-[20px]">
                    {screen.title}
                  </h1>
                  <p className="mt-1 text-[clamp(14px,1.8vw,18px)] leading-snug text-ink short:text-[13px]">
                    {screen.body}
                  </p>
                </div>
                <div className="mx-auto h-full min-h-0 w-full max-w-4xl">{screen.art}</div>
              </>
            ) : (
              <>
                <div className="h-full max-h-80 min-h-0">{screen.art}</div>
                <div>
                  <h1 className="text-[clamp(22px,3.4vw,36px)] leading-tight text-primary-dark short:text-[20px]">
                    {screen.title}
                  </h1>
                  <p className="mt-2 text-[clamp(15px,1.9vw,19px)] leading-relaxed text-ink short:text-[13px] short:leading-snug">
                    {screen.body}
                  </p>
                </div>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {!intro && (
        <footer className="flex shrink-0 items-center justify-between gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              if (index === 0) setLine(WELCOME_LINES.length - 1);
              setIndex((i) => i - 1);
            }}
          >
            ◂ Trước
          </Button>
          {last ? (
            <Button variant="green" onClick={finish}>
              <CheckIcon size={22} /> Vào game
            </Button>
          ) : (
            <Button onClick={() => setIndex((i) => i + 1)}>Tiếp ▸</Button>
          )}
        </footer>
      )}
    </main>
  );
}
