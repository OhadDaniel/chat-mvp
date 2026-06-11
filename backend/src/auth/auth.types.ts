import type { PublicUser } from '../users/entities/user.entity';

/**
 * What we put inside the JWT — and nothing more.
 * JWTs are encoded, not encrypted: anyone can read this.
 */
export type JwtPayload = {
  /** standard "subject" claim — the user id */
  sub: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: PublicUser;
};
