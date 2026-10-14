import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Logo } from '../components/Logo';
import { Sticker } from '../components/Sticker';
import { assets, AVATAR_IDS, type AvatarId } from '../data/assets';
import { DISCLAIMER, SLOGAN } from '../data/copy';
import { Mascot3D } from '../features/mascot/Mascot3D';
import { cn } from '../lib/cn';
import { playSound } from '../lib/sound';
import { useUserStore } from '../store/user';

const MIN_NAME = 2;
const MAX_NAME = 16;

export function Onboarding() {
  const navigate = useNavigate();
  const onboarded = useUserStore((s) => s.onboarded);
  const setProfile = useUserStore((s) => s.setProfile);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<AvatarId>('avatar-1');

  if (onboarded) return <Navigate to="/" replace />;

  const valid = nickname.trim().length >= MIN_NAME;

  return (
    <main className="safe-top safe-bottom relative min-h-dvh overflow-hidden px-5">
      <img
        src={assets.proposal.cityBg}
        alt=""
        aria-hidden
        className="absolute inset-x-0 top-0 h-56 w-full object-cover opacity-70"
        style={{ maskImage: 'linear-gradient(#000 55%, transparent)' }}
      />
      <div className="relative">
        <div className="flex items-center justify-between pt-2">
          <Logo height={46} />
          <p className="max-w-[9rem] text-right font-display text-sm font-bold uppercase leading-tight text-navy">
            {SLOGAN}
          </p>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div className="pb-4">
            <h1 className="text-[30px] font-bold text-navy">
              Sẵn sàng <span className="text-primary-dark">cứu người</span> chưa?
            </h1>
            <p className="mt-1 text-sm text-ink">
              Luyện sơ cứu qua tình huống mô phỏng, mỗi ngày vài phút.
            </p>
          </div>
          <Mascot3D className="-mr-3 h-44 w-40 shrink-0" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return;
            setProfile(nickname, avatar);
            navigate('/', { replace: true });
          }}
        >
          <Card tape className="mt-1">
            <label htmlFor="nickname" className="font-display text-lg font-bold text-navy">
              Tên của bạn
            </label>
            <input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={MAX_NAME}
              autoComplete="nickname"
              placeholder="Ví dụ: Minh Anh"
              className="mt-1 h-12 w-full rounded-2xl border-2 border-navy/20 bg-cream px-4 text-base font-semibold text-navy placeholder:font-normal placeholder:text-muted"
            />

            <fieldset className="mt-4">
              <legend className="font-display text-lg font-bold text-navy">Chọn avatar</legend>
              <div className="mt-2 grid grid-cols-6 gap-1">
                {AVATAR_IDS.map((id, i) => (
                  <label key={id} className="flex cursor-pointer flex-col items-center">
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
                        'rounded-full p-1 transition-transform peer-focus-visible:outline-3 peer-focus-visible:outline-navy',
                        avatar === id ? 'scale-105 bg-primary' : 'bg-transparent',
                      )}
                    >
                      <Avatar id={id} size={44} />
                    </span>
                    <span className="sr-only">Nhân vật {i + 1}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </Card>

          <Card className="mt-3 flex gap-3 bg-white/80">
            <Sticker name="kit" className="h-12 w-12 shrink-0" />
            <p className="text-[13px] leading-snug text-ink">{DISCLAIMER}</p>
          </Card>

          <Button type="submit" size="lg" block className="mt-4" disabled={!valid}>
            Bắt đầu luyện tập
          </Button>
          <p className="mt-2 pb-2 text-center text-xs text-muted">
            Dữ liệu chỉ lưu trên thiết bị của bạn.
          </p>
        </form>
      </div>
    </main>
  );
}
