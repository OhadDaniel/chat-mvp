import type { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AppException } from '../../../common/errors/app.exception';
import type { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import type { User } from '../users.types';

/**
 * In-memory stand-in for the SQL repository — same four methods,
 * backed by an array. Handed to the service via its constructor:
 * that is the whole point of dependency injection.
 */
function fakeRepository(): UsersRepository {
  const users: User[] = [];
  return {
    findById: (id: string) => Promise.resolve(users.find((u) => u.id === id)),
    findByEmail: (email: string) =>
      Promise.resolve(users.find((u) => u.email === email)),
    insert: (user: User) => {
      users.push(user);
      return Promise.resolve(user);
    },
    update: (id: string, fields: Partial<User>) => {
      const user = users.find((u) => u.id === id);
      if (!user) {
        return Promise.resolve(undefined);
      }
      Object.assign(user, fields);
      return Promise.resolve(user);
    },
    count: () => Promise.resolve(users.length),
  } as unknown as UsersRepository;
}

/** salt rounds 4: same algorithm, fast enough for unit tests */
const fakeConfig = { get: () => 4 } as unknown as ConfigService;

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService(fakeRepository(), fakeConfig);
  });

  it('stores a bcrypt hash, never the plaintext password', async () => {
    const user = await service.create({
      email: 'dana@chat.dev',
      name: 'Dana Cohen',
      password: 'S3cret!pass',
    });

    expect(user.passwordHash).not.toContain('S3cret!pass');
    expect(user.passwordHash).toMatch(/^\$2[aby]\$/); // bcrypt format
    await expect(
      bcrypt.compare('S3cret!pass', user.passwordHash),
    ).resolves.toBe(true);
  });

  it('normalizes email (trim + lowercase) on create and on lookup', async () => {
    await service.create({
      email: '  DANA@Chat.DEV ',
      name: 'Dana',
      password: 'S3cret!pass',
    });

    const found = await service.findByEmail('dana@CHAT.dev');
    expect(found?.email).toBe('dana@chat.dev');
  });

  it('rejects a duplicate email with 409 EMAIL_ALREADY_EXISTS', async () => {
    await service.create({
      email: 'dana@chat.dev',
      name: 'Dana',
      password: 'S3cret!pass',
    });

    const attempt = service.create({
      email: 'DANA@chat.dev', // different casing — same identity
      name: 'Imposter',
      password: 'whatever123',
    });

    await expect(attempt).rejects.toMatchObject({
      code: 'EMAIL_ALREADY_EXISTS',
    });
    await expect(attempt).rejects.toBeInstanceOf(AppException);
  });

  it('splits the trimmed name into firstName / lastName', async () => {
    const user = await service.create({
      email: 'dana@chat.dev',
      name: '  dana cohen  ',
      password: 'S3cret!pass',
    });

    expect(user.firstName).toBe('dana');
    expect(user.lastName).toBe('cohen');
  });

  it('verifyPassword accepts the right password and rejects a wrong one', async () => {
    const user = await service.create({
      email: 'dana@chat.dev',
      name: 'Dana',
      password: 'S3cret!pass',
    });

    await expect(service.verifyPassword(user, 'S3cret!pass')).resolves.toBe(
      true,
    );
    await expect(service.verifyPassword(user, 'S3cret!pasS')).resolves.toBe(
      false,
    );
  });

  describe('updateProfile', () => {
    it('only writes the provided fields and normalizes a new email', async () => {
      const user = await service.create({
        email: 'dana@chat.dev',
        name: 'Dana Cohen',
        password: 'S3cret!pass',
      });

      const updated = await service.updateProfile(user.id, {
        firstName: 'Daniela',
        email: '  DANA2@Chat.DEV ',
      });

      expect(updated.firstName).toBe('Daniela');
      expect(updated.lastName).toBe('Cohen'); // untouched
      expect(updated.email).toBe('dana2@chat.dev'); // normalized
    });

    it('keeps the same email (no false 409) when the owner re-submits their own', async () => {
      const user = await service.create({
        email: 'dana@chat.dev',
        name: 'Dana',
        password: 'S3cret!pass',
      });

      await expect(
        service.updateProfile(user.id, { email: 'DANA@chat.dev' }),
      ).resolves.toMatchObject({ email: 'dana@chat.dev' });
    });

    it('rejects with 409 when the email already belongs to another user', async () => {
      await service.create({
        email: 'taken@chat.dev',
        name: 'Taken',
        password: 'S3cret!pass',
      });
      const me = await service.create({
        email: 'me@chat.dev',
        name: 'Me',
        password: 'S3cret!pass',
      });

      const attempt = service.updateProfile(me.id, {
        email: 'TAKEN@chat.dev',
      });

      await expect(attempt).rejects.toMatchObject({
        code: 'EMAIL_ALREADY_EXISTS',
      });
      await expect(attempt).rejects.toBeInstanceOf(AppException);
    });
  });

  describe('setAvatar', () => {
    it('sets and clears the stored avatar', async () => {
      const user = await service.create({
        email: 'dana@chat.dev',
        name: 'Dana',
        password: 'S3cret!pass',
      });

      const avatar = {
        storageKey: 'avatars/x/a.png',
        srcUrl: 'https://cdn/avatars/x/a.png',
      };
      const set = await service.setAvatar(user.id, avatar);
      expect(set.avatar).toEqual(avatar);

      const cleared = await service.setAvatar(user.id, null);
      expect(cleared.avatar).toBeNull();
    });
  });

  describe('when the user no longer exists', () => {
    it('updateProfile and setAvatar surface a clean 404 USER_NOT_FOUND', async () => {
      await expect(
        service.updateProfile('ghost', { firstName: 'X' }),
      ).rejects.toMatchObject({ code: 'USER_NOT_FOUND' });
      await expect(service.setAvatar('ghost', null)).rejects.toMatchObject({
        code: 'USER_NOT_FOUND',
      });
      await expect(service.setAvatar('ghost', null)).rejects.toBeInstanceOf(
        AppException,
      );
    });
  });
});
