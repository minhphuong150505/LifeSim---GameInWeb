import { NavLink } from 'react-router-dom';
import { cn } from '../lib/cn';

type Tab = { to: string; label: string; icon: React.ReactNode };

const icon = (path: React.ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {path}
  </svg>
);

const TABS: Tab[] = [
  {
    to: '/',
    label: 'Trang chủ',
    icon: icon(<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />),
  },
  {
    to: '/scenarios',
    label: 'Tình huống',
    icon: icon(
      <>
        <rect x="3" y="6" width="18" height="14" rx="3" />
        <path d="M9 6V4h6v2M12 10v6M9 13h6" />
      </>,
    ),
  },
  {
    to: '/leaderboard',
    label: 'Xếp hạng',
    icon: icon(
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />,
    ),
  },
  {
    to: '/hub',
    label: 'Hub',
    icon: icon(
      <>
        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>,
    ),
  },
  {
    to: '/profile',
    label: 'Hồ sơ',
    icon: icon(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>,
    ),
  },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed bottom-0 left-1/2 z-[1000] w-full max-w-[480px] -translate-x-1/2 rounded-t-3xl border-t border-navy/10 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_-8px_rgb(31_58_95/0.25)]"
    >
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold',
                  isActive ? 'text-primary-dark' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'grid h-8 w-12 place-items-center rounded-full transition-colors',
                      isActive && 'bg-primary/12',
                    )}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
