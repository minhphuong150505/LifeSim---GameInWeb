import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { FullscreenKeeper } from '../components/FullscreenKeeper';
import { RotateHint } from '../components/RotateHint';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { useSessionStore } from '../store/session';
import { useUserStore } from '../store/user';
import { AppLayout } from './AppLayout';

// Secondary screens are code-split to keep the first load light on mobile.
const Tutorial = lazy(() => import('../pages/Tutorial').then((m) => ({ default: m.Tutorial })));
const CoreTopics = lazy(() =>
  import('../pages/CoreTopics').then((m) => ({ default: m.CoreTopics })),
);
const Scenarios = lazy(() => import('../pages/Scenarios').then((m) => ({ default: m.Scenarios })));
const Play = lazy(() => import('../pages/Play').then((m) => ({ default: m.Play })));
const Daily = lazy(() => import('../pages/Daily').then((m) => ({ default: m.Daily })));
const Team = lazy(() => import('../pages/Team').then((m) => ({ default: m.Team })));
const Leaderboard = lazy(() =>
  import('../pages/Leaderboard').then((m) => ({ default: m.Leaderboard })),
);
const Hub = lazy(() => import('../pages/Hub').then((m) => ({ default: m.Hub })));
const Profile = lazy(() => import('../pages/Profile').then((m) => ({ default: m.Profile })));
const Handbook = lazy(() => import('../pages/Handbook').then((m) => ({ default: m.Handbook })));
const ArtGallery = import.meta.env.DEV
  ? lazy(() => import('../dev/ArtGallery').then((m) => ({ default: m.ArtGallery })))
  : null;

/** Every visit starts at the login screen; deep links come back after logging in. */
function RequireLogin() {
  const loggedIn = useSessionStore((s) => s.loggedIn);
  const onboarded = useUserStore((s) => s.onboarded);
  const location = useLocation();
  if (loggedIn && onboarded) return <Outlet />;
  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

function Loading() {
  return (
    <div role="status" className="grid min-h-dvh place-items-center text-muted">
      Đang tải…
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      {/* Landscape game frame: full screen on phones, centred on large desktops. */}
      <div className="relative mx-auto min-h-dvh w-full max-w-[1400px] bg-cream shadow-soft">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Navigate to="/login" replace />} />
            {ArtGallery && <Route path="/dev/art" element={<ArtGallery />} />}
            <Route element={<RequireLogin />}>
              <Route path="/" element={<Home />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/play/:id" element={<Play />} />
              <Route element={<AppLayout />}>
                <Route path="/core" element={<CoreTopics />} />
                <Route path="/core/:scenarioId" element={<Scenarios />} />
                <Route path="/scenarios" element={<Navigate to="/core" replace />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/team" element={<Team />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/hub" element={<Hub />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/handbook" element={<Handbook />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <RotateHint />
        <FullscreenKeeper />
      </div>
    </BrowserRouter>
  );
}
