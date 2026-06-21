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
  const base: User = {
    id: 'user-1',
    email: 'a@b.c',
    firstName: 'Ohad',
    lastName: 'Daniel',
    passwordHash: '$2b$10$secret',
    avatar: null,
  };

  it('strips the password hash and derives name + initials (no avatar)', () => {
    const publicUser = mapToPublicUser(base);

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

  it('exposes the stored avatar srcUrl as avatarUrl', () => {
    const withAvatar: User = {
      ...base,
      avatar: { storageKey: 'avatars/user-1/a.png', srcUrl: 'https://cdn/a.png' },
    };

    expect(mapToPublicUser(withAvatar).avatarUrl).toBe('https://cdn/a.png');
  });
});
