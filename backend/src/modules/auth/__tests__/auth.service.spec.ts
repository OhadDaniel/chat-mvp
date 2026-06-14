import type { JwtService } from '@nestjs/jwt';
import { AppException } from '../../../common/errors/app.exception';
import type { UsersService } from '../../users/users.service';
import type { User } from '../../users/users.types';
import { AuthService } from '../auth.service';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  name: 'Ohad Daniel',
  avatarInitials: 'OD',
  passwordHash: '$2b$04$fakehash',
};

function fakeUsersService(overrides: Partial<UsersService>): UsersService {
  return {
    create: jest.fn(),
    findByEmail: jest.fn(() => Promise.resolve(undefined)),
    verifyPassword: jest.fn(() => Promise.resolve(false)),
    ...overrides,
  } as unknown as UsersService;
}

const fakeJwt = {
  signAsync: jest.fn((payload: { sub: string }) =>
    Promise.resolve(`signed-token-for-${payload.sub}`),
  ),
} as unknown as JwtService;

describe('AuthService.login', () => {
  it('returns the SAME 401 for unknown email and for wrong password (no user enumeration)', async () => {
    const unknownEmail = new AuthService(
      fakeUsersService({ findByEmail: () => Promise.resolve(undefined) }),
      fakeJwt,
    );
    const wrongPassword = new AuthService(
      fakeUsersService({
        findByEmail: () => Promise.resolve(ohad),
        verifyPassword: () => Promise.resolve(false),
      }),
      fakeJwt,
    );

    const failure1 = await unknownEmail
      .login({ email: 'ghost@chat.dev', password: 'x' })
      .catch((e: AppException) => e);
    const failure2 = await wrongPassword
      .login({ email: 'ohad@chat.dev', password: 'wrong' })
      .catch((e: AppException) => e);

    expect(failure1).toBeInstanceOf(AppException);
    expect(failure2).toBeInstanceOf(AppException);
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

  it('signs a token with ONLY { sub } and returns the public user', async () => {
    const signAsync = jest.fn((payload: object) =>
      Promise.resolve(`token:${JSON.stringify(payload)}`),
    );
    const service = new AuthService(
      fakeUsersService({
        findByEmail: () => Promise.resolve(ohad),
        verifyPassword: () => Promise.resolve(true),
      }),
      { signAsync } as unknown as JwtService,
    );

    const result = await service.login({
      email: 'ohad@chat.dev',
      password: 'right',
    });

    // minimal payload — JWTs are readable by anyone, so we put only the id
    expect(signAsync).toHaveBeenCalledWith({ sub: 'user-1' });
    // the hash never leaves the API
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.user.id).toBe('user-1');
  });
});

describe('AuthService.signup', () => {
  it('creates via UsersService (which owns 409) and logs the user in', async () => {
    const create = jest.fn(() => Promise.resolve(ohad));
    const service = new AuthService(fakeUsersService({ create }), fakeJwt);

    const dto = {
      email: 'ohad@chat.dev',
      password: 'Password123!',
      name: 'Ohad Daniel',
    };
    const result = await service.signup(dto);

    expect(create).toHaveBeenCalledWith(dto);
    expect(result.token).toBe('signed-token-for-user-1');
    expect(result.user).not.toHaveProperty('passwordHash');
  });
});
