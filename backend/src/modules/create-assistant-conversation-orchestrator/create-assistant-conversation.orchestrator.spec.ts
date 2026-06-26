import type { ConversationsService } from '../conversations/conversations.service';
import type { StoredConversation } from '../conversations/conversations.types';
import type { User } from '../users/users.types';
import { CreateAssistantConversationOrchestrator } from './create-assistant-conversation.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

function storedAssistant(): StoredConversation {
  return {
    id: 'conv-ai',
    type: 'assistant',
    participantIds: ['user-1'],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
}

describe('CreateAssistantConversationOrchestrator', () => {
  it('gets or creates the caller assistant thread and maps it to the response', async () => {
    const createAssistant = jest.fn(() => Promise.resolve(storedAssistant()));
    const orchestrator = new CreateAssistantConversationOrchestrator({
      createAssistant,
    } as unknown as ConversationsService);

    const result = await orchestrator.execute(ohad);

    expect(createAssistant).toHaveBeenCalledWith('user-1');
    expect(result.conversation).toMatchObject({
      id: 'conv-ai',
      type: 'assistant',
      participants: [{ id: 'user-1', name: 'Ohad Daniel', avatarInitials: 'OD' }],
    });
  });
});
