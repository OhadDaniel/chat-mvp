import type { ConversationsService } from '../conversations/conversations.service';
import type { UsersService } from '../users/users.service';
import type { StoredConversation } from '../conversations/conversations.types';
import { RenameGroupOrchestrator } from './rename-group.orchestrator';

function renamedGroup(): StoredConversation {
  return {
    id: 'conv-g',
    type: 'group',
    name: 'Renamed',
    createdBy: 'user-1',
    avatar: null,
    participantIds: ['user-1', 'user-2'],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
}

describe('RenameGroupOrchestrator', () => {
  it('delegates the rename (auth lives in the service) and returns the joined group', async () => {
    const renameGroup = jest.fn(() => Promise.resolve(renamedGroup()));
    const findByIds = jest.fn(() => Promise.resolve([]));
    const orchestrator = new RenameGroupOrchestrator(
      { renameGroup } as unknown as ConversationsService,
      { findByIds } as unknown as UsersService,
    );

    const result = await orchestrator.execute('conv-g', 'user-1', {
      name: 'Renamed',
    });

    expect(renameGroup).toHaveBeenCalledWith('conv-g', 'user-1', 'Renamed');
    expect(result.conversation.type).toBe('group');
    if (result.conversation.type === 'group') {
      expect(result.conversation.name).toBe('Renamed');
    }
  });
});
