import { SetTutorAvatarOrchestrator } from './set-tutor-avatar.orchestrator';
import type { ConversationsService } from '../conversations/conversations.service';
import type { StorageService } from '../storage/storage.service';
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

const TUTOR_WITH_AVATAR: StoredConversation = {
  id: 'tutor-1',
  type: 'tutor',
  participantIds: ['user-1'],
  name: 'Biology Tutor',
  avatar: {
    storageKey: 'tutors/tutor-1/avatar',
    srcUrl: 'https://cdn/tutors/tutor-1/avatar?v=1',
  },
  lastMessage: null,
  lastMessageAt: null,
  pinnedAt: null,
};

describe('SetTutorAvatarOrchestrator', () => {
  it('builds the avatar from the storage key and saves it', async () => {
    const conversationsService = {
      setTutorAvatar: jest.fn().mockResolvedValue(TUTOR_WITH_AVATAR),
    } as unknown as ConversationsService;
    const storage = {
      srcUrlFor: jest
        .fn()
        .mockReturnValue('https://cdn/tutors/tutor-1/avatar?v=1'),
    } as unknown as StorageService;
    const orchestrator = new SetTutorAvatarOrchestrator(
      conversationsService,
      storage,
    );

    const result = await orchestrator.execute('tutor-1', USER);

    expect(conversationsService.setTutorAvatar).toHaveBeenCalledWith(
      'tutor-1',
      'user-1',
      {
        storageKey: 'tutors/tutor-1/avatar',
        srcUrl: 'https://cdn/tutors/tutor-1/avatar?v=1',
      },
    );
    expect(result.conversation).toMatchObject({
      id: 'tutor-1',
      type: 'tutor',
      avatarUrl: 'https://cdn/tutors/tutor-1/avatar?v=1',
    });
  });
});
