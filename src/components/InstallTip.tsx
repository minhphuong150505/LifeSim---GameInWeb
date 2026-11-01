import { useState } from 'react';
import { cn } from '../lib/cn';
import { needsInstallForFullscreen } from '../lib/landscape';
import { useSettingsStore } from '../store/settings';

/** Share icon as drawn in Safari's toolbar. */
function ShareGlyph() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} className="inline align-[-2px]" aria-hidden>
      <path
        d="M10 2 V12 M6 6 L10 2 L14 6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9 H4 V18 H16 V9 H14"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Steps to play full screen on iPhone (Safari does not allow web pages to go full screen). */
export function InstallSteps({ className }: { className?: string }) {
  return (
    <ol className={cn('list-inside list-decimal space-y-0.5 text-sm text-navy', className)}>
      <li>
        Bấm nút <b>Chia sẻ</b> <ShareGlyph /> trên thanh Safari.
      </li>
      <li>
        Chọn <b>“Thêm vào MH chính”</b> (Add to Home Screen).
      </li>
      <li>Mở LifeSim từ biểu tượng ngoài màn hình chính – game chạy toàn màn hình.</li>
    </ol>
  );
}

/** Dismissible banner shown on iPhone Safari (not installed) explaining how to get full screen. */
export function InstallTip({ className }: { className?: string }) {
  const dismissed = useSettingsStore((s) => s.installTipDismissed);
  const dismiss = useSettingsStore((s) => s.dismissInstallTip);
  const [show] = useState(needsInstallForFullscreen);
  if (!show || dismissed) return null;
  return (
    <div
      className={cn('ink-border relative rounded-2xl bg-[#fff1c2] p-2 pr-9 shadow-pop', className)}
    >
      <p className="font-display text-[15px] text-primary-dark">
        📱 Chơi toàn màn hình trên iPhone
      </p>
      <InstallSteps className="text-xs" />
      <button
        type="button"
        onClick={dismiss}
        aria-label="Ẩn hướng dẫn"
        className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-lg text-lg text-navy"
      >
        ×
      </button>
    </div>
  );
}
