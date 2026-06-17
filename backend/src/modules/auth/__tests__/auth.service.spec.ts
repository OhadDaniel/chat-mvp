import type { JwtService } from '@nestjs/jwt';
import type { User } from '../../users/users.types';
import { AuthService } from '../auth.service';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: '$2b$04$fakehash',
  avatar: null,
};

describe('AuthService.issueToken', () => {
  it('signs a token with ONLY { sub } — JWTs are readable by anyone', async () => {
    const signAsync = jest.fn((payload: object) =>
      Promise.resolve(`token:${JSON.stringify(payload)}`),
    );
    const service = new AuthService({ signAsync } as unknown as JwtService);

    const token = await service.issueToken(ohad);

    expect(signAsync).toHaveBeenCalledWith({ sub: 'user-1' });
    expect(token).toBe('token:{"sub":"user-1"}');
  });
});
