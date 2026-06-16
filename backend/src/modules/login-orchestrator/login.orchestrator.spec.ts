import { AppException } from '../../common/errors/app.exception';
import type { StorageService } from '../storage/storage.service';
import type { UsersService } from '../users/users.service';
import type { User } from '../users/users.types';
import type { AuthService } from '../auth/auth.service';
import { LoginOrchestrator } from './login.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: '$2b$04$fakehash',
  avatarKey: null,
};

function fakeUsers(overrides: Partial<UsersService>): UsersService {
  return {
    findByEmail: jest.fn(() => Promise.resolve(undefined)),
    verifyPassword: jest.fn(() => Promise.resolve(false)),
    ...overrides,
  } as unknown as UsersService;
}

const fakeAuth = {
  issueToken: jest.fn(() => Promise.resolve('signed-token')),
} as unknown as AuthService;

const fakeStorage = {
  publicUrl: jest.fn((key: string | null) => key),
} as unknown as StorageService;

describe('LoginOrchestrator', () => {
  it('returns the SAME 401 for unknown email and for wrong password (no enumeration)', async () => {
    const unknownEmail = new LoginOrchestrator(
      fakeUsers({ findByEmail: () => Promise.resolve(undefined) }),
      fakeAuth,
      fakeStorage,
    );
    const wrongPassword = new LoginOrchestrator(
      fakeUsers({
        findByEmail: () => Promise.resolve(ohad),
        verifyPassword: () => Promise.resolve(false),
      }),
      fakeAuth,
      fakeStorage,
    );

    const failure1 = await unknownEmail
      .run({ email: 'ghost@chat.dev', password: 'x' })
      .catch((e: AppException) => e);
    const failure2 = await wrongPassword
      .run({ email: 'ohad@chat.dev', password: 'wrong' })
      .catch((e: AppException) => e);

    expect(failure1).toBeInstanceOf(AppException);
    expect({
      status: (failure1 as AppException).getStatus(),
      code: (failure1 as AppException).code,
      message: (failure1 as AppException).message,
    }).toEqual({
      status: (failure2 as AppException).getStatus(),
      code: (failure2 as AppException).code,
      message: (failure2 as AppException).message,
    });
    expect((failure1 as AppException).getStatus()).toBe(401);
  });

  it('issues a token and returns the public user (no hash) on valid credentials', async () => {
    const orchestrator = new LoginOrchestrator(
      fakeUsers({
        findByEmail: () => Promise.resolve(ohad),
        verifyPassword: () => Promise.resolve(true),
      }),
      fakeAuth,
      fakeStorage,
    );

    const result = await orchestrator.run({
      email: 'ohad@chat.dev',
      password: 'right',
    });

    expect(result.token).toBe('signed-token');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.user.id).toBe('user-1');
  });
});
