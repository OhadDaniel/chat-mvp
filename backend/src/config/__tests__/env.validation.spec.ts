import { validateEnv } from '../env.validation';

const VALID_ENV = {
  JWT_SECRET: 'a-secret-that-is-definitely-32-chars-long',
  MONGO_URI: 'mongodb://127.0.0.1:27017/chat_mvp?replicaSet=rs0',
  AWS_REGION: 'eu-north-1',
  AWS_ACCESS_KEY_ID: 'test',
  AWS_SECRET_ACCESS_KEY: 'test',
  AVATAR_BUCKET: 'test-avatars',
  AVATAR_PUBLIC_BASE_URL: 'https://test.cloudfront.net',
};

describe('validateEnv (fail-fast at boot)', () => {
  it('accepts a valid config and converts PORT from string to number', () => {
    const env = validateEnv({ ...VALID_ENV, PORT: '3001' });
    expect(env.PORT).toBe(3001);
  });

  it('rejects a missing JWT_SECRET', () => {
    expect(() => validateEnv({ MONGO_URI: VALID_ENV.MONGO_URI })).toThrow(
      /JWT_SECRET/,
    );
  });

  it('rejects a JWT_SECRET shorter than 32 chars (guessable = forgeable)', () => {
    expect(() =>
      validateEnv({ ...VALID_ENV, JWT_SECRET: 'short-secret' }),
    ).toThrow(/at least 32 characters/);
  });

  it('rejects a MONGO_URI that is not a mongodb:// connection string', () => {
    expect(() =>
      validateEnv({ ...VALID_ENV, MONGO_URI: 'postgres://nope' }),
    ).toThrow(/MONGO_URI/);
  });
});
