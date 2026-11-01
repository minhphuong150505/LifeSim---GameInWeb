import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BandageIcon } from '../art/icons';
import { TOWN_H, TOWN_W, TownScene } from '../art/TownScene';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { AVATAR_IDS, type AvatarId } from '../data/assets';
import { DISCLAIMER, SLOGAN } from '../data/copy';
import { STARTING_BANDAGES } from '../features/sim/engine';
import { cn } from '../lib/cn';
import { enterLandscape } from '../lib/landscape';
import { playSound } from '../lib/sound';
import { useSessionStore } from '../store/session';
import { useUserStore } from '../store/user';

const MIN_NAME = 2;
const MAX_NAME = 16;
const LOAD_MS = 1600;

/** Step 1 – login screen: game backdrop + loading bar, then the login panel. */
export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore();
  const login = useSessionStore((s) => s.login);
  const [progress, setProgress] = useState(0);
  const [editing, setEditing] = useState(!user.onboarded);
  const [nickname, setNickname] = useState(user.nickname);
  const [avatar, setAvatar] = useState<AvatarId>(user.avatar);

  // Fake asset loading: fills the bar, then reveals the login panel.
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / LOAD_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const loaded = progress >= 1;
  const valid = nickname.trim().length >= MIN_NAME;
  const from = (location.state as { from?: string } | null)?.from;

  const enter = () => {
    void enterLandscape();
    login();
    const tutorialDone = useUserStore.getState().tutorialDone;
    navigate(tutorialDone ? (from && from !== '/login' ? from : '/') : '/tutorial', {
      replace: true,
    });
  };

  return (
    <main className="relative h-dvh min-h-[320px] overflow-hidden">
      <svg
        viewBox={`0 0 ${TOWN_W} ${TOWN_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <TownScene />
      </svg>

      <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-[max(12px,env(safe-area-inset-top))] px-[max(16px,env(safe-area-inset-left))]">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Logo height={64} />
          <p className="ink-border mt-1 w-fit rounded-full bg-paper/90 px-3 py-0.5 font-display text-sm uppercase text-navy">
            {SLOGAN}
          </p>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-[max(10px,env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          {!loaded ? (
            <motion.div
              key="loading"
              exit={{ opacity: 0, y: 10 }}
              className="mb-6 w-full max-w-md"
              role="progressbar"
              aria-label="Đang tải trò chơi"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <p className="mb-1 text-center font-display text-lg text-navy drop-shadow-[0_1px_0_#fffaf0]">
                Đang tải… {Math.round(progress * 100)}%
              </p>
              <div className="ink-border h-6 overflow-hidden rounded-full bg-paper">
                <div
                  className="h-full rounded-full bg-success"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundImage:
                      'repeating-linear-gradient(120deg, rgb(255 255 255 / 0.35) 0 8px, transparent 8px 16px)',
                  }}
                />
              </div>
            </motion.div>
          ) : editing ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="ink-border mb-1 w-full max-w-xl rounded-[22px] bg-paper/95 p-3 shadow-pop"
              onSubmit={(e) => {
                e.preventDefault();
                if (!valid) return;
                user.setProfile(nickname, avatar);
                enter();
              }}
            >
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <label htmlFor="nickname" className="font-display text-lg text-navy">
                    Tên người chơi
                  </label>
                  <input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={MAX_NAME}
                    autoComplete="nickname"
                    placeholder="Ví dụ: Minh Anh"
                    className="ink-border h-12 w-full rounded-2xl bg-cream px-4 text-base font-semibold text-navy placeholder:font-normal placeholder:text-muted"
                  />
                </div>
                <Button type="submit" size="lg" disabled={!valid} className="shrink-0">
                  Đăng nhập
                </Button>
              </div>
              <fieldset className="mt-2">
                <legend className="font-display text-base text-navy">Chọn nhân vật</legend>
                <div className="scroll-row flex gap-1 overflow-x-auto pb-1">
                  {AVATAR_IDS.map((id, i) => (
                    <label key={id} className="shrink-0 cursor-pointer">
                      <input
                        type="radio"
                        name="avatar"
                        value={id}
                        checked={avatar === id}
                        onChange={() => {
                          setAvatar(id);
                          playSound('select');
                        }}
                        className="peer sr-only"
                      />
                      <span
                        className={cn(
                          'block rounded-full p-0.5 peer-focus-visible:outline-3 peer-focus-visible:outline-navy',
                          avatar === id ? 'bg-primary' : 'bg-transparent',
                        )}
                      >
                        <Avatar id={id} size={40} />
                      </span>
                      <span className="sr-only">Nhân vật {i + 1}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {!user.onboarded && (
                <p className="mt-1 flex items-center gap-1 text-[13px] text-navy">
                  <BandageIcon size={22} />
                  <b>Quà chào mừng: {STARTING_BANDAGES} băng gạc!</b>
                  <span className="text-muted">· Dữ liệu chỉ lưu trên thiết bị này.</span>
                </p>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="ink-border mb-3 flex w-full max-w-md items-center gap-3 rounded-[22px] bg-paper/95 p-3 shadow-pop"
            >
              <Avatar id={user.avatar} size={56} ring="red" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted">Chào mừng trở lại,</p>
                <p className="truncate font-display text-2xl text-navy">{user.nickname}</p>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-sm font-semibold text-primary-dark underline"
                >
                  Đổi tên / nhân vật
                </button>
              </div>
              <Button size="lg" onClick={enter} className="shrink-0">
                Đăng nhập
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="absolute bottom-1 right-2 hidden max-w-[260px] text-right text-[10px] leading-tight text-navy/70 lg:block">
        {DISCLAIMER}
      </p>
    </main>
  );
}
