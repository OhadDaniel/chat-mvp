import type { ConversationsService } from '../conversations/conversations.service';
import type { UsersService } from '../users/users.service';
import type { StoredConversation } from '../conversations/conversations.types';
import { RemoveGroupAvatarOrchestrator } from './remove-group-avatar.orchestrator';

function storedGroupNoAvatar(): StoredConversation {
  return {
    id: 'conv-g',
    type: 'group',
    name: 'Crew',
    createdBy: 'user-1',
    avatar: null,
    participantIds: ['user-1'],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
}

describe('RemoveGroupAvatarOrchestrator', () => {
  it('clears the photo and returns the joined group with a null avatarUrl', async () => {
    const removeGroupAvatar = jest.fn(() =>
      Promise.resolve(storedGroupNoAvatar()),
    );
    const findByIds = jest.fn(() => Promise.resolve([]));
    const orchestrator = new RemoveGroupAvatarOrchestrator(
      { removeGroupAvatar } as unknown as ConversationsService,
      { findByIds } as unknown as UsersService,
    );

    const result = await orchestrator.execute('conv-g', 'user-1');

    expect(removeGroupAvatar).toHaveBeenCalledWith('conv-g', 'user-1');
    expect(result.conversation.type).toBe('group');
    if (result.conversation.type === 'group') {
      expect(result.conversation.avatarUrl).toBeNull();
    }
  });
});
