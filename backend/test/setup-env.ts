/**
 * Runs before any test module is imported (jest setupFiles), so these
 * count as "predefined" env for @nestjs/config validation.
 * The real per-suite DATABASE_URL is injected later by overriding the
 * PG_POOL provider — this one only has to pass validation.
 */
process.env.JWT_SECRET = 'test-secret-0123456789abcdef0123456789abcdef';
process.env.JWT_EXPIRES_IN = '1h';
process.env.BCRYPT_SALT_ROUNDS = '4'; // same algorithm, faster tests
process.env.DATABASE_URL = `postgres://placeholder@127.0.0.1:${
  process.env.TEST_PG_PORT ?? '5439'
}/postgres`;
