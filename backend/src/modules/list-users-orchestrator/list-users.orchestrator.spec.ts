import type { UsersService } from '../users/users.service';
import type { User } from '../users/users.types';
import { ListUsersOrchestrator } from './list-users.orchestrator';

const seeded: User[] = [
  { id: 'user-1', email: 'ohad@chat.dev', firstName: 'Ohad', lastName: 'Daniel', passwordHash: 'h', avatar: null },
  { id: 'user-2', email: 'alice@chat.dev', firstName: 'Alice', lastName: 'Levi', passwordHash: 'h', avatar: null },
  { id: 'user-3', email: 'ben@chat.dev', firstName: 'Ben', lastName: 'Katz', passwordHash: 'h', avatar: null },
];

describe('ListUsersOrchestrator', () => {
  it('returns everyone except the caller, as profiles with no email or hash', async () => {
    const findAll = jest.fn(() => Promise.resolve(seeded));
    const orchestrator = new ListUsersOrchestrator({
      findAll,
    } as unknown as UsersService);

    const result = await orchestrator.execute('user-1');

    // caller dropped — you can't add yourself
    expect(result.users.map((u) => u.id)).toEqual(['user-2', 'user-3']);

    const [alice] = result.users;
    expect(alice).toMatchObject({
      id: 'user-2',
      name: 'Alice Levi',
      avatarInitials: 'AL',
      avatarUrl: null,
    });
    expect(alice).not.toHaveProperty('email');
    expect(alice).not.toHaveProperty('passwordHash');
  });
});
