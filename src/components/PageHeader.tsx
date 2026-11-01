import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../art/icons';
import { CurrencyPill } from './CurrencyPill';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  /** Where the back button goes (defaults to the main screen). */
  backTo?: string;
};

/** Wooden board header shared by every secondary screen, with a back button to the lobby. */
export function PageHeader({ title, subtitle, right, backTo = '/' }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="wood sticky top-0 z-30 mb-3 border-b-[2.5px] border-navy px-3 pb-2 pt-[max(8px,env(safe-area-inset-top))] short:mb-2 short:pb-1 short:pt-1 shadow-soft">
      <div className="mx-auto flex max-w-6xl items-center gap-3 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <button
          type="button"
          onClick={() => navigate(backTo)}
          aria-label="Quay lại"
          className="ink-border grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper shadow-pop short:h-9 short:w-9"
        >
          <BackIcon size={26} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-[26px] leading-tight text-navy short:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-sm font-semibold text-navy/80 short:text-xs tiny:hidden">
              {subtitle}
            </p>
          )}
        </div>
        {right}
        <CurrencyPill />
      </div>
    </header>
  );
}
