import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '../users/users.types';
import type { JwtPayload } from './auth.types';


@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}


  issueToken(user: User): Promise<string> {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.signAsync(payload);
  }
}
