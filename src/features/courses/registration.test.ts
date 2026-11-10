import { describe, expect, it } from 'vitest';
import { EMPTY_FORM, orderCode, totalFee, validateRegistration } from './registration';

const ok = { name: 'Nguyễn Minh Anh', age: '25', phone: '0912 345 678', email: '', seats: 2 };

describe('course registration', () => {
  it('accepts a complete form without email', () => {
    expect(validateRegistration(ok)).toEqual({});
  });

  it('flags missing required fields', () => {
    const e = validateRegistration(EMPTY_FORM);
    expect(Object.keys(e).sort()).toEqual(['age', 'name', 'phone']);
  });

  it('checks phone, email, age and seats', () => {
    expect(validateRegistration({ ...ok, phone: '+84912345678' })).toEqual({});
    expect(validateRegistration({ ...ok, phone: '012345' }).phone).toBeTruthy();
    expect(validateRegistration({ ...ok, email: 'a@b' }).email).toBeTruthy();
    expect(validateRegistration({ ...ok, email: 'a@b.vn' })).toEqual({});
    expect(validateRegistration({ ...ok, age: '0' }).age).toBeTruthy();
    expect(validateRegistration({ ...ok, age: '2.5' }).age).toBeTruthy();
    expect(validateRegistration({ ...ok, seats: 0 }).seats).toBeTruthy();
    expect(validateRegistration({ ...ok, seats: 11 }).seats).toBeTruthy();
  });

  it('multiplies the fee by the number of seats', () => {
    expect(totalFee(1_755_000, 2)).toBe(3_510_000);
    expect(totalFee(0, 3)).toBe(0);
    expect(totalFee(null, 2)).toBeNull();
  });

  it('builds an uppercase order code', () => {
    expect(orderCode(1_700_000_000_000, 0.5)).toMatch(/^LS[0-9A-Z]{6}$/);
  });
});
