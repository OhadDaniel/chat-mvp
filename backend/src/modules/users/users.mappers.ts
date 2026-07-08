import { displayName, initialsOf } from './users.helpers';
import type { PublicUser, User, UserProfile } from './users.types';

/**
 * The user's OWN safe shape — returned to that user (auth/me). Includes email.
 * `name` + `avatarInitials` are derived so the external contract is unchanged.
 */
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
