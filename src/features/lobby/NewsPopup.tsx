import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookIcon, FlameIcon, PartyIcon, PinIcon, TrophyIcon } from '../../art/icons';
import { Mascot } from '../../art/Mascot';
import { Person } from '../../art/Person';
import { Button } from '../../components/Button';
import { NEWS, NEWS_KIND_LABEL, type NewsItem } from '../../data/news';
import { cn } from '../../lib/cn';

function Banner({ item }: { item: NewsItem }) {
  if (item.kind === 'event') {
    return (
      <svg viewBox="-100 -120 200 130" className="h-full w-full" aria-hidden>
        {[-70, -35, 0, 35, 70].map((x, i) => (
          <Person
            key={x}
            kind={(['player', 'brother', 'mascot', 'mom', 'dad'] as const)[i]!}
            x={x}
            y={0}
            scale={0.75}
            armR={i % 2 ? 'wave' : 'down'}
            eyes="happy"
            mouth="grin"
          />
        ))}
      </svg>
    );
  }
  if (item.kind === 'ad') {
    return (
      <div className="flex h-full items-center justify-center gap-2">
        <PinIcon size={72} />
        <BookIcon size={72} />
      </div>
    );
  }
  if (item.id === 'notice-mission') {
    return (
      <div className="flex h-full items-center justify-center gap-2">
        <FlameIcon size={64} />
        <TrophyIcon size={64} />
      </div>
    );
  }
  return (
    <svg viewBox="-60 -110 120 120" className="h-full w-full" aria-hidden>
      <Person kind="brother" x={0} y={0} blood eyes="worried" mouth="o" armR="nose" />
    </svg>
  );
}

/** Overview pop-up after login: events, publisher notices and ads (if any). */
export function NewsPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const item = NEWS[active] as NewsItem;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-navy/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Thông báo"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="ink-border relative flex h-[min(88dvh,420px)] w-full max-w-3xl overflow-hidden rounded-[24px] bg-paper shadow-pop"
          >
            <nav
              aria-label="Danh sách thông báo"
              className="wood flex w-[30%] min-w-[150px] flex-col gap-1.5 overflow-y-auto border-r-[2.5px] border-navy p-2"
            >
              <p className="px-1 font-display text-lg text-navy">📣 Thông báo</p>
              {NEWS.map((n, i) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active ? 'true' : undefined}
                  className={cn(
                    'ink-border rounded-xl px-2 py-1.5 text-left',
                    i === active ? 'bg-accent shadow-pop' : 'bg-paper/85',
                  )}
                >
                  <span className="block text-[10px] font-bold tracking-wide text-primary-dark">
                    {NEWS_KIND_LABEL[n.kind]}
                  </span>
                  <span className="block font-display text-[15px] leading-tight text-navy">
                    {n.tab}
                  </span>
                </button>
              ))}
            </nav>
            <section className="flex min-w-0 flex-1 flex-col">
              <div
                className="relative h-[45%] shrink-0 border-b-[2.5px] border-navy p-2"
                style={{ backgroundColor: item.tone }}
              >
                <span className="ink-border absolute left-3 top-3 rounded-full bg-paper px-2 font-display text-sm text-navy">
                  {NEWS_KIND_LABEL[item.kind]}
                </span>
                <Banner item={item} />
                {item.kind === 'event' && (
                  <span className="absolute bottom-2 right-3">
                    <PartyIcon size={44} />
                  </span>
                )}
              </div>
              <div className="flex min-h-0 flex-1 flex-col p-3">
                <h2 className="font-display text-2xl leading-tight text-navy">{item.title}</h2>
                <p className="mt-1 min-h-0 flex-1 overflow-y-auto text-[15px] leading-relaxed text-ink">
                  {item.body}
                </p>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <Mascot className="mr-auto hidden h-14 w-12 sm:block" />
                  {item.cta && (
                    <Button
                      variant="green"
                      onClick={() => {
                        onClose();
                        navigate(item.cta!.to);
                      }}
                    >
                      {item.cta.label}
                    </Button>
                  )}
                  <Button variant="secondary" onClick={onClose}>
                    Đóng
                  </Button>
                </div>
              </div>
            </section>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng thông báo"
              className="ink-border absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-xl bg-paper text-xl text-navy"
            >
              ×
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
