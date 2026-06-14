import type { PublicUser } from '../users/users.types';

/**
 * What we put inside the JWT — and nothing more.
 * JWTs are encoded, not encrypted: anyone can read this.
 * Only `sub` is used (validate() loads the fresh user by id); email is
 * deliberately omitted — it was never read and would go stale on change.
 */
export type JwtPayload = {
  /** standard "subject" claim — the user id */
  sub: string;
};

export type AuthResponse = {
  token: string;
  user: PublicUser;
};
