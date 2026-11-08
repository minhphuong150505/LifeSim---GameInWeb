import { C, INK, stroke } from '../../art/ink';
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
        className={cn('h-full w-full', fit === 'cover' ? 'object-cover' : 'object-contain', className)}
      />
    );
  }
  if (course.sponsored) {
    return (
      <div className={cn('h-full w-full p-2', className)} style={{ backgroundColor: course.tone }}>
        <CourseBanner course={course} />
      </div>
    );
  }
  return <TopicArt topic={course.cover} className={cn('h-full w-full', className)} />;
}

/** Illustration for a course card: a trainer with a first-aid dummy or a heart + AED. */
export function CourseBanner({ course }: { course: Course }) {
  if (course.id === 'cpr-aed') {
    return (
      <svg viewBox="-100 -110 200 120" className="h-full w-full" aria-hidden>
        <Person kind="mom" x={-45} y={0} scale={0.8} armR="point" eyes="happy" mouth="smile" />
        <g transform="translate(25 -55)">
          <rect x={-26} y={-30} width={52} height={60} rx={10} fill={C.yellow} {...stroke(3)} />
          <path d="M-8 -14 L4 -14 L-2 0 L8 0 L-6 20 L-2 4 L-10 4 Z" fill={C.red} {...stroke(2)} />
          <text x={0} y={26} textAnchor="middle" fontSize={11} fontFamily="Itim" fill={INK}>
            AED
          </text>
        </g>
        <g transform="translate(78 -82) scale(0.9)">
          <HeartGlyph />
        </g>
      </svg>
    );
  }
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

function HeartGlyph() {
  return (
    <path
      d="M0 17 C-10 10 -19 3 -19 -7 C-19 -14 -14 -18 -8 -18 C-4 -18 -1.5 -15.5 0 -13 C1.5 -15.5 4 -18 8 -18 C14 -18 19 -14 19 -7 C19 3 10 10 0 17 Z"
      fill={C.red}
      {...stroke(3)}
    />
  );
}
