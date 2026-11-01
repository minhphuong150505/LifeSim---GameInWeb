import { useNavigate } from 'react-router-dom';
import { BandageIcon, CheckIcon, ScrollIcon } from '../../art/icons';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { playSound } from '../../lib/sound';
import { useMissionStore } from '../../store/missions';
import { useWalletStore } from '../../store/wallet';
import { MISSIONS, missionStatus, type MissionInput } from '../missions/missionLogic';

/** Daily missions: "Đi tới" forwards the player to where the mission is done. */
export function MissionsModal({
  open,
  onClose,
  input,
}: {
  open: boolean;
  onClose: () => void;
  input: MissionInput;
}) {
  const navigate = useNavigate();
  const claim = useMissionStore((s) => s.claim);
  const earn = useWalletStore((s) => s.earn);

  return (
    <Modal open={open} onClose={onClose} title="Nhiệm vụ hôm nay" tone="wood" size="lg">
      <ul className="space-y-2">
        {MISSIONS.map((m) => {
          const status = missionStatus(m.id, input);
          return (
            <li
              key={m.id}
              className="ink-border flex items-center gap-3 rounded-2xl bg-cream p-2.5"
            >
              {status === 'todo' ? <ScrollIcon size={40} /> : <CheckIcon size={40} />}
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-tight text-navy">{m.title}</p>
                <p className="text-sm text-muted">{m.description}</p>
              </div>
              <span className="flex shrink-0 items-center font-display text-lg text-navy">
                +{m.reward}
                <BandageIcon size={26} />
              </span>
              {status === 'todo' && (
                <Button
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => {
                    onClose();
                    navigate(m.to);
                  }}
                >
                  {m.goLabel} ▸
                </Button>
              )}
              {status === 'ready' && (
                <Button
                  variant="yellow"
                  className="shrink-0"
                  onClick={() => {
                    const reward = claim(m.id, input.today);
                    if (reward > 0) {
                      earn(reward);
                      playSound('found');
                    }
                  }}
                >
                  Nhận quà
                </Button>
              )}
              {status === 'claimed' && (
                <span className="shrink-0 px-2 font-display text-success-dark">Đã nhận ✓</span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-center text-xs text-muted">Nhiệm vụ làm mới mỗi ngày.</p>
    </Modal>
  );
}
