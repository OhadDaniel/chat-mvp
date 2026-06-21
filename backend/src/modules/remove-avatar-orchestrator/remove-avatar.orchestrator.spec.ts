import type { UsersService } from '../users/users.service';
import type { User } from '../users/users.types';
import { RemoveAvatarOrchestrator } from './remove-avatar.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

describe('RemoveAvatarOrchestrator', () => {
  it('clears the profile avatar and returns a null avatarUrl', async () => {
    const setAvatar = jest.fn(() => Promise.resolve({ ...ohad, avatar: null }));
    const orchestrator = new RemoveAvatarOrchestrator({
      setAvatar,
    } as unknown as UsersService);

    const result = await orchestrator.execute('user-1');

    expect(setAvatar).toHaveBeenCalledWith('user-1', null);
    expect(result.user.avatarUrl).toBeNull();
  });
});
