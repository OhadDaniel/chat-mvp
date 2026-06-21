import type { INestApplication } from '@nestjs/common';
import type { PublicUser } from '../../src/modules/users/users.types';
import { expectNoSecrets, http, loginAs, signupAs } from '../helpers/api';
import { createTestApp } from '../helpers/test-app';

type MeBody = { user: PublicUser };

describe('Profile (integration)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
    // a brand-new user so edits here never collide with other suites' seeds
    token = await signupAs(app, 'profile@chat.dev', 'Pat Profile');
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => ['Authorization', `Bearer ${token}`] as const;

  it('every /me route is behind the guard: 401 without a token', async () => {
    await http(app).get('/me').expect(401);
    await http(app).patch('/me').send({ firstName: 'X' }).expect(401);
    await http(app)
      .post('/me/avatar/upload-url')
      .send({ contentType: 'image/png' })
      .expect(401);
    await http(app).put('/me/avatar').expect(401);
    await http(app).delete('/me/avatar').expect(401);
  });

  describe('GET /me — avatarUrl is on the contract, null until set', () => {
    it('200 returns the user with avatarUrl: null', async () => {
      const response = await http(app)
        .get('/me')
        .set(...auth())
        .expect(200);

      expect((response.body as MeBody).user.avatarUrl).toBeNull();
      expectNoSecrets(response.body);
    });
  });

  describe('PATCH /me — profile editing', () => {
    it('updates firstName / lastName and re-derives name', async () => {
      const response = await http(app)
        .patch('/me')
        .set(...auth())
        .send({ firstName: 'Patricia', lastName: 'Profile-Smith' })
        .expect(200);

      expect((response.body as MeBody).user).toMatchObject({
        firstName: 'Patricia',
        lastName: 'Profile-Smith',
        name: 'Patricia Profile-Smith',
        avatarUrl: null,
      });
      expectNoSecrets(response.body);
    });

    it('400 for an invalid email', async () => {
      await http(app)
        .patch('/me')
        .set(...auth())
        .send({ email: 'not-an-email' })
        .expect(400);
    });

    it('409 when changing to an email another user already owns', async () => {
      await loginAs(app, 'ohad@chat.dev'); // ensure the seeded user exists
      const response = await http(app)
        .patch('/me')
        .set(...auth())
        .send({ email: 'ohad@chat.dev' })
        .expect(409);

      expect(response.body).toMatchObject({
        error: { code: 'EMAIL_ALREADY_EXISTS' },
      });
    });
  });

  describe('POST /me/avatar/upload-url — presigned POST upload', () => {
    it('returns a presigned POST (url + fields); the key is server-side only', async () => {
      const response = await http(app)
        .post('/me/avatar/upload-url')
        .set(...auth())
        .send({ contentType: 'image/png' })
        .expect(201);

      const { url, fields } = response.body as {
        url: string;
        fields: Record<string, string>;
      };
      expect(url).toContain('https://');
      expect(fields).toBeTruthy();
      // the key is baked into the presigned fields, never returned to the client
      expect(response.body).not.toHaveProperty('key');
    });

    it('400 for an unsupported content-type', async () => {
      await http(app)
        .post('/me/avatar/upload-url')
        .set(...auth())
        .send({ contentType: 'image/gif' })
        .expect(400);
    });
  });

  describe('PUT /me/avatar — claiming the uploaded object (no body)', () => {
    it('sets the avatar from the user-derived key and exposes a non-null avatarUrl', async () => {
      const me = await http(app)
        .get('/me')
        .set(...auth())
        .expect(200);
      const userId = (me.body as MeBody).user.id;

      const set = await http(app)
        .put('/me/avatar')
        .set(...auth())
        .expect(200);

      // single URL authority: AVATAR_PUBLIC_BASE_URL + '/' + derived key (+ cache-busting ?v)
      const expectedPrefix = `https://test.cloudfront.net/avatars/${userId}/avatar?v=`;
      expect((set.body as MeBody).user.avatarUrl?.startsWith(expectedPrefix)).toBe(true);

      const after = await http(app)
        .get('/me')
        .set(...auth())
        .expect(200);
      expect((after.body as MeBody).user.avatarUrl?.startsWith(expectedPrefix)).toBe(true);
    });
  });
});
