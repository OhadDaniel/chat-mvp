import { CreateTutorConversationOrchestrator } from './create-tutor-conversation.orchestrator';
import type { ConversationsService } from '../conversations/conversations.service';
import type { StoredConversation } from '../conversations/conversations.types';
import type { User } from '../users/users.types';

const USER: User = {
  id: 'user-1',
  email: 'ohad@example.com',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

const STORED_TUTOR: StoredConversation = {
  id: 'tutor-1',
  type: 'tutor',
  participantIds: ['user-1'],
  name: 'Biology Tutor',
  avatar: null,
  lastMessage: null,
  lastMessageAt: null,
  pinnedAt: null,
};

describe('CreateTutorConversationOrchestrator', () => {
  it('creates a tutor and maps it to the conversation response', async () => {
    const conversationsService = {
      createTutor: jest.fn().mockResolvedValue(STORED_TUTOR),
    } as unknown as ConversationsService;
    const orchestrator = new CreateTutorConversationOrchestrator(
      conversationsService,
    );

    const result = await orchestrator.execute(USER, 'Biology Tutor');

    expect(conversationsService.createTutor).toHaveBeenCalledWith(
      'user-1',
      'Biology Tutor',
    );
    expect(result.conversation).toMatchObject({
      id: 'tutor-1',
      type: 'tutor',
      name: 'Biology Tutor',
      avatarUrl: null,
    });
  });
});
