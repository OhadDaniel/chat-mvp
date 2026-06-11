import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppException } from '../common/errors/app.exception';
import { toPublicUser, type User } from '../users/users.types';
import { UsersService } from '../users/users.service';
import type { AuthResponse, JwtPayload } from './auth.types';
import type { LoginDto } from './dto/login.dto';
import type { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResponse> {
    // UsersService owns hashing + email uniqueness (throws 409)
    const user = await this.usersService.create(dto);
    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (
      !user ||
      !(await this.usersService.verifyPassword(user, dto.password))
    ) {
      throw new AppException(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  private async buildAuthResponse(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { token, user: toPublicUser(user) };
  }
}
