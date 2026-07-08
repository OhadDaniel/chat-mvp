import type { INestApplication } from '@nestjs/common';
import type { UserProfile } from '../../src/modules/users/users.types';
import { expectNoSecrets, http, loginAs } from '../helpers/api';
import { createTestApp } from '../helpers/test-app';

describe('Users (integration)', () => {
  let app: INestApplication;
  let ohad: string;

  beforeAll(async () => {
    app = await createTestApp();
    ohad = await loginAs(app, 'ohad@chat.dev');
  });

  afterAll(async () => {
    await app.close();
  });

  it('is behind the guard: 401 without a token', async () => {
    await http(app).get('/users').expect(401);
  });

  it('lists the other users as profiles — caller excluded, sorted, no secrets', async () => {
    const response = await http(app)
      .get('/users')
      .set('Authorization', `Bearer ${ohad}`)
      .expect(200);

    const { users } = response.body as { users: UserProfile[] };

    // ohad (the caller) is dropped; the rest are sorted by name (Alice, Ben, Clara)
    expect(users.map((u) => u.id)).toEqual(['user-2', 'user-3', 'user-4']);
    expect(users[0]).toMatchObject({ name: 'Alice Levi', avatarInitials: 'AL' });
    expect(users[0]).not.toHaveProperty('email');
    expectNoSecrets(response.body);
  });
});
