import { AppException } from '../../common/errors/app.exception';
import type { UsersService } from '../users/users.service';
import type { ConversationsService } from '../conversations/conversations.service';
import type { User } from '../users/users.types';
import { UpdateProfileOrchestrator } from './update-profile.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

const noopConversations = {
  applyParticipantUpdate: jest.fn(() => Promise.resolve()),
} as unknown as ConversationsService;

describe('UpdateProfileOrchestrator', () => {
  it('updates the profile, propagates the snapshot, returns a public user (no hash)', async () => {
    const updated: User = {
      ...ohad,
      firstName: 'Oh',
      avatar: {
        storageKey: 'avatars/user-1/a.png',
        srcUrl: 'https://cdn/avatars/user-1/a.png',
      },
    };
    const updateProfile = jest.fn(() => Promise.resolve(updated));
    const applyParticipantUpdate = jest.fn(() => Promise.resolve());
    const orchestrator = new UpdateProfileOrchestrator(
      { updateProfile } as unknown as UsersService,
      { applyParticipantUpdate } as unknown as ConversationsService,
    );

    const result = await orchestrator.run('user-1', { firstName: 'Oh' });

    expect(updateProfile).toHaveBeenCalledWith('user-1', { firstName: 'Oh' });
    expect(applyParticipantUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-1',
        avatarUrl: 'https://cdn/avatars/user-1/a.png',
      }),
    );
    expect(result.user.avatarUrl).toBe('https://cdn/avatars/user-1/a.png');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('propagates the 409 when the email belongs to another user (owned by the service)', async () => {
    const updateProfile = jest.fn(() =>
      Promise.reject(new AppException(409, 'EMAIL_ALREADY_EXISTS', 'taken')),
    );
    const orchestrator = new UpdateProfileOrchestrator(
      { updateProfile } as unknown as UsersService,
      noopConversations,
    );

    await expect(
      orchestrator.run('user-1', { email: 'taken@chat.dev' }),
    ).rejects.toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' });
  });
});
