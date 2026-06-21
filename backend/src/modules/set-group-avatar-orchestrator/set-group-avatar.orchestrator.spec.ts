import type { ConversationsService } from '../conversations/conversations.service';
import type { UsersService } from '../users/users.service';
import type { StorageService } from '../storage/storage.service';
import type { StoredConversation } from '../conversations/conversations.types';
import { SetGroupAvatarOrchestrator } from './set-group-avatar.orchestrator';

function storedGroup(): StoredConversation {
  return {
    id: 'conv-g',
    type: 'group',
    name: 'Crew',
    createdBy: 'user-1',
    avatar: { storageKey: 'groups/conv-g/avatar', srcUrl: 'https://cdn/g?v=1' },
    participantIds: ['user-1'],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
}

describe('SetGroupAvatarOrchestrator', () => {
  it('derives the key, stores {storageKey, srcUrl}, and returns the joined group', async () => {
    const srcUrl = 'https://cdn/groups/conv-g/avatar?v=abc';
    const setGroupAvatar = jest.fn(() => Promise.resolve(storedGroup()));
    const findByIds = jest.fn(() => Promise.resolve([]));
    const srcUrlFor = jest.fn(() => srcUrl);
    const orchestrator = new SetGroupAvatarOrchestrator(
      { setGroupAvatar } as unknown as ConversationsService,
      { findByIds } as unknown as UsersService,
      { srcUrlFor } as unknown as StorageService,
    );

    const result = await orchestrator.execute('conv-g', 'user-1');

    expect(srcUrlFor).toHaveBeenCalledWith('groups/conv-g/avatar');
    expect(setGroupAvatar).toHaveBeenCalledWith('conv-g', 'user-1', {
      storageKey: 'groups/conv-g/avatar',
      srcUrl,
    });
    expect(result.conversation.type).toBe('group');
  });
});
