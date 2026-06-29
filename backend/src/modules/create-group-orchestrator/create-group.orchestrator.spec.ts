import type { ConversationsService } from '../conversations/conversations.service';
import type { UsersService } from '../users/users.service';
import type { StoredConversation } from '../conversations/conversations.types';
import type { User } from '../users/users.types';
import { CreateGroupOrchestrator } from './create-group.orchestrator';

const ohad: User = { id: 'user-1', email: 'ohad@chat.dev', firstName: 'Ohad', lastName: 'Daniel', passwordHash: 'h', avatar: null };
const alice: User = { id: 'user-2', email: 'alice@chat.dev', firstName: 'Alice', lastName: 'Levi', passwordHash: 'h', avatar: null };

function storedGroup(): StoredConversation {
  return {
    id: 'conv-g',
    type: 'group',
    name: 'Crew',
    createdBy: 'user-1',
    avatar: null,
    participantIds: ['user-1', 'user-2'],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
}

describe('CreateGroupOrchestrator', () => {
  it('rejects with 404 when a picked participant does not exist — before creating', async () => {
    const findByIds = jest.fn(() => Promise.resolve([alice])); // only 1 of the 2 ids resolved
    const createGroup = jest.fn();
    const orchestrator = new CreateGroupOrchestrator(
      { findByIds } as unknown as UsersService,
      { createGroup } as unknown as ConversationsService,
    );

    await expect(
      orchestrator.execute(ohad, 'Crew', ['user-2', 'ghost']),
    ).rejects.toMatchObject({ code: 'USER_NOT_FOUND' });

    expect(createGroup).not.toHaveBeenCalled();
  });

  it('creates the group and returns it with members joined to current profiles', async () => {
    const findByIds = jest.fn(() => Promise.resolve([alice]));
    const createGroup = jest.fn(() => Promise.resolve(storedGroup()));
    const orchestrator = new CreateGroupOrchestrator(
      { findByIds } as unknown as UsersService,
      { createGroup } as unknown as ConversationsService,
    );

    const result = await orchestrator.execute(ohad, 'Crew', ['user-2']);

    expect(createGroup).toHaveBeenCalledWith('user-1', 'Crew', ['user-2']);
    expect(result.conversation.type).toBe('group');
    expect(result.conversation.participants.map((p) => p.id)).toEqual([
      'user-1',
      'user-2',
    ]);
  });
});
