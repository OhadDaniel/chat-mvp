import { AppException } from '../../common/errors/app.exception';
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

function avatar(storageKey: string, srcUrl: string): Avatar {
  return { storageKey, srcUrl };
}

describe('SetAvatarOrchestrator', () => {
  it('rejects a key that is not under the user prefix (400) and writes nothing', async () => {
    const setAvatar = jest.fn();
    const findById = jest.fn();
    const deleteObject = jest.fn();
    const orchestrator = new SetAvatarOrchestrator(
      { findById, setAvatar } as unknown as UsersService,
      { deleteObject } as unknown as StorageService,
    );

    await expect(
      orchestrator.run('user-1', 'avatars/user-2/stolen.png'),
    ).rejects.toMatchObject({ code: 'INVALID_AVATAR_KEY' });
    await expect(
      orchestrator.run('user-1', 'avatars/user-2/stolen.png'),
    ).rejects.toBeInstanceOf(AppException);

    expect(setAvatar).not.toHaveBeenCalled();
    expect(findById).not.toHaveBeenCalled();
    expect(deleteObject).not.toHaveBeenCalled();
  });

  it('resolves the URL once, stores the avatar, and deletes the old object', async () => {
    const oldKey = 'avatars/user-1/old.png';
    const newKey = 'avatars/user-1/new.png';
    const newSrcUrl = 'https://cdn/avatars/user-1/new.png';
    const findById = jest.fn(() =>
      Promise.resolve({ ...ohad, avatar: avatar(oldKey, 'https://cdn/old') }),
    );
    const setAvatar = jest.fn(() =>
      Promise.resolve({ ...ohad, avatar: avatar(newKey, newSrcUrl) }),
    );
    const deleteObject = jest.fn(() => Promise.resolve());
    const srcUrlFor = jest.fn(() => newSrcUrl);
    const orchestrator = new SetAvatarOrchestrator(
      { findById, setAvatar } as unknown as UsersService,
      { deleteObject, srcUrlFor } as unknown as StorageService,
    );

    const result = await orchestrator.run('user-1', newKey);

    expect(setAvatar).toHaveBeenCalledWith('user-1', {
      storageKey: newKey,
      srcUrl: newSrcUrl,
    });
    expect(deleteObject).toHaveBeenCalledWith(oldKey);
    expect(result.user.avatarUrl).toBe(newSrcUrl);
  });

  it('does not delete anything when there was no previous avatar', async () => {
    const newKey = 'avatars/user-1/first.png';
    const findById = jest.fn(() => Promise.resolve({ ...ohad, avatar: null }));
    const setAvatar = jest.fn(() =>
      Promise.resolve({ ...ohad, avatar: avatar(newKey, 'https://cdn/new') }),
    );
    const deleteObject = jest.fn(() => Promise.resolve());
    const orchestrator = new SetAvatarOrchestrator(
      { findById, setAvatar } as unknown as UsersService,
      {
        deleteObject,
        srcUrlFor: jest.fn(() => 'https://cdn/new'),
      } as unknown as StorageService,
    );

    await orchestrator.run('user-1', newKey);

    expect(deleteObject).not.toHaveBeenCalled();
  });
});
