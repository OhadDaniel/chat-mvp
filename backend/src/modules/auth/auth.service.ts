import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '../users/users.types';
import type { JwtPayload } from './auth.types';

/**
 * Single-domain auth service: token issuance only. Credential checking
 * and user creation belong to UsersService; composing the two into an
 * AuthResponse is the login/signup orchestrators' job.
 */
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /** Sign a JWT carrying just the user id. */
  issueToken(user: User): Promise<string> {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.signAsync(payload);
  }
}
