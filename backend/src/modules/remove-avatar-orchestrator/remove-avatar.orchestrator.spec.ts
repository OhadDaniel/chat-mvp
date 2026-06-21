import type { StorageService } from '../storage/storage.service';
import type { UsersService } from '../users/users.service';
import type { Avatar, User } from '../users/users.types';
import { RemoveAvatarOrchestrator } from './remove-avatar.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

describe('RemoveAvatarOrchestrator', () => {
  it('clears the avatar, deletes the stored object, returns a null avatarUrl', async () => {
    const oldKey = 'avatars/user-1/old.png';
    const stored: Avatar = { storageKey: oldKey, srcUrl: 'https://cdn/old' };
    const findById = jest.fn(() => Promise.resolve({ ...ohad, avatar: stored }));
    const setAvatar = jest.fn(() => Promise.resolve({ ...ohad, avatar: null }));
    const deleteObject = jest.fn(() => Promise.resolve());
    const orchestrator = new RemoveAvatarOrchestrator(
      { findById, setAvatar } as unknown as UsersService,
      { deleteObject } as unknown as StorageService,
    );

    const result = await orchestrator.execute('user-1');

    expect(setAvatar).toHaveBeenCalledWith('user-1', null);
    expect(deleteObject).toHaveBeenCalledWith(oldKey);
    expect(result.user.avatarUrl).toBeNull();
  });

  it('is a no-op delete when the user had no avatar', async () => {
    const findById = jest.fn(() => Promise.resolve({ ...ohad, avatar: null }));
    const setAvatar = jest.fn(() => Promise.resolve({ ...ohad, avatar: null }));
    const deleteObject = jest.fn(() => Promise.resolve());
    const orchestrator = new RemoveAvatarOrchestrator(
      { findById, setAvatar } as unknown as UsersService,
      { deleteObject } as unknown as StorageService,
    );

    await orchestrator.execute('user-1');

    expect(setAvatar).toHaveBeenCalledWith('user-1', null);
    expect(deleteObject).not.toHaveBeenCalled();
  });
});
