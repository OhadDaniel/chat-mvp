/**
 * Runs before any test module is imported (jest setupFiles), so these
 * count as "predefined" env for @nestjs/config validation.
 * MONGO_URI is supplied by test/global-setup.js (in-memory replica set).
 */
process.env.JWT_SECRET = 'test-secret-0123456789abcdef0123456789abcdef';
process.env.JWT_EXPIRES_IN = '1h';
process.env.BCRYPT_SALT_ROUNDS = '4'; // same algorithm, faster tests
// Dummy AWS values so env validation passes; tests never call S3.
process.env.AWS_REGION = 'eu-north-1';
process.env.AWS_ACCESS_KEY_ID = 'test';
process.env.AWS_SECRET_ACCESS_KEY = 'test';
process.env.AVATAR_BUCKET = 'test-avatars';
process.env.AVATAR_PUBLIC_BASE_URL = 'https://test.cloudfront.net';
