import { BagIcon, BandageIcon, BoltIcon, HeartIcon, ShopIcon, StarIcon } from '../../art/icons';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { MAX_BOLTS, RETRY_COST } from './engine';

const RULES: { icon: React.ReactNode; title: string; text: string }[] = [
  {
    icon: <span className="font-display text-2xl text-navy">💬</span>,
    title: 'Đọc câu chuyện',
    text: 'Chạm vào bất kỳ đâu trên màn hình để đọc tiếp lời thoại.',
  },
  {
    icon: <HeartIcon size={30} />,
    title: 'Chọn đúng',
    text: 'Nhận 1 trái tim và nghe giải thích vì sao đúng.',
  },
  {
    icon: <BoltIcon size={30} />,
    title: 'Chọn sai',
    text: `Bị 1 tia sét đánh và chọn lại. Đủ ${MAX_BOLTS} tia sét là thua màn.`,
  },
  {
    icon: <StarIcon size={30} />,
    title: 'Sao & phần thưởng',
    text: 'Càng ít tia sét càng nhiều sao. Thắng màn mới nhận băng gạc.',
  },
  {
    icon: <BandageIcon size={30} />,
    title: 'Thua màn',
    text: `Chơi lại bằng ${RETRY_COST} băng gạc hoặc xem quảng cáo.`,
  },
  {
    icon: (
      <span className="flex">
        <ShopIcon size={24} />
        <BagIcon size={24} />
      </span>
    ),
    title: 'Vật dụng',
    text: 'Mua ở Cửa hàng, lấy ra từ Túi đồ rồi kéo thả lên người bị nạn.',
  },
];

/** "How to play" card for one round: opened from the level pop-up and the in-game ? button. */
export function RoundGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Hướng dẫn" tone="wood" size="lg">
      <ul className="grid grid-cols-2 gap-2">
        {RULES.map((r) => (
          <li
            key={r.title}
            className="ink-border flex items-center gap-2.5 rounded-2xl bg-cream px-2.5 py-2"
          >
            <span className="grid h-10 w-12 shrink-0 place-items-center">{r.icon}</span>
            <span className="min-w-0">
              <span className="block font-display text-[17px] leading-tight text-navy">
                {r.title}
              </span>
              <span className="block text-[13px] leading-snug text-ink">{r.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <Button block className="mt-3" onClick={onClose}>
        Đã hiểu
      </Button>
    </Modal>
  );
}
