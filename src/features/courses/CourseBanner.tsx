import { C, stroke } from '../../art/ink';
import { Person } from '../../art/Person';
import { TopicArt } from '../../art/TopicArt';
import type { Course } from '../../data/courses';
import { cn } from '../../lib/cn';

/**
 * Cover of a course in cards, the pop-up and the detail page: the partner's banner image,
 * a drawn banner for the demo partner, or the course's topic illustration.
 */
export function CourseCover({
  course,
  className,
  fit = 'contain',
}: {
  course: Course;
  className?: string;
  /** How a banner image fills its box. */
  fit?: 'contain' | 'cover';
}) {
  if (course.banner) {
    return (
      <img
        src={course.banner}
        alt={course.title}
        draggable={false}
        className={cn(
          'h-full w-full',
          fit === 'cover' ? 'object-cover' : 'object-contain',
          className,
        )}
      />
    );
  }
  if (course.sponsored) {
    return (
      <div className={cn('h-full w-full p-2', className)} style={{ backgroundColor: course.tone }}>
        <CourseBanner />
      </div>
    );
  }
  return <TopicArt topic={course.cover} className={cn('h-full w-full', className)} />;
}

/** Drawn banner for a partner course without its own banner image. */
export function CourseBanner() {
  return (
    <svg viewBox="-100 -110 200 120" className="h-full w-full" aria-hidden>
      <Person kind="dad" x={-50} y={0} scale={0.8} armR="wave" eyes="happy" mouth="grin" />
      <Person kind="player" x={10} y={0} scale={0.75} eyes="happy" mouth="smile" />
      <g transform="translate(62 -40)">
        <rect x={-24} y={-20} width={48} height={36} rx={6} fill={C.white} {...stroke(3)} />
        <path
          d="M-5 -12 h10 v8 h8 v10 h-8 v8 h-10 v-8 h-8 v-10 h8 Z"
          fill={C.red}
          {...stroke(1.5)}
        />
      </g>
    </svg>
  );
}
