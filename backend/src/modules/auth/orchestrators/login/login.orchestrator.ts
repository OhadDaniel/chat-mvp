import { Injectable } from '@nestjs/common';
import { AppException } from '../../../../common/errors/app.exception';
import { toPublicUser } from '../../../users/users.types';
import { UsersService } from '../../../users/users.service';
import { AuthService } from '../../auth.service';
import type { AuthResponse } from '../../auth.types';
import type { LoginDto } from '../../dto/login.dto';

/**
 * POST /auth/login — verifies credentials via UsersService, then issues
 * a token. The single 401 for both "unknown email" and "wrong password"
 * (no user enumeration) lives here, not in either service.
 */
@Injectable()
export class LoginOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async run(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (
      !user ||
      !(await this.usersService.verifyPassword(user, dto.password))
    ) {
      throw new AppException(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const token = await this.authService.issueToken(user);
    return { token, user: toPublicUser(user) };
  }
}
