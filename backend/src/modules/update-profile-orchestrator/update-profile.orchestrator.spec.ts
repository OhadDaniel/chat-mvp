import { AppException } from '../../common/errors/app.exception';
import type { UsersService } from '../users/users.service';
import type { User } from '../users/users.types';
import { UpdateProfileOrchestrator } from './update-profile.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

describe('UpdateProfileOrchestrator', () => {
  it('updates the profile and returns a public user (no hash) with a derived avatarUrl', async () => {
    const updated: User = {
      ...ohad,
      firstName: 'Oh',
      avatar: {
        storageKey: 'avatars/user-1/a.png',
        srcUrl: 'https://cdn/avatars/user-1/a.png',
      },
    };
    const updateProfile = jest.fn(() => Promise.resolve(updated));
    const orchestrator = new UpdateProfileOrchestrator({
      updateProfile,
    } as unknown as UsersService);

    const result = await orchestrator.run('user-1', { firstName: 'Oh' });

    expect(updateProfile).toHaveBeenCalledWith('user-1', { firstName: 'Oh' });
    expect(result.user.avatarUrl).toBe('https://cdn/avatars/user-1/a.png');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('propagates the 409 when the email belongs to another user (owned by the service)', async () => {
    const updateProfile = jest.fn(() =>
      Promise.reject(new AppException(409, 'EMAIL_ALREADY_EXISTS', 'taken')),
    );
    const orchestrator = new UpdateProfileOrchestrator({
      updateProfile,
    } as unknown as UsersService);

    await expect(
      orchestrator.run('user-1', { email: 'taken@chat.dev' }),
    ).rejects.toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' });
  });
});
