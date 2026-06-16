import { Injectable } from '@nestjs/common';
import { AppException } from '../../common/errors/app.exception';
import { StorageService } from '../storage/storage.service';
import { mapToPublicUser } from '../users/users.types';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import type { AuthResponse } from '../auth/auth.types';
import type { LoginDto } from '../auth/dto/login.dto';


@Injectable()
export class LoginOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly storage: StorageService,
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
    return {
      token,
      user: mapToPublicUser(user, this.storage.publicUrl(user.avatarKey)),
    };
  }
}
