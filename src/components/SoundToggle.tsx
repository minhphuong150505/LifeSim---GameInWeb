import { SpeakerIcon } from '../art/icons';
import { cn } from '../lib/cn';
import { useSettingsStore } from '../store/settings';

export function SoundToggle({ className }: { className?: string }) {
  const muted = useSettingsStore((s) => s.muted);
  const toggle = useSettingsStore((s) => s.toggleMuted);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
      className={cn(
        'ink-border grid h-11 w-11 place-items-center rounded-xl bg-paper shadow-pop',
        className,
      )}
    >
      <SpeakerIcon muted={muted} size={28} />
    </button>
  );
}
