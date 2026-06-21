import type { UsersService } from '../users/users.service';
import type { User } from '../users/users.types';
import type { AuthService } from '../auth/auth.service';
import { SignupOrchestrator } from './signup.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: '$2b$04$fakehash',
  avatar: null,
};

describe('SignupOrchestrator', () => {
  it('creates via UsersService (which owns 409) and logs the user in', async () => {
    const create = jest.fn(() => Promise.resolve(ohad));
    const issueToken = jest.fn(() => Promise.resolve('signed-token-for-user-1'));
    const orchestrator = new SignupOrchestrator(
      { create } as unknown as UsersService,
      { issueToken } as unknown as AuthService,
    );

    const dto = {
      email: 'ohad@chat.dev',
      password: 'Password123!',
      name: 'Ohad Daniel',
    };
    const result = await orchestrator.execute(dto);

    expect(create).toHaveBeenCalledWith(dto);
    expect(result.token).toBe('signed-token-for-user-1');
    expect(result.user).not.toHaveProperty('passwordHash');
  });
});
