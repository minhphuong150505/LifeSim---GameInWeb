/** Course registration form: fields, validation and pricing (kept pure for tests). */

export const MAX_SEATS = 10;

export type RegistrationForm = {
  name: string;
  age: string;
  phone: string;
  email: string;
  seats: number;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationForm, string>>;

export const EMPTY_FORM: RegistrationForm = { name: '', age: '', phone: '', email: '', seats: 1 };

/** Vietnamese mobile number: 0xxxxxxxxx or +84xxxxxxxxx (spaces, dots and dashes allowed). */
export function normalizePhone(raw: string): string {
  return raw.replace(/[\s.-]/g, '');
}

const PHONE_RE = /^(0|\+84)[35789]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration(f: RegistrationForm): RegistrationErrors {
  const e: RegistrationErrors = {};
  const name = f.name.trim();
  if (name.length < 2) e.name = 'Vui lòng nhập họ tên.';
  const age = Number(f.age);
  if (!f.age.trim() || !Number.isInteger(age) || age < 1 || age > 120) e.age = 'Tuổi không hợp lệ.';
  if (!PHONE_RE.test(normalizePhone(f.phone))) e.phone = 'Số điện thoại không hợp lệ.';
  if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) e.email = 'Email không hợp lệ.';
  if (!Number.isInteger(f.seats) || f.seats < 1 || f.seats > MAX_SEATS)
    e.seats = `Số lượng từ 1 đến ${MAX_SEATS}.`;
  return e;
}

/** Total fee: unit price × number of seats (null when the fee is not announced). */
export function totalFee(priceVnd: number | null, seats: number): number | null {
  return priceVnd === null ? null : priceVnd * seats;
}

/** Short order code used as the payment reference, e.g. "LS7K3QZP". */
export function orderCode(now = Date.now(), rand = Math.random()): string {
  const tail = Math.floor(rand * 36 ** 2)
    .toString(36)
    .padStart(2, '0');
  return `LS${now.toString(36).slice(-4)}${tail}`.toUpperCase();
}
