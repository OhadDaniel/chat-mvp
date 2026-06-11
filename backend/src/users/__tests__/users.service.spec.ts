import type { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AppException } from '../../common/errors/app.exception';
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

  it('derives avatar initials from the trimmed name', async () => {
    const user = await service.create({
      email: 'dana@chat.dev',
      name: '  dana cohen  ',
      password: 'S3cret!pass',
    });

    expect(user.name).toBe('dana cohen');
    expect(user.avatarInitials).toBe('DC');
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
});
