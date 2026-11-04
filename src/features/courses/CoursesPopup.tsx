import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { COURSES, type Course } from '../../data/courses';
import { cn } from '../../lib/cn';
import { CourseBanner } from './CourseBanner';

/** Opens a course: the partner's own page (new tab) if it has one, else the in-game page. */
export function useOpenCourse() {
  const navigate = useNavigate();
  return (course: Course) => {
    if (course.url) window.open(course.url, '_blank', 'noopener,noreferrer');
    else navigate(`/course/${course.id}`);
  };
}

/**
 * Lobby pop-up (after login and from the "Khoá học" side button): partner courses.
 * Each course has a short introduction; "Xem chi tiết" goes to the course's detail page.
 */
export function CoursesPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const openCourse = useOpenCourse();
  const [active, setActive] = useState(0);
  const course = COURSES[active] as Course;

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
            aria-label="Khoá học từ đối tác"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="ink-border relative flex h-[min(calc(var(--app-h)*0.9),440px)] w-full max-w-3xl overflow-hidden rounded-[24px] bg-paper shadow-pop"
          >
            <nav
              aria-label="Danh sách khoá học"
              className="wood flex w-[28%] min-w-[150px] flex-col gap-1.5 overflow-y-auto border-r-[2.5px] border-navy p-2"
            >
              <p className="px-1 font-display text-lg text-navy">🎓 Khoá học</p>
              {COURSES.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active ? 'true' : undefined}
                  className={cn(
                    'ink-border rounded-xl px-2 py-1.5 text-left',
                    i === active ? 'bg-accent shadow-pop' : 'bg-paper/85',
                  )}
                >
                  <span className="block text-[10px] font-bold tracking-wide text-primary-dark">
                    ĐỐI TÁC
                  </span>
                  <span className="block font-display text-[15px] leading-tight text-navy">
                    {c.tab}
                  </span>
                </button>
              ))}
              <p className="mt-auto px-1 text-[11px] leading-snug text-navy/75">
                Khoá học do bên thứ ba cung cấp. Dữ liệu demo.
              </p>
            </nav>
            <section className="flex min-w-0 flex-1 flex-col">
              <div
                className="relative h-[40%] shrink-0 border-b-[2.5px] border-navy p-2"
                style={{ backgroundColor: course.tone }}
              >
                <span className="ink-border absolute left-3 top-3 rounded-full bg-paper px-2 font-display text-sm text-navy">
                  {course.partner}
                </span>
                <CourseBanner course={course} />
              </div>
              <div className="flex min-h-0 flex-1 flex-col p-3">
                <h2 className="font-display text-[24px] leading-tight text-navy">{course.title}</h2>
                <p className="mt-0.5 text-[15px] font-semibold text-navy/85">{course.tagline}</p>
                <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-ink">
                  {course.description}
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5 text-[13px] font-semibold text-navy">
                  {[course.format, course.duration, course.schedule].map((t) => (
                    <li key={t} className="ink-border rounded-full bg-cream px-2">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-end gap-2 pt-2">
                  <p className="mr-auto font-display text-2xl text-primary-dark">
                    {course.price}
                    {course.oldPrice && (
                      <span className="ml-1.5 text-base text-muted line-through">
                        {course.oldPrice}
                      </span>
                    )}
                  </p>
                  <Button variant="secondary" onClick={onClose}>
                    Đóng
                  </Button>
                  <Button
                    variant="green"
                    onClick={() => {
                      onClose();
                      openCourse(course);
                    }}
                  >
                    Xem chi tiết ▸
                  </Button>
                </div>
              </div>
            </section>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
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
