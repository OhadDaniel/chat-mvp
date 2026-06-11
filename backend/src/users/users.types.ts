/** All types for the users module, in one place. */

/* ── Domain ─────────────────────────────────────────────── */

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

/** The user shape that is safe to return to clients. */
export type PublicUser = Omit<User, 'passwordHash'>;

/* ── Service inputs ─────────────────────────────────────── */

export type CreateUserInput = {
  email: string;
  name: string;
  password: string;
};

/* ── Storage rows (snake_case, as Postgres returns them) ──
   Only the repository should import these. */

export type UserRow = {
  id: string;
  email: string;
  name: string;
  avatar_initials: string;
  password_hash: string;
};

/* ── Helpers bound to these types ───────────────────────── */

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
