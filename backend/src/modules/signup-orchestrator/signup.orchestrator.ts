import { Injectable } from '@nestjs/common';
import { mapToPublicUser } from '../users/users.types';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import type { AuthResponse } from '../auth/auth.types';
import type { SignupDto } from '../auth/dto/signup.request.dto';

@Injectable()
export class SignupOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async execute(dto: SignupDto): Promise<AuthResponse> {
    const user = await this.usersService.create(dto);
    const token = await this.authService.issueToken(user);
    return { token, user: mapToPublicUser(user) };
  }
}
