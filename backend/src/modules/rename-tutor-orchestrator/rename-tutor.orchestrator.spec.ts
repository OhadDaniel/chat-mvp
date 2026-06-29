import { RenameTutorOrchestrator } from './rename-tutor.orchestrator';
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

const RENAMED_TUTOR: StoredConversation = {
  id: 'tutor-1',
  type: 'tutor',
  participantIds: ['user-1'],
  name: 'Chemistry Tutor',
  avatar: null,
  lastMessage: null,
  lastMessageAt: null,
  pinnedAt: null,
};

describe('RenameTutorOrchestrator', () => {
  it('renames the tutor and returns the updated conversation', async () => {
    const conversationsService = {
      renameTutor: jest.fn().mockResolvedValue(RENAMED_TUTOR),
    } as unknown as ConversationsService;
    const orchestrator = new RenameTutorOrchestrator(conversationsService);

    const result = await orchestrator.execute('tutor-1', USER, {
      name: 'Chemistry Tutor',
    });

    expect(conversationsService.renameTutor).toHaveBeenCalledWith(
      'tutor-1',
      'user-1',
      'Chemistry Tutor',
    );
    expect(result.conversation).toMatchObject({
      id: 'tutor-1',
      type: 'tutor',
      name: 'Chemistry Tutor',
    });
  });
});
