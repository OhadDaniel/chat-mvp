import { AppException } from '../../common/errors/app.exception';
import type { StorageService } from '../storage/storage.service';
import type { UsersService } from '../users/users.service';
import type { User } from '../users/users.types';
import { SetAvatarOrchestrator } from './set-avatar.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatarKey: null,
};

describe('SetAvatarOrchestrator', () => {
  it('rejects a key that is not under the user prefix (400) and writes nothing', async () => {
    const setAvatarKey = jest.fn();
    const findById = jest.fn();
    const deleteObject = jest.fn();
    const orchestrator = new SetAvatarOrchestrator(
      { findById, setAvatarKey } as unknown as UsersService,
      { deleteObject } as unknown as StorageService,
    );

    await expect(
      orchestrator.run('user-1', 'avatars/user-2/stolen.png'),
    ).rejects.toMatchObject({ code: 'INVALID_AVATAR_KEY' });
    await expect(
      orchestrator.run('user-1', 'avatars/user-2/stolen.png'),
    ).rejects.toBeInstanceOf(AppException);

    expect(setAvatarKey).not.toHaveBeenCalled();
    expect(findById).not.toHaveBeenCalled();
    expect(deleteObject).not.toHaveBeenCalled();
  });

  it('sets the new key and deletes the previous object', async () => {
    const oldKey = 'avatars/user-1/old.png';
    const newKey = 'avatars/user-1/new.png';
    const findById = jest.fn(() =>
      Promise.resolve({ ...ohad, avatarKey: oldKey }),
    );
    const setAvatarKey = jest.fn(() =>
      Promise.resolve({ ...ohad, avatarKey: newKey }),
    );
    const deleteObject = jest.fn(() => Promise.resolve());
    const publicUrl = jest.fn(() => 'https://cdn/avatars/user-1/new.png');
    const orchestrator = new SetAvatarOrchestrator(
      { findById, setAvatarKey } as unknown as UsersService,
      { deleteObject, publicUrl } as unknown as StorageService,
    );

    const result = await orchestrator.run('user-1', newKey);

    expect(setAvatarKey).toHaveBeenCalledWith('user-1', newKey);
    expect(deleteObject).toHaveBeenCalledWith(oldKey);
    expect(result.user.avatarUrl).toBe('https://cdn/avatars/user-1/new.png');
  });

  it('does not delete anything when there was no previous avatar', async () => {
    const newKey = 'avatars/user-1/first.png';
    const findById = jest.fn(() =>
      Promise.resolve({ ...ohad, avatarKey: null }),
    );
    const setAvatarKey = jest.fn(() =>
      Promise.resolve({ ...ohad, avatarKey: newKey }),
    );
    const deleteObject = jest.fn(() => Promise.resolve());
    const orchestrator = new SetAvatarOrchestrator(
      { findById, setAvatarKey } as unknown as UsersService,
      {
        deleteObject,
        publicUrl: jest.fn(() => null),
      } as unknown as StorageService,
    );

    await orchestrator.run('user-1', newKey);

    expect(deleteObject).not.toHaveBeenCalled();
  });
});
