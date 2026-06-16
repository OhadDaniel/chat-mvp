/** All types for the users module, in one place. */

import { displayName, initialsOf } from './users.helpers';

/* ── Domain ─────────────────────────────────────────────── */

/**
 * The full user as stored — includes the bcrypt hash.
 * This shape must NEVER leave the API.
 */
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  avatarKey: string | null;
};

/**
 * The user's OWN safe shape — returned to that user (auth/me). Includes email.
 * `name` + `avatarInitials` are DERIVED from firstName/lastName so the external
 * contract is unchanged.
 */
export type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatarInitials: string;
  avatarUrl: string | null;
};

/**
 * What other people are allowed to see — a participant or message sender.
 * No email: the UI only shows name + initials, and a counterpart's email
 * must never leave the API.
 */
export type UserProfile = {
  id: string;
  name: string;
  avatarInitials: string;
  avatarUrl: string | null;
};

/* ── Service inputs ─────────────────────────────────────── */

export type CreateUserInput = {
  email: string;
  name: string;
  password: string;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

/* ── Helpers bound to these types ───────────────────────── */

/**
 * `avatarUrl` is DERIVED from the user's avatarKey by the caller (the only
 * place that knows StorageService). These mappers stay pure: they just place
 * the already-resolved url onto the contract shape.
 */
export function mapToPublicUser(
  user: User,
  avatarUrl: string | null,
): PublicUser {
  const { id, email, firstName, lastName } = user;
  return {
    id,
    email,
    firstName,
    lastName,
    name: displayName(firstName, lastName),
    avatarInitials: initialsOf(firstName, lastName),
    avatarUrl,
  };
}

/** Drop email too — the shape safe to hand to other participants. */
export function mapToUserProfile(
  user: User,
  avatarUrl: string | null,
): UserProfile {
  const { id, firstName, lastName } = user;
  return {
    id,
    name: displayName(firstName, lastName),
    avatarInitials: initialsOf(firstName, lastName),
    avatarUrl,
  };
}
