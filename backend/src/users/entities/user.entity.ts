/**
 * The full user as stored — includes the bcrypt hash.
 * This shape must NEVER leave the API.
 */
export type User = {
  id: string;
  email: string;
  name: string;
  avatarInitials: string;
  passwordHash: string;
};

/**
 * The user shape that is safe to return to clients.
 */
export type PublicUser = Omit<User, 'passwordHash'>;

export function toPublicUser(user: User): PublicUser {
  const { id, email, name, avatarInitials } = user;
  return { id, email, name, avatarInitials };
}

/** "Ohad Daniel" -> "OD", "alice" -> "A" */
export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
