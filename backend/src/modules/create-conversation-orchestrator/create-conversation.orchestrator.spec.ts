import type { UsersService } from '../users/users.service';
import type { User } from '../users/users.types';
import type { ConversationsService } from '../conversations/conversations.service';
import { CreateConversationOrchestrator } from './create-conversation.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

function fakeUsers(findById: (id: string) => User | undefined): UsersService {
  return {
    findById: (id: string) => Promise.resolve(findById(id)),
  } as unknown as UsersService;
}

describe('CreateConversationOrchestrator', () => {
  it('rejects an unknown participant (404) before touching conversations', async () => {
    const create = jest.fn();
    const orchestrator = new CreateConversationOrchestrator(
      fakeUsers(() => undefined),
      { create } as unknown as ConversationsService,
    );

    await expect(
      orchestrator.execute(ohad, { participantId: 'ghost-99' }),
    ).rejects.toMatchObject({ code: 'USER_NOT_FOUND' });

    expect(create).not.toHaveBeenCalled();
  });

  it('delegates to ConversationsService.create with both ids, then assembles', async () => {
    const create = jest.fn(() =>
      Promise.resolve({
        id: 'conv-x',
        type: 'direct',
        participantIds: ['user-1', 'user-2'],
        lastMessage: null,
        lastMessageAt: null,
        pinnedAt: null,
      }),
    );
    const orchestrator = new CreateConversationOrchestrator(
      fakeUsers((id) => ({ ...ohad, id })),
      { create } as unknown as ConversationsService,
    );

    const result = await orchestrator.execute(ohad, { participantId: 'user-2' });

    expect(create).toHaveBeenCalledWith('user-1', 'user-2');
    expect(result.conversation.participants.map((p) => p.id)).toEqual([
      'user-1',
      'user-2',
    ]);
  });
});
