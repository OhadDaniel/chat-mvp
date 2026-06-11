import { initialsOf, toPublicUser, type User } from '../users.types';

describe('initialsOf', () => {
  it('takes the first letter of the first two words, uppercased', () => {
    expect(initialsOf('Ohad Daniel')).toBe('OD');
    expect(initialsOf('ohad daniel cohen')).toBe('OD'); // max two
  });

  it('handles single names and messy whitespace', () => {
    expect(initialsOf('alice')).toBe('A');
    expect(initialsOf('  alice   levi  ')).toBe('AL');
  });
});

describe('toPublicUser', () => {
  it('strips the password hash and keeps everything else', () => {
    const user: User = {
      id: 'user-1',
      email: 'a@b.c',
      name: 'A',
      avatarInitials: 'A',
      passwordHash: '$2b$10$secret',
    };

    const publicUser = toPublicUser(user);

    expect(publicUser).toEqual({
      id: 'user-1',
      email: 'a@b.c',
      name: 'A',
      avatarInitials: 'A',
    });
    expect(publicUser).not.toHaveProperty('passwordHash');
  });
});
