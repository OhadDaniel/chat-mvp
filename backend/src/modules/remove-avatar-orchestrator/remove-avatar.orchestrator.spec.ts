import type { StorageService } from '../storage/storage.service';
import type { UsersService } from '../users/users.service';
import type { User } from '../users/users.types';
import { RemoveAvatarOrchestrator } from './remove-avatar.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatarKey: null,
};

describe('RemoveAvatarOrchestrator', () => {
  it('clears the key, deletes the stored object, and returns a null avatarUrl', async () => {
    const oldKey = 'avatars/user-1/old.png';
    const findById = jest.fn(() =>
      Promise.resolve({ ...ohad, avatarKey: oldKey }),
    );
    const setAvatarKey = jest.fn(() =>
      Promise.resolve({ ...ohad, avatarKey: null }),
    );
    const deleteObject = jest.fn(() => Promise.resolve());
    const orchestrator = new RemoveAvatarOrchestrator(
      { findById, setAvatarKey } as unknown as UsersService,
      { deleteObject } as unknown as StorageService,
    );

    const result = await orchestrator.run('user-1');

    expect(setAvatarKey).toHaveBeenCalledWith('user-1', null);
    expect(deleteObject).toHaveBeenCalledWith(oldKey);
    expect(result.user.avatarUrl).toBeNull();
  });

  it('is a no-op delete when the user had no avatar', async () => {
    const findById = jest.fn(() =>
      Promise.resolve({ ...ohad, avatarKey: null }),
    );
    const setAvatarKey = jest.fn(() =>
      Promise.resolve({ ...ohad, avatarKey: null }),
    );
    const deleteObject = jest.fn(() => Promise.resolve());
    const orchestrator = new RemoveAvatarOrchestrator(
      { findById, setAvatarKey } as unknown as UsersService,
      { deleteObject } as unknown as StorageService,
    );

    await orchestrator.run('user-1');

    expect(setAvatarKey).toHaveBeenCalledWith('user-1', null);
    expect(deleteObject).not.toHaveBeenCalled();
  });
});
