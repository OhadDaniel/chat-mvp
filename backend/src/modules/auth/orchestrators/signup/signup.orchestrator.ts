import { Injectable } from '@nestjs/common';
import { toPublicUser } from '../../../users/users.types';
import { UsersService } from '../../../users/users.service';
import { AuthService } from '../../auth.service';
import type { AuthResponse } from '../../auth.types';
import type { SignupDto } from '../../dto/signup.dto';

/**
 * POST /auth/signup — composes user creation (UsersService owns hashing
 * + email uniqueness) with token issuance, and maps to the response.
 */
@Injectable()
export class SignupOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async run(dto: SignupDto): Promise<AuthResponse> {
    const user = await this.usersService.create(dto);
    const token = await this.authService.issueToken(user);
    return { token, user: toPublicUser(user) };
  }
}
