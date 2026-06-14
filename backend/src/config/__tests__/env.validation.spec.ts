import { validateEnv } from '../env.validation';

const VALID_ENV = {
  JWT_SECRET: 'a-secret-that-is-definitely-32-chars-long',
  DATABASE_URL: 'postgres://chat@localhost:5432/chat_mvp',
};

describe('validateEnv (fail-fast at boot)', () => {
  it('accepts a valid config and converts PORT from string to number', () => {
    const env = validateEnv({ ...VALID_ENV, PORT: '3001' });
    expect(env.PORT).toBe(3001);
  });

  it('rejects a missing JWT_SECRET', () => {
    expect(() => validateEnv({ DATABASE_URL: VALID_ENV.DATABASE_URL })).toThrow(
      /JWT_SECRET/,
    );
  });

  it('rejects a JWT_SECRET shorter than 32 chars (guessable = forgeable)', () => {
    expect(() =>
      validateEnv({ ...VALID_ENV, JWT_SECRET: 'short-secret' }),
    ).toThrow(/at least 32 characters/);
  });

  it('rejects a DATABASE_URL that is not a postgres:// connection string', () => {
    expect(() =>
      validateEnv({ ...VALID_ENV, DATABASE_URL: 'mysql://nope' }),
    ).toThrow(/DATABASE_URL/);
  });
});
