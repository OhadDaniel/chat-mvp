import type { StorageService } from '../storage/storage.service';
import type { UsersService } from '../users/users.service';
import type { Avatar, User } from '../users/users.types';
import { SetAvatarOrchestrator } from './set-avatar.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

describe('SetAvatarOrchestrator', () => {
  it('points the profile at the user-derived key and returns the resolved url', async () => {
    const srcUrl = 'https://cdn/avatars/user-1/avatar?v=abc';
    const setAvatar = jest.fn((_id: string, avatar: Avatar) =>
      Promise.resolve({ ...ohad, avatar }),
    );
    const srcUrlFor = jest.fn(() => srcUrl);
    const orchestrator = new SetAvatarOrchestrator(
      { setAvatar } as unknown as UsersService,
      { srcUrlFor } as unknown as StorageService,
    );

    const result = await orchestrator.execute('user-1');

    // key is derived from the user, never taken from the client
    expect(srcUrlFor).toHaveBeenCalledWith('avatars/user-1/avatar');
    expect(setAvatar).toHaveBeenCalledWith('user-1', {
      storageKey: 'avatars/user-1/avatar',
      srcUrl,
    });
    expect(result.user.avatarUrl).toBe(srcUrl);
  });
});
