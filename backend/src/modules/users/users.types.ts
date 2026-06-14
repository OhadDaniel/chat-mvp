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

/** The user's OWN safe shape — returned to that user (auth/me). Includes email. */
export type PublicUser = Omit<User, 'passwordHash'>;

/**
 * What other people are allowed to see — a participant or message sender.
 * No email: the UI only shows name + initials, and a counterpart's email
 * must never leave the API.
 */
export type UserProfile = Omit<PublicUser, 'email'>;

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

/** Drop email too — the shape safe to hand to other participants. */
export function toUserProfile(user: User): UserProfile {
  const { id, name, avatarInitials } = user;
  return { id, name, avatarInitials };
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
