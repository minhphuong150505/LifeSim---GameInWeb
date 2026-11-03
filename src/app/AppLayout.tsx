import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

/** Secondary screens: scrollable page under a wooden header (no bottom nav – the lobby is the hub). */
export function AppLayout() {
  return (
    <main className="min-h-app pb-[max(16px,env(safe-area-inset-bottom))]">
      <Suspense
        fallback={
          <div
            role="status"
            className="grid min-h-[calc(var(--app-h)*0.6)] place-items-center text-muted"
          >
            Đang tải…
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </main>
  );
}
