import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { CheckIcon } from '../art/icons';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { getCourse } from '../data/courses';
import { CourseCover } from '../features/courses/CourseBanner';

/** Detail page of a partner course (stand-in for the partner's own website in the demo). */
export function CourseDetail() {
  const { id } = useParams();
  const course = getCourse(id);
  const [registered, setRegistered] = useState(false);
  if (!course) return <Navigate to="/" replace />;

  return (
    <div>
      <PageHeader
        title={course.title}
        subtitle={course.sponsored ? `Đối tác: ${course.partner}` : course.partner}
        backTo="/hub"
      />
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 px-4">
        <div className="flex flex-col gap-3">
          <div
            className="ink-border aspect-[16/9] overflow-hidden rounded-[22px] shadow-pop"
            style={{ backgroundColor: course.tone }}
          >
            <CourseCover course={course} />
          </div>
          <dl className="ink-border grid grid-cols-2 gap-x-3 gap-y-1 rounded-2xl bg-paper p-3 text-[15px]">
            <dt className="text-muted">Hình thức</dt>
            <dd className="font-semibold text-navy">{course.format}</dd>
            <dt className="text-muted">Thời lượng</dt>
            <dd className="font-semibold text-navy">{course.duration}</dd>
            <dt className="text-muted">Lịch học</dt>
            <dd className="font-semibold text-navy">{course.schedule}</dd>
            {course.address && (
              <>
                <dt className="text-muted">Địa chỉ</dt>
                <dd className="font-semibold text-navy">{course.address}</dd>
              </>
            )}
          </dl>
        </div>
        <div className="flex flex-col gap-3">
          <p className="font-display text-xl leading-snug text-navy">{course.tagline}</p>
          <p className="text-[15px] leading-relaxed text-ink">{course.description}</p>
          <ul className="space-y-1.5">
            {course.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-[15px] font-semibold text-navy">
                <CheckIcon size={22} />
                {h}
              </li>
            ))}
          </ul>
          <div className="ink-border mt-1 flex items-center gap-3 rounded-2xl bg-[#fff1c2] p-3 shadow-soft">
            <div className="min-w-0 flex-1">
              <p className="font-display text-3xl leading-tight text-primary-dark">
                {course.price}
                {course.oldPrice && (
                  <span className="ml-2 text-lg text-muted line-through">{course.oldPrice}</span>
                )}
              </p>
              {course.priceNote && (
                <p className="text-sm font-semibold text-navy/80">{course.priceNote}</p>
              )}
            </div>
            <Button
              size="lg"
              variant="green"
              onClick={() =>
                course.url
                  ? window.open(course.url, '_blank', 'noopener,noreferrer')
                  : setRegistered(true)
              }
            >
              Đăng ký học
            </Button>
          </div>
          <p className="text-xs text-muted">
            {course.url
              ? `Khoá học do ${course.partner} tổ chức. "Đăng ký học" mở trang chính thức của đơn vị. Lịch và học phí có thể thay đổi, vui lòng kiểm tra lại trên trang đó.`
              : `Khoá học do ${course.partner} cung cấp và thu phí. LifeSim chỉ giới thiệu. (Dữ liệu demo.)`}
          </p>
        </div>
      </div>

      <Modal
        open={registered}
        onClose={() => setRegistered(false)}
        title="Đã gửi đăng ký!"
        tone="green"
      >
        <p className="text-center text-[15px] leading-relaxed text-ink">
          {course.partner} sẽ liên hệ với bạn để xác nhận lịch học. (Bản demo: chưa gửi thông tin
          thật.)
        </p>
        <Button block className="mt-3" onClick={() => setRegistered(false)}>
          Đóng
        </Button>
      </Modal>
    </div>
  );
}
