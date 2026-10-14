import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <>
      <main className="pb-[calc(84px+env(safe-area-inset-bottom))]">
        <Suspense
          fallback={
            <div role="status" className="grid min-h-[60dvh] place-items-center text-muted">
              Đang tải…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </>
  );
}
