import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Onboarding } from '../pages/Onboarding';
import { Scenarios } from '../pages/Scenarios';
import { useUserStore } from '../store/user';
import { AppLayout } from './AppLayout';

// Secondary screens are code-split to keep the first load light on mobile.
const Play = lazy(() => import('../pages/Play').then((m) => ({ default: m.Play })));
const Daily = lazy(() => import('../pages/Daily').then((m) => ({ default: m.Daily })));
const Team = lazy(() => import('../pages/Team').then((m) => ({ default: m.Team })));
const Leaderboard = lazy(() =>
  import('../pages/Leaderboard').then((m) => ({ default: m.Leaderboard })),
);
const Hub = lazy(() => import('../pages/Hub').then((m) => ({ default: m.Hub })));
const Profile = lazy(() => import('../pages/Profile').then((m) => ({ default: m.Profile })));
const ArtGallery = import.meta.env.DEV
  ? lazy(() => import('../dev/ArtGallery').then((m) => ({ default: m.ArtGallery })))
  : null;

function RequireOnboarding() {
  const onboarded = useUserStore((s) => s.onboarded);
  return onboarded ? <Outlet /> : <Navigate to="/onboarding" replace />;
}

function Loading() {
  return (
    <div role="status" className="grid min-h-[60dvh] place-items-center text-muted">
      Đang tải…
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      {/* Phone-sized frame: full width on mobile, centered column on desktop. */}
      <div className="relative mx-auto min-h-dvh w-full max-w-[480px] bg-cream shadow-soft">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            {ArtGallery && <Route path="/dev/art" element={<ArtGallery />} />}
            <Route element={<RequireOnboarding />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/scenarios" element={<Scenarios />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/team" element={<Team />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/hub" element={<Hub />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="/play/:id" element={<Play />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
