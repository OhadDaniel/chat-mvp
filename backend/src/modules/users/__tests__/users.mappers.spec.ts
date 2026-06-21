import { mapToPublicUser } from '../users.mappers';
import type { User } from '../users.types';

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
