import { isUniqueViolation } from '../pg-errors';

describe('isUniqueViolation', () => {
  it('recognizes the Postgres unique-violation code', () => {
    expect(isUniqueViolation({ code: '23505' })).toBe(true);
  });

  it('rejects other PG codes and non-error values', () => {
    expect(isUniqueViolation({ code: '23503' })).toBe(false); // FK violation
    expect(isUniqueViolation(new Error('boom'))).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation('23505')).toBe(false);
  });
});
