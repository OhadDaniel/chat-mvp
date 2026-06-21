import { Injectable } from '@nestjs/common';
import { mapToPublicUser } from '../users/users.types';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { InvalidCredentialsError } from '../auth/errors/invalid-credentials.error';
import type { AuthResponse } from '../auth/auth.types';
import type { LoginDto } from '../auth/dto/login.request.dto';

@Injectable()
export class LoginOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (
      !user ||
      !(await this.usersService.verifyPassword(user, dto.password))
    ) {
      throw new InvalidCredentialsError();
    }

    const token = await this.authService.issueToken(user);
    return { token, user: mapToPublicUser(user) };
  }
}
