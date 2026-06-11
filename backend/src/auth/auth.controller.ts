import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  toPublicUser,
  type PublicUser,
  type User,
} from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import type { AuthResponse } from './auth.types';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 201 — creates a user and logs them in immediately. */
  @Post('auth/signup')
  signup(@Body() dto: SignupDto): Promise<AuthResponse> {
    return this.authService.signup(dto);
  }

  /** 200 — login verifies credentials, it doesn't create anything. */
  @Post('auth/login')
  @HttpCode(200)
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  /** Who am I? FE uses this to restore the session on page refresh. */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: User): { user: PublicUser } {
    return { user: toPublicUser(user) };
  }
}
