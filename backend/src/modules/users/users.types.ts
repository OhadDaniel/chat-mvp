/** All types for the users module, in one place. */

import { displayName, initialsOf } from './users.helpers';

/* ── Value objects ──────────────────────────────────────── */

/**
 * A stored avatar: the S3 key (kept to delete the object later) and the public
 * CloudFront URL. Both are resolved once, at upload time — reads return srcUrl.
 */
export type Avatar = {
  storageKey: string;
  srcUrl: string;
};

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
  avatar: Avatar | null;
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

/* ── Mappers ────────────────────────────────────────────── */

export function mapToPublicUser(user: User): PublicUser {
  const { id, email, firstName, lastName } = user;
  return {
    id,
    email,
    firstName,
    lastName,
    name: displayName(firstName, lastName),
    avatarInitials: initialsOf(firstName, lastName),
    avatarUrl: user.avatar?.srcUrl ?? null,
  };
}

/** Drop email too — the shape safe to hand to other participants. */
export function mapToUserProfile(user: User): UserProfile {
  const { id, firstName, lastName } = user;
  return {
    id,
    name: displayName(firstName, lastName),
    avatarInitials: initialsOf(firstName, lastName),
    avatarUrl: user.avatar?.srcUrl ?? null,
  };
}
