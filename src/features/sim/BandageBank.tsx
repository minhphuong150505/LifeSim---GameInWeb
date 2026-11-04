import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BandageIcon, FlameIcon, PlayIcon, ScrollIcon } from '../../art/icons';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { playSound } from '../../lib/sound';
import { ADS_PER_DAY, AD_BONUS, useWalletStore } from '../../store/wallet';
import { AdOverlay } from './AdOverlay';
import type { BandagePack } from '../../data/packs';
import { Checkout } from '../store/Checkout';
import { PackList } from '../store/PackList';

type BankProps = {
  open: boolean;
  onClose: () => void;
  /** Opens the daily missions list (lobby only). */
  onOpenMissions?: () => void;
  /** Inside a round: only offer what doesn't leave the round. */
  inGame?: boolean;
  /** Pack to highlight (covers what the player is missing). */
  suggestPack?: string;
};

/**
 * "Kiếm băng gạc" – the currency store behind the + next to the bandage counter.
 * Kept separate from the item shop: here the player earns/gets bandages (ads, missions,
 * streak, packs); the item shop is where bandages are spent.
 */
export function BandageBank({ open, onClose, onOpenMissions, inGame, suggestPack }: BankProps) {
  const navigate = useNavigate();
  const bandages = useWalletStore((s) => s.bandages);
  // Subscribing to these keeps "ads left" fresh after watching.
  useWalletStore((s) => s.adsToday);
  useWalletStore((s) => s.adDay);
  const adsLeft = useWalletStore.getState().adsLeft();
  const [adOpen, setAdOpen] = useState(false);
  const [gained, setGained] = useState<number | null>(null);
  const [buying, setBuying] = useState<BandagePack | null>(null);

  const ways = [
    {
      key: 'missions',
      icon: <ScrollIcon size={34} />,
      title: 'Nhiệm vụ hằng ngày',
      text: 'Hoàn thành 3 nhiệm vụ mỗi ngày để nhận băng gạc.',
      action: 'Xem',
      onClick: onOpenMissions,
    },
    {
      key: 'streak',
      icon: <FlameIcon size={34} lit />,
      title: 'Streak mỗi ngày',
      text: 'Trả lời đúng câu hỏi nhanh để giữ chuỗi và nhận quà.',
      action: 'Đi tới',
      onClick: () => navigate('/daily'),
    },
    {
      key: 'core',
      icon: <PlayIcon size={34} />,
      title: 'Thắng màn chơi',
      text: 'Hoàn thành màn (không sai quá 2 lần) để nhận thưởng.',
      action: 'Chơi',
      onClick: () => navigate('/core'),
    },
  ].filter((w) => !inGame && w.onClick);

  return (
    <>
      <Modal open={open} onClose={onClose} title="Băng gạc" tone="green" size="lg">
        <div className="flex flex-col gap-3">
          <div className="ink-border flex items-center gap-3 rounded-2xl bg-[#fff1c2] p-2.5 shadow-soft">
            <span className="ink-border grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent font-display text-2xl text-navy">
              ▶
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl leading-tight text-navy">Xem quảng cáo</p>
              <p className="text-sm text-muted">
                Nhận +{AD_BONUS} băng gạc mỗi lần · còn {adsLeft}/{ADS_PER_DAY} lượt hôm nay
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-xl bg-paper/80 px-2 font-display text-lg text-navy">
              Đang có <BandageIcon size={26} /> {bandages}
            </span>
            <Button
              variant="yellow"
              disabled={adsLeft <= 0}
              onClick={() => setAdOpen(true)}
              aria-label={`Xem quảng cáo nhận ${AD_BONUS} băng gạc`}
            >
              +{AD_BONUS} <BandageIcon size={24} />
            </Button>
          </div>
          {gained !== null && (
            <p role="status" className="-my-1 text-center font-display text-lg text-success-dark">
              Đã nhận +{gained} băng gạc!
            </p>
          )}

          {inGame ? (
            <p className="text-center text-sm text-muted">
              Ngoài màn chơi, bạn còn kiếm băng gạc từ nhiệm vụ hằng ngày, streak và thắng màn.
            </p>
          ) : (
            <ul
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${ways.length}, minmax(0, 1fr))` }}
            >
              {ways.map((w) => (
                <li
                  key={w.key}
                  className="ink-border flex flex-col items-center gap-1 rounded-2xl bg-paper p-2 text-center"
                >
                  <span className="flex items-center gap-1.5 [&>svg]:h-7 [&>svg]:w-7">
                    {w.icon}
                    <span className="font-display text-[17px] leading-tight text-navy">
                      {w.title}
                    </span>
                  </span>
                  <p className="flex-1 text-[12px] leading-tight text-muted">{w.text}</p>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => {
                      onClose();
                      w.onClick?.();
                    }}
                  >
                    {w.action}
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="ink-border rounded-2xl bg-cream p-2.5 pt-2">
            <p className="mb-2.5 font-display text-lg leading-tight text-navy">
              Gói băng gạc{' '}
              <span className="font-body text-[12px] font-normal text-muted">
                · mua bằng tiền thật để trang trí nhanh hơn
              </span>
            </p>
            <PackList onBuy={setBuying} suggested={suggestPack} />
          </div>
        </div>
      </Modal>
      <AdOverlay
        open={adOpen}
        reward={`+${AD_BONUS} băng gạc`}
        onCancel={() => setAdOpen(false)}
        onFinish={() => {
          const got = useWalletStore.getState().watchAd();
          if (got > 0) {
            playSound('win');
            setGained(got);
          }
          setAdOpen(false);
        }}
      />
      <Checkout pack={buying} onClose={() => setBuying(null)} />
    </>
  );
}
