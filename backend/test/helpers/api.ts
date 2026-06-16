import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';

/** Seeded demo users (see src/modules/mongo/seed-data.ts). */
export const SEED_PASSWORD = 'Password123!';

export function http(app: INestApplication): ReturnType<typeof request> {
  return request(app.getHttpServer() as App);
}

/** Log a seeded (or signed-up) user in and return their token. */
export async function loginAs(
  app: INestApplication,
  email: string,
  password: string = SEED_PASSWORD,
): Promise<string> {
  const response = await http(app)
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return (response.body as { token: string }).token;
}

/** Sign a brand-new user up and return their token. */
export async function signupAs(
  app: INestApplication,
  email: string,
  name: string,
  password: string = SEED_PASSWORD,
): Promise<string> {
  const response = await http(app)
    .post('/auth/signup')
    .send({ email, password, name })
    .expect(201);

  return (response.body as { token: string }).token;
}

/**
 * The security sweep: no API response may ever contain a password
 * hash, under any spelling. Used on every body the suites receive.
 */
export function expectNoSecrets(body: unknown): void {
  const raw = JSON.stringify(body);
  expect(raw).not.toContain('passwordHash');
  expect(raw).not.toContain('password_hash');
  expect(raw).not.toContain('$2b$'); // bcrypt hashes themselves
}
