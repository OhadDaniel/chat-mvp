import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { expectNoSecrets, http, loginAs } from '../helpers/api';
import { createTestApp } from '../helpers/test-app';

describe('Auth (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('201 — returns a working token and a user without secrets', async () => {
      const signup = await http(app)
        .post('/auth/signup')
        .send({
          email: 'dana@chat.dev',
          password: 'S3cret!pass',
          name: 'Dana Cohen',
        })
        .expect(201);

      expectNoSecrets(signup.body);

      // the token is real: it opens a protected door
      const { token } = signup.body as { token: string };
      const me = await http(app)
        .get('/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(me.body).toMatchObject({
        user: { email: 'dana@chat.dev', name: 'Dana Cohen' },
      });
    });

    it('409 EMAIL_ALREADY_EXISTS on duplicate email', async () => {
      const response = await http(app)
        .post('/auth/signup')
        .send({
          email: 'dana@chat.dev',
          password: 'whatever123',
          name: 'Dana 2',
        })
        .expect(409);

      expect(response.body).toMatchObject({
        error: { code: 'EMAIL_ALREADY_EXISTS' },
      });
    });

    it('400 with field-level details for an invalid body', async () => {
      const response = await http(app)
        .post('/auth/signup')
        .send({ password: 'short', name: '' })
        .expect(400);

      const { error } = response.body as {
        error: { code: string; details: Record<string, string[]> };
      };
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(Object.keys(error.details)).toEqual(
        expect.arrayContaining(['email', 'password', 'name']),
      );
    });

    it('whitelist strips unknown fields — smuggled flags never enter the system', async () => {
      const response = await http(app)
        .post('/auth/signup')
        .send({
          email: 'mallory@chat.dev',
          password: 'S3cret!pass',
          name: 'Mallory',
          isAdmin: true, // not in the DTO -> silently dropped
        })
        .expect(201);

      expect(JSON.stringify(response.body)).not.toContain('isAdmin');
    });
  });

  describe('POST /auth/login', () => {
    it('200 with token for valid credentials (seeded user)', async () => {
      const response = await http(app)
        .post('/auth/login')
        .send({ email: 'ohad@chat.dev', password: 'Password123!' })
        .expect(200);

      expectNoSecrets(response.body);
      expect((response.body as { token: string }).token).toBeTruthy();
    });

    it('unknown email and wrong password produce BYTE-IDENTICAL 401 responses', async () => {
      const unknownEmail = await http(app)
        .post('/auth/login')
        .send({ email: 'ghost@chat.dev', password: 'whatever' })
        .expect(401);
      const wrongPassword = await http(app)
        .post('/auth/login')
        .send({ email: 'ohad@chat.dev', password: 'wrong-password' })
        .expect(401);

      // an attacker probing for registered emails learns nothing
      expect(unknownEmail.body).toEqual(wrongPassword.body);
    });
  });

  describe('GET /me — the checkpoint itself', () => {
    it('401 without a token', async () => {
      await http(app).get('/me').expect(401);
    });

    it('401 for a well-formed JWT signed with the WRONG secret (forgery)', async () => {
      const forged = new JwtService({
        secret: 'attacker-made-this-secret-aaaaaaaaaaaaaa',
      }).sign({ sub: 'user-2', email: 'alice@chat.dev' });

      await http(app)
        .get('/me')
        .set('Authorization', `Bearer ${forged}`)
        .expect(401);
    });

    it('401 for the week-3 S1 attack: a bare user id as the token', async () => {
      await http(app)
        .get('/me')
        .set('Authorization', 'Bearer user-2')
        .expect(401);
    });

    it('200 returns the authenticated user, derived from the token alone', async () => {
      const token = await loginAs(app, 'alice@chat.dev');

      const response = await http(app)
        .get('/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({ user: { id: 'user-2' } });
      expectNoSecrets(response.body);
    });
  });
});
