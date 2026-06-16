import { initialsOf } from '../users.helpers';
import { mapToPublicUser, type User } from '../users.types';

describe('initialsOf', () => {
  it('takes the first letter of firstName and lastName, uppercased', () => {
    expect(initialsOf('Ohad', 'Daniel')).toBe('OD');
  });

  it('handles single names and messy whitespace', () => {
    expect(initialsOf('alice', '')).toBe('A');
    expect(initialsOf('  alice  ', '  levi  ')).toBe('AL');
  });
});

describe('mapToPublicUser', () => {
  it('strips the password hash and derives name + initials', () => {
    const user: User = {
      id: 'user-1',
      email: 'a@b.c',
      firstName: 'Ohad',
      lastName: 'Daniel',
      passwordHash: '$2b$10$secret',
      avatarKey: null,
    };

    const publicUser = mapToPublicUser(user, null);

    expect(publicUser).toEqual({
      id: 'user-1',
      email: 'a@b.c',
      firstName: 'Ohad',
      lastName: 'Daniel',
      name: 'Ohad Daniel',
      avatarInitials: 'OD',
      avatarUrl: null,
    });
    expect(publicUser).not.toHaveProperty('passwordHash');
  });
});
