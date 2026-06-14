import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { PublicUser, User } from '../users/users.types';
import type { AuthResponse } from './auth.types';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupOrchestrator } from './orchestrators/signup/signup.orchestrator';
import { LoginOrchestrator } from './orchestrators/login/login.orchestrator';
import { MeOrchestrator } from './orchestrators/me/me.orchestrator';

@Controller()
export class AuthController {
  constructor(
    private readonly signupOrchestrator: SignupOrchestrator,
    private readonly loginOrchestrator: LoginOrchestrator,
    private readonly meOrchestrator: MeOrchestrator,
  ) {}

  /** 201 — creates a user and logs them in immediately. */
  @Post('auth/signup')
  signup(@Body() dto: SignupDto): Promise<AuthResponse> {
    return this.signupOrchestrator.run(dto);
  }

  /** 200 — login verifies credentials, it doesn't create anything. */
  @Post('auth/login')
  @HttpCode(200)
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.loginOrchestrator.run(dto);
  }

  /** Who am I? FE uses this to restore the session on page refresh. */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: User): { user: PublicUser } {
    return this.meOrchestrator.run(user);
  }
}
