import type { StorageService } from '../storage/storage.service';
import type { UsersService } from '../users/users.service';
import type { ConversationsService } from '../conversations/conversations.service';
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

const noopConversations = {
  applyParticipantUpdate: jest.fn(() => Promise.resolve()),
} as unknown as ConversationsService;

describe('RemoveAvatarOrchestrator', () => {
  it('clears the avatar, deletes the stored object, propagates, returns a null avatarUrl', async () => {
    const oldKey = 'avatars/user-1/old.png';
    const stored: Avatar = { storageKey: oldKey, srcUrl: 'https://cdn/old' };
    const findById = jest.fn(() => Promise.resolve({ ...ohad, avatar: stored }));
    const setAvatar = jest.fn(() => Promise.resolve({ ...ohad, avatar: null }));
    const deleteObject = jest.fn(() => Promise.resolve());
    const applyParticipantUpdate = jest.fn(() => Promise.resolve());
    const orchestrator = new RemoveAvatarOrchestrator(
      { findById, setAvatar } as unknown as UsersService,
      { deleteObject } as unknown as StorageService,
      { applyParticipantUpdate } as unknown as ConversationsService,
    );

    const result = await orchestrator.run('user-1');

    expect(setAvatar).toHaveBeenCalledWith('user-1', null);
    expect(deleteObject).toHaveBeenCalledWith(oldKey);
    expect(applyParticipantUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'user-1', avatarUrl: null }),
    );
    expect(result.user.avatarUrl).toBeNull();
  });

  it('is a no-op delete when the user had no avatar', async () => {
    const findById = jest.fn(() => Promise.resolve({ ...ohad, avatar: null }));
    const setAvatar = jest.fn(() => Promise.resolve({ ...ohad, avatar: null }));
    const deleteObject = jest.fn(() => Promise.resolve());
    const orchestrator = new RemoveAvatarOrchestrator(
      { findById, setAvatar } as unknown as UsersService,
      { deleteObject } as unknown as StorageService,
      noopConversations,
    );

    await orchestrator.run('user-1');

    expect(setAvatar).toHaveBeenCalledWith('user-1', null);
    expect(deleteObject).not.toHaveBeenCalled();
  });
});
