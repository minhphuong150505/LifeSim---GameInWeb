import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { SoundToggle } from '../../components/SoundToggle';
import { DISCLAIMER } from '../../data/copy';
import { resetAllData } from '../../store/resetAll';
import { useSessionStore } from '../../store/session';
import { useSettingsStore } from '../../store/settings';

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const muted = useSettingsStore((s) => s.muted);
  const logout = useSessionStore((s) => s.logout);
  const [confirming, setConfirming] = useState(false);

  const close = () => {
    setConfirming(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={close} title="Cài đặt" tone="wood">
      {confirming ? (
        <div>
          <p className="text-[15px] text-ink">
            Điểm, sao, băng gạc, vật dụng, streak, nhiệm vụ và hồ sơ của bạn sẽ bị xoá khỏi thiết bị
            này. Không thể khôi phục.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Huỷ
            </Button>
            <Button
              onClick={() => {
                resetAllData();
                navigate('/login', { replace: true });
              }}
            >
              Xoá dữ liệu
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="ink-border flex items-center justify-between rounded-2xl bg-cream px-3 py-2">
            <span className="font-display text-lg text-navy">
              Âm thanh: {muted ? 'Tắt' : 'Bật'}
            </span>
            <SoundToggle />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => navigate('/tutorial')}>
              📖 Xem lại hướng dẫn
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              🚪 Đăng xuất
            </Button>
          </div>
          <Button
            variant="ghost"
            block
            className="text-primary-dark underline"
            onClick={() => setConfirming(true)}
          >
            🗑 Xoá toàn bộ dữ liệu
          </Button>
          <p className="text-center text-xs leading-relaxed text-muted">{DISCLAIMER}</p>
        </div>
      )}
    </Modal>
  );
}
