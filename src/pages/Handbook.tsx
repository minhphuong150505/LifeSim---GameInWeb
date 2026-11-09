import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { DISCLAIMER } from '../data/copy';
import {
  EMERGENCY_NUMBERS,
  GENERIC_NOTE,
  HANDBOOK,
  HANDBOOK_INTRO,
  HANDBOOK_SOURCES,
  HANDBOOK_TITLE,
  HANDBOOK_UPCOMING,
  getArticle,
  searchHandbook,
  type HandbookArticle,
  type HandbookList,
} from '../data/handbook';
import {
  AlertGlyph,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CrossMark,
  DocGlyph,
  ExternalGlyph,
  EyeGlyph,
  InfoGlyph,
  PhoneGlyph,
  PlayGlyph,
  SearchGlyph,
  TopicGlyph,
  XCircle,
  XGlyph,
} from '../features/handbook/icons';
import { cn } from '../lib/cn';
import { useMissionStore } from '../store/missions';

/*
 * Cẩm nang sơ cấp cứu – a reference document, deliberately sober (not the game's art style).
 * Rendered outside the landscape game frame as a normal responsive page, so it reads well
 * in portrait (see Shell in App.tsx and FullscreenKeeper).
 */

/** Opening the handbook counts as "đọc lại cẩm nang" for today's mission. */
function useHandbookMission() {
  const markActivity = useMissionStore((s) => s.markActivity);
  useEffect(() => {
    markActivity('handbook');
  }, [markActivity]);
}

const scrollRoot = () => document.getElementById('page-root');

function TopBar({
  title,
  backTo,
  backLabel,
}: {
  title: string;
  backTo: string;
  backLabel: string;
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-[max(12px,env(safe-area-inset-left))]">
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="-ml-1 flex h-10 shrink-0 items-center gap-1 rounded-md px-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
          <span>{backLabel}</span>
        </button>
        <h1 className="min-w-0 flex-1 truncate text-center text-base text-slate-900">{title}</h1>
        {/* Emergency call always one tap away. */}
        <a
          href="tel:115"
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 text-sm font-semibold text-red-700"
          aria-label="Gọi cấp cứu 115"
        >
          <PhoneGlyph size={16} strokeWidth={2} />
          115
        </a>
      </div>
    </header>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="handbook min-h-full bg-slate-50 text-slate-800 antialiased">{children}</div>
  );
}

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto max-w-5xl px-[max(16px,env(safe-area-inset-left))] pb-[max(24px,env(safe-area-inset-bottom))]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function EmergencyPanel() {
  return (
    <section
      aria-labelledby="emergency-title"
      className="rounded-xl border border-red-200 bg-red-50 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-700 text-white">
          <AlertGlyph size={20} strokeWidth={2} />
        </span>
        <div>
          <h2 id="emergency-title" className="text-lg text-red-800">
            Tình huống khẩn cấp?
          </h2>
          <p className="text-sm text-red-900/80">Gọi ngay để được hỗ trợ y tế.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {EMERGENCY_NUMBERS.map((e, i) => (
          <a
            key={e.number}
            href={`tel:${e.number}`}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-3',
              i === 0
                ? 'bg-red-700 text-white hover:bg-red-800'
                : 'border border-red-300 bg-white text-red-800 hover:bg-red-100',
            )}
          >
            <PhoneGlyph size={22} strokeWidth={2} className="shrink-0" />
            <span className="min-w-0">
              <span className="block text-xl font-semibold leading-tight">{e.number}</span>
              <span className="block text-xs leading-snug opacity-90">{e.label}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* List                                                                                         */
/* ------------------------------------------------------------------------------------------ */

function TopicCard({ article }: { article: HandbookArticle }) {
  return (
    <Link
      to={`/handbook/${article.id}`}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl bg-slate-800 text-white shadow-sm ring-1 ring-slate-900/10 focus-visible:outline-offset-2"
    >
      {article.photo ? (
        <img
          src={article.photo}
          alt={article.photoBrief}
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900"
        >
          <TopicGlyph
            icon={article.icon}
            size={96}
            strokeWidth={1.2}
            className="absolute -right-3 -top-2 text-white/15"
          />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
      <span className="absolute left-3 top-2.5 text-xs font-semibold tracking-wider text-white/70">
        {article.number}
      </span>
      <span className="relative flex items-end gap-2 p-3">
        <TopicGlyph icon={article.icon} size={20} className="mb-0.5 shrink-0" />
        <span className="text-[15px] font-semibold leading-snug">{article.title}</span>
      </span>
    </Link>
  );
}

function UpcomingCard({ title, icon }: (typeof HANDBOOK_UPCOMING)[number]) {
  return (
    <div
      aria-disabled
      className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white text-slate-400"
    >
      <span className="absolute left-3 top-2.5 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">
        Đang biên soạn
      </span>
      <span className="flex items-end gap-2 p-3">
        <TopicGlyph icon={icon} size={20} className="mb-0.5 shrink-0" />
        <span className="text-[15px] font-semibold leading-snug">{title}</span>
      </span>
    </div>
  );
}

export function Handbook() {
  useHandbookMission();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchHandbook(query), [query]);
  const searching = query.trim().length > 0;

  return (
    <Shell>
      <TopBar title={HANDBOOK_TITLE} backTo="/" backLabel="Trò chơi" />
      <Container className="pt-4 sm:pt-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-red-700 text-white">
              <CrossMark size={26} strokeWidth={1.6} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                LifeSim · Tài liệu tham khảo
              </p>
              <h2 className="mt-0.5 text-2xl text-slate-900 sm:text-[28px]">{HANDBOOK_TITLE}</h2>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{HANDBOOK_INTRO}</p>
            </div>
          </div>
          <label className="relative mt-4 block">
            <span className="sr-only">Tìm kiếm tình huống</span>
            <SearchGlyph
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm tình huống, dấu hiệu…"
              className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-10 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:outline-none"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Xóa tìm kiếm"
                className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
              >
                <XGlyph size={16} />
              </button>
            )}
          </label>
        </section>

        <section aria-labelledby="topics-title" className="mt-6">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 id="topics-title" className="text-lg text-slate-900">
              {searching ? 'Kết quả tìm kiếm' : 'Các tình huống'}
            </h2>
            <span className="text-sm text-slate-500" aria-live="polite">
              {searching
                ? `${results.length} bài phù hợp`
                : `${HANDBOOK.length} bài · ${HANDBOOK_UPCOMING.length} bài đang biên soạn`}
            </span>
          </div>
          {results.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
              Không tìm thấy tình huống phù hợp với “{query.trim()}”.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((a) => (
                <TopicCard key={a.id} article={a} />
              ))}
              {!searching && HANDBOOK_UPCOMING.map((u) => <UpcomingCard key={u.id} {...u} />)}
            </div>
          )}
        </section>

        <div className="mt-6">
          <EmergencyPanel />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">{DISCLAIMER}</p>
      </Container>
    </Shell>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Article                                                                                      */
/* ------------------------------------------------------------------------------------------ */

const SECTIONS = [
  { id: 'nhan-biet', label: 'Nhận biết' },
  { id: 'nen-lam', label: 'Bạn nên làm gì?' },
  { id: 'khong-nen', label: 'Không nên làm gì?' },
  { id: 'goi-cap-cuu', label: 'Khi nào cần gọi cấp cứu?' },
  { id: 'video', label: 'Video hướng dẫn thực tế' },
  { id: 'nguon', label: 'Nguồn tham khảo' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

const TONES = {
  red: 'border-red-200 bg-red-50 text-red-800',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  blue: 'border-sky-200 bg-sky-50 text-sky-900',
  slate: 'border-slate-200 bg-slate-50 text-slate-800',
} as const;

function Section({
  id,
  title,
  icon,
  tone,
  children,
}: {
  id: SectionId;
  title: string;
  icon: React.ReactNode;
  tone: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <h2
        id={`${id}-title`}
        className={cn('flex items-center gap-2.5 border-b px-4 py-3 text-[17px]', TONES[tone])}
      >
        {icon}
        {title}
      </h2>
      <div className="px-4 py-4 text-[15.5px] leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

function ListBody({ list }: { list: HandbookList }) {
  return (
    <>
      {list.paragraphs?.map((p) => (
        <p key={p} className="[&+p]:mt-2">
          {p}
        </p>
      ))}
      {list.intro && <p className="font-semibold text-slate-800">{list.intro}</p>}
      {list.bullets && (
        <ul className={cn('space-y-1.5', list.intro && 'mt-2')}>
          {list.bullets.map((b) => (
            <li key={b} className="flex gap-2.5">
              <span
                aria-hidden
                className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Actions({ article }: { article: HandbookArticle }) {
  // "Bước n" keeps counting across the condition headings (as in the document).
  const stepNumbers = article.actions.map(
    (_, i) => article.actions.slice(0, i + 1).filter((x) => x.kind === 'step').length,
  );
  return (
    <>
      <ol className="space-y-3">
        {article.actions.map((a, i) => {
          if (a.kind === 'condition')
            return (
              <li
                key={a.text}
                className="border-l-[3px] border-emerald-600 pl-3 font-semibold text-emerald-900 [&:not(:first-child)]:mt-5"
              >
                {a.text}
              </li>
            );
          if (a.kind === 'text')
            return (
              <li key={a.text} className="pl-[15px]">
                {a.text}
              </li>
            );
          return (
            <li key={a.text} className="flex gap-3">
              <span className="mt-0.5 grid h-7 min-w-11 shrink-0 place-items-center rounded-md bg-slate-900 px-1.5 text-xs font-semibold text-white">
                Bước {stepNumbers[i]}
              </span>
              <span>{a.text}</span>
            </li>
          );
        })}
      </ol>
      {article.actionNotes?.map((n) => (
        <p
          key={n}
          className="mt-4 flex gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5 text-[14.5px] text-slate-600"
        >
          <InfoGlyph size={18} className="mt-0.5 shrink-0 text-slate-500" />
          <span>{n}</span>
        </p>
      ))}
      {article.escalation && (
        <p
          role="note"
          className="mt-4 flex gap-2.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-[14.5px] text-amber-900"
        >
          <AlertGlyph size={18} className="mt-0.5 shrink-0 text-amber-700" />
          <span>{article.escalation}</span>
        </p>
      )}
    </>
  );
}

function Video({ video }: { video: HandbookArticle['video'] }) {
  const [playing, setPlaying] = useState(false);
  const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 grid place-items-center"
            aria-label={`Phát video: ${video.title}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="relative grid h-14 w-14 place-items-center rounded-full bg-red-700 text-white shadow-lg transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden>
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <div className="mt-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug text-slate-900">{video.title}</p>
          <p className="text-sm text-slate-500">British Red Cross · YouTube</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-sky-800 hover:bg-sky-50"
        >
          YouTube <ExternalGlyph size={16} />
        </a>
      </div>
    </div>
  );
}

function Toc({
  sections,
  current,
}: {
  sections: { id: SectionId; label: string }[];
  current: HandbookArticle;
}) {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <nav aria-label="Mục lục bài viết" className="space-y-5">
      <div>
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Trong bài này
        </p>
        <ul className="mt-1.5 space-y-0.5">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                className="w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-200/60"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Các tình huống
        </p>
        <ul className="mt-1.5 space-y-0.5">
          {HANDBOOK.map((a) => (
            <li key={a.id}>
              <Link
                to={`/handbook/${a.id}`}
                aria-current={a.id === current.id ? 'page' : undefined}
                className={cn(
                  'flex gap-2 rounded-md px-2 py-1.5 text-sm',
                  a.id === current.id
                    ? 'bg-white font-semibold text-slate-900 ring-1 ring-slate-200'
                    : 'text-slate-600 hover:bg-slate-200/60',
                )}
              >
                <span className="w-5 shrink-0 text-slate-400">{a.number}</span>
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function HandbookArticlePage() {
  useHandbookMission();
  const { id } = useParams();
  const article = getArticle(id);

  useEffect(() => {
    scrollRoot()?.scrollTo(0, 0);
  }, [id]);

  if (!article) return <Navigate to="/handbook" replace />;

  const index = HANDBOOK.indexOf(article);
  const prev = HANDBOOK[index - 1];
  const next = HANDBOOK[index + 1];
  const sections = SECTIONS.filter(
    (s) =>
      (s.id !== 'khong-nen' || article.avoid.length > 0) &&
      (s.id !== 'goi-cap-cuu' || article.whenToCall),
  ).map((s) =>
    s.id === 'khong-nen' && article.avoidTitle ? { ...s, label: article.avoidTitle } : s,
  );
  const jump = (sid: string) =>
    document.getElementById(sid)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Shell>
      <TopBar title={article.title} backTo="/handbook" backLabel="Cẩm nang" />

      {/* Quick navigation between sections (phones / narrow screens). */}
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl gap-1.5 overflow-x-auto px-[max(12px,env(safe-area-inset-left))] py-2 [scrollbar-width:none]">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jump(s.id)}
              className="shrink-0 rounded-full border border-slate-300 bg-white px-3 py-1 text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Container className="pt-4 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 lg:pt-6">
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <Toc sections={sections} current={article} />
          </div>
        </aside>

        <article className="min-w-0 space-y-4">
          <header className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {article.photo ? (
              <img
                src={article.photo}
                alt={article.photoBrief}
                className="aspect-[16/9] w-full object-cover"
              />
            ) : (
              <div className="relative h-28 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 sm:h-32">
                <TopicGlyph
                  icon={article.icon}
                  size={150}
                  strokeWidth={1}
                  className="absolute -top-4 right-2 text-white/15"
                />
                <span className="absolute bottom-3 left-4 grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-white ring-1 ring-white/25">
                  <TopicGlyph icon={article.icon} size={24} />
                </span>
              </div>
            )}
            <div className="p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                Tình huống {article.number}
              </p>
              <h2 className="mt-1 text-2xl text-slate-900 sm:text-[28px]">{article.title}</h2>
            </div>
          </header>

          <Section
            id="nhan-biet"
            title="Nhận biết"
            tone="red"
            icon={<EyeGlyph size={20} className="shrink-0" />}
          >
            <ListBody list={article.recognize} />
          </Section>

          <Section
            id="nen-lam"
            title="Bạn nên làm gì?"
            tone="green"
            icon={<CheckCircle size={20} className="shrink-0" />}
          >
            <Actions article={article} />
          </Section>

          {article.avoid.length > 0 && (
            <Section
              id="khong-nen"
              title={article.avoidTitle ?? 'Không nên làm gì?'}
              tone="red"
              icon={<XCircle size={20} className="shrink-0" />}
            >
              <ul className="space-y-2">
                {article.avoid.map((a) => (
                  <li key={a} className="flex gap-2.5">
                    <XGlyph size={18} strokeWidth={2.2} className="mt-1 shrink-0 text-red-600" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {article.whenToCall && (
            <Section
              id="goi-cap-cuu"
              title={article.whenToCall.title}
              tone="blue"
              icon={<PhoneGlyph size={19} className="shrink-0" />}
            >
              <ListBody list={article.whenToCall} />
              <div className="mt-4 flex flex-wrap gap-2">
                {EMERGENCY_NUMBERS.map((e) => (
                  <a
                    key={e.number}
                    href={`tel:${e.number}`}
                    className="flex items-center gap-2 rounded-md border border-sky-300 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-900 hover:bg-sky-100"
                  >
                    <PhoneGlyph size={16} /> Gọi {e.number}
                  </a>
                ))}
              </div>
            </Section>
          )}

          <Section
            id="video"
            title="Video hướng dẫn thực tế"
            tone="slate"
            icon={<PlayGlyph size={20} className="shrink-0" />}
          >
            <Video video={article.video} />
          </Section>

          <aside
            role="note"
            className="flex gap-3 rounded-xl border border-sky-200 bg-sky-50/60 p-4 text-[15px] leading-relaxed text-slate-700"
          >
            <InfoGlyph size={20} className="mt-0.5 shrink-0 text-sky-800" />
            <div>
              <p className="font-semibold text-sky-900">Lưu ý</p>
              <p className="mt-0.5">{article.note ?? GENERIC_NOTE}</p>
            </div>
          </aside>

          <Section
            id="nguon"
            title="Nguồn tham khảo"
            tone="slate"
            icon={<DocGlyph size={20} className="shrink-0" />}
          >
            <ul className="space-y-1 text-[14.5px]">
              {HANDBOOK_SOURCES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Section>

          <EmergencyPanel />

          <nav aria-label="Bài khác" className="grid grid-cols-2 gap-3 pt-2">
            {prev ? (
              <Link
                to={`/handbook/${prev.id}`}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-100"
              >
                <ChevronLeft size={18} className="shrink-0 text-slate-400" />
                <span className="min-w-0">
                  <span className="block text-xs text-slate-500">Bài trước</span>
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/handbook/${next.id}`}
                className="flex items-center justify-end gap-2 rounded-xl border border-slate-200 bg-white p-3 text-right hover:bg-slate-100"
              >
                <span className="min-w-0">
                  <span className="block text-xs text-slate-500">Bài tiếp theo</span>
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {next.title}
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-slate-400" />
              </Link>
            )}
          </nav>

          <p className="text-xs leading-relaxed text-slate-500">{DISCLAIMER}</p>
        </article>
      </Container>
    </Shell>
  );
}
