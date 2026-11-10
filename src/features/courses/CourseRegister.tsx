import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckIcon } from '../../art/icons';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import type { Course } from '../../data/courses';
import { formatVnd } from '../../data/packs';
import { cn } from '../../lib/cn';
import { playSound } from '../../lib/sound';
import {
  EMPTY_FORM,
  MAX_SEATS,
  normalizePhone,
  orderCode,
  totalFee,
  validateRegistration,
  type RegistrationErrors,
  type RegistrationForm,
} from './registration';

const METHODS = [
  { id: 'bank', label: 'Chuyển khoản / QR', color: '#1f7a4d' },
  { id: 'momo', label: 'Ví MoMo', color: '#a50064' },
  { id: 'zalopay', label: 'ZaloPay', color: '#0068ff' },
  { id: 'vnpay', label: 'VNPay', color: '#e4002b' },
  { id: 'card', label: 'Thẻ ATM / Visa', color: '#3b2d26' },
] as const;
type Method = (typeof METHODS)[number]['id'];

type Step = 'form' | 'pay' | 'paying' | 'done';

const INPUT =
  'ink-border h-11 w-full rounded-xl bg-cream px-3 text-base font-semibold text-navy placeholder:font-normal placeholder:text-muted short:h-9';

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="font-display text-[15px] text-navy">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-0.5 text-xs font-semibold text-primary-dark">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * In-app registration for a course: buyer details + number of seats, then payment of
 * price × seats. The demo has no payment provider: "Thanh toán" simulates a success.
 */
export function CourseRegister({
  course,
  open,
  onClose,
}: {
  course: Course;
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<RegistrationForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [step, setStep] = useState<Step>('form');
  const [method, setMethod] = useState<Method>('bank');
  const [code, setCode] = useState('');

  const total = totalFee(course.priceVnd, form.seats);
  const needsPayment = total !== null && total > 0;

  const set = <K extends keyof RegistrationForm>(k: K, v: RegistrationForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const close = () => {
    if (step === 'paying') return;
    if (step === 'done') {
      setForm(EMPTY_FORM);
      setStep('form');
    }
    onClose();
  };

  const finish = () => {
    playSound('win');
    setStep('done');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRegistration(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setCode(orderCode());
    if (needsPayment) setStep('pay');
    else finish();
  };

  const pay = () => {
    setStep('paying');
    window.setTimeout(finish, 1400);
  };

  const err = (k: keyof RegistrationForm) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `reg-${k}-err` : undefined,
  });

  const title =
    step === 'done'
      ? needsPayment
        ? 'Thanh toán thành công!'
        : 'Đã gửi đăng ký!'
      : step === 'form'
        ? 'Đăng ký khoá học'
        : 'Thanh toán';

  const summary = (
    <div className="ink-border flex items-center gap-3 rounded-2xl bg-[#fff1c2] p-2.5">
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg leading-tight text-navy">{course.title}</p>
        <p className="text-sm text-muted">
          {course.priceVnd === null
            ? 'Học phí: đơn vị sẽ báo khi liên hệ'
            : course.priceVnd === 0
              ? 'Miễn phí'
              : `${formatVnd(course.priceVnd)} × ${form.seats} người`}
        </p>
      </div>
      {needsPayment && (
        <p className="shrink-0 font-display text-2xl text-primary-dark">{formatVnd(total)}</p>
      )}
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={step === 'paying' ? undefined : close}
      title={title}
      tone={step === 'done' ? 'green' : step === 'form' ? 'wood' : 'navy'}
      sparkle={step === 'done'}
      size="lg"
    >
      <div className="flex flex-col gap-3 short:gap-2">
        {summary}

        {step === 'form' && (
          <form noValidate onSubmit={submit} className="flex flex-col gap-3 short:gap-2">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 short:gap-y-1">
              <Field id="reg-name" label="Họ tên *" error={errors.name} className="col-span-2">
                <input
                  id="reg-name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  autoComplete="name"
                  maxLength={60}
                  placeholder="Nguyễn Văn A"
                  className={INPUT}
                  {...err('name')}
                />
              </Field>
              <Field id="reg-age" label="Tuổi *" error={errors.age}>
                <input
                  id="reg-age"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={120}
                  value={form.age}
                  onChange={(e) => set('age', e.target.value)}
                  placeholder="25"
                  className={INPUT}
                  {...err('age')}
                />
              </Field>
              <Field id="reg-phone" label="Số điện thoại *" error={errors.phone}>
                <input
                  id="reg-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="0912 345 678"
                  className={INPUT}
                  {...err('phone')}
                />
              </Field>
              <Field id="reg-email" label="Email (nếu có)" error={errors.email}>
                <input
                  id="reg-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="ban@email.com"
                  className={INPUT}
                  {...err('email')}
                />
              </Field>
              <Field id="reg-seats" label="Số lượng khoá học" error={errors.seats}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Bớt một"
                    disabled={form.seats <= 1}
                    onClick={() => set('seats', form.seats - 1)}
                    className="ink-border grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper font-display text-2xl text-navy disabled:opacity-40 short:h-9 short:w-9"
                  >
                    −
                  </button>
                  <input
                    id="reg-seats"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={MAX_SEATS}
                    value={form.seats}
                    onChange={(e) => {
                      const n = Math.round(Number(e.target.value));
                      set('seats', Math.min(MAX_SEATS, Math.max(1, Number.isFinite(n) ? n : 1)));
                    }}
                    className={cn(INPUT, 'text-center')}
                    {...err('seats')}
                  />
                  <button
                    type="button"
                    aria-label="Thêm một"
                    disabled={form.seats >= MAX_SEATS}
                    onClick={() => set('seats', form.seats + 1)}
                    className="ink-border grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper font-display text-2xl text-navy disabled:opacity-40 short:h-9 short:w-9"
                  >
                    +
                  </button>
                </div>
              </Field>
            </div>
            <Button type="submit" size="lg" variant="green" block>
              {needsPayment ? `Tiếp tục thanh toán ${formatVnd(total)}` : 'Gửi đăng ký'}
            </Button>
          </form>
        )}

        {(step === 'pay' || step === 'paying') && (
          <>
            <dl className="ink-border grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 rounded-2xl bg-paper p-2.5 text-sm">
              <dt className="text-muted">Người đăng ký</dt>
              <dd className="truncate font-semibold text-navy">
                {form.name.trim()} · {form.age} tuổi
              </dd>
              <dt className="text-muted">Liên hệ</dt>
              <dd className="truncate font-semibold text-navy">
                {normalizePhone(form.phone)}
                {form.email.trim() && ` · ${form.email.trim()}`}
              </dd>
              <dt className="text-muted">Mã đơn</dt>
              <dd className="font-semibold text-navy">{code}</dd>
            </dl>
            <fieldset disabled={step === 'paying'}>
              <legend className="mb-1 font-display text-base text-navy">
                Phương thức thanh toán
              </legend>
              <div className="grid grid-cols-3 gap-1.5">
                {METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      'ink-border flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-[14px] font-semibold text-navy',
                      method === m.id ? 'bg-accent shadow-pop' : 'bg-paper',
                    )}
                  >
                    <input
                      type="radio"
                      name="course-pay-method"
                      className="sr-only"
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                    />
                    <span
                      aria-hidden
                      className="h-4 w-4 shrink-0 rounded-full border-2 border-navy"
                      style={{ backgroundColor: method === m.id ? m.color : 'transparent' }}
                    />
                    {m.label}
                  </label>
                ))}
              </div>
            </fieldset>
            {method === 'bank' && (
              <p className="rounded-xl bg-cream px-3 py-1.5 text-sm text-navy">
                Nội dung chuyển khoản: <b>{code}</b> · Số tiền: <b>{formatVnd(total ?? 0)}</b>
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={step === 'paying'}
                onClick={() => setStep('form')}
                className="shrink-0"
              >
                Sửa thông tin
              </Button>
              <Button size="lg" block disabled={step === 'paying'} onClick={pay}>
                {step === 'paying' ? 'Đang xử lý…' : `Thanh toán ${formatVnd(total ?? 0)}`}
              </Button>
            </div>
          </>
        )}

        {step === 'done' && (
          <>
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-2 font-display text-2xl text-success-dark"
            >
              <CheckIcon size={30} /> Mã đơn {code}
            </motion.div>
            <p className="text-center text-[15px] leading-relaxed text-ink">
              {course.partner} sẽ liên hệ <b>{form.name.trim()}</b> qua số{' '}
              <b>{normalizePhone(form.phone)}</b> để xác nhận lịch học cho {form.seats} người.
            </p>
            <Button size="lg" variant="green" block onClick={close}>
              Tuyệt vời!
            </Button>
          </>
        )}

        {step !== 'done' && (
          <p className="-mt-1 text-center text-[11px] leading-snug text-muted">
            Bản demo: không gửi thông tin và không trừ tiền thật.
          </p>
        )}
      </div>
    </Modal>
  );
}
