import type { PublicUser } from '../users/users.types';


export type JwtPayload = {
  
  sub: string;
};

export type AuthResponse = {
  token: string;
  user: PublicUser;
};
