import type { UsersService } from '../../../users/users.service';
import type { User } from '../../../users/users.types';
import type { ConversationsService } from '../../conversations.service';
import { CreateConversationOrchestrator } from './create-conversation.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  name: 'Ohad Daniel',
  avatarInitials: 'OD',
  passwordHash: 'hash',
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
      orchestrator.run(ohad, { participantId: 'ghost-99' }),
    ).rejects.toMatchObject({ code: 'USER_NOT_FOUND' });

    expect(create).not.toHaveBeenCalled();
  });

  it('delegates to ConversationsService.create with the two ids once the participant exists', async () => {
    const create = jest.fn(() =>
      Promise.resolve({ conversation: { id: 'conv-x' } }),
    );
    const orchestrator = new CreateConversationOrchestrator(
      fakeUsers((id) => ({ ...ohad, id })),
      { create } as unknown as ConversationsService,
    );

    await orchestrator.run(ohad, { participantId: 'user-2' });

    expect(create).toHaveBeenCalledWith('user-1', 'user-2');
  });
});
