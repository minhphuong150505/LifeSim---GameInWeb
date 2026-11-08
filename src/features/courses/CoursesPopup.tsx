import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPONSORED_COURSES, type Course } from '../../data/courses';
import { cn } from '../../lib/cn';
import { CourseCover } from './CourseBanner';

/**
 * Lobby pop-up shown after logging in: a partner course ad as a big banner filling most of
 * the screen. Tapping the banner opens the course's detail page (whose back button leads to
 * the Practice Hub, then the lobby). With several partner courses, arrows/dots switch ads.
 */
export function CoursesPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const count = SPONSORED_COURSES.length;
  const course = SPONSORED_COURSES[active] as Course;
  const register = () => {
    onClose();
    navigate(`/course/${course.id}`);
  };
  const step = (d: number) => setActive((i) => (i + d + count) % count);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-navy/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Khoá học từ đối tác"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-[min(94vw,calc(var(--app-h,100dvh)*0.84*16/9))]"
          >
            <button
              type="button"
              onClick={register}
              aria-label={`Xem khoá ${course.title}`}
              className="ink-border block aspect-[16/9] w-full overflow-hidden rounded-[22px] shadow-pop active:scale-[0.99]"
              style={{ backgroundColor: course.tone }}
            >
              <CourseCover course={course} fit="cover" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="ink-border absolute -right-2 -top-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-primary font-display text-2xl leading-none text-white shadow-pop"
            >
              ×
            </button>
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Khoá học trước"
                  className="ink-border absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-paper/90 font-display text-xl text-navy shadow-pop"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Khoá học tiếp theo"
                  className="ink-border absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-paper/90 font-display text-xl text-navy shadow-pop"
                >
                  ›
                </button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-navy/45 px-2 py-1">
                  {SPONSORED_COURSES.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={c.tab}
                      aria-current={i === active ? 'true' : undefined}
                      className={cn(
                        'h-2.5 rounded-full border border-navy transition-all',
                        i === active ? 'w-6 bg-accent' : 'w-2.5 bg-paper',
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
