import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import type { AuthResponse } from '../auth/auth.types';
import { LoginDto } from '../auth/dto/login.request.dto';
import { SignupDto } from '../auth/dto/signup.request.dto';
import { SignupOrchestrator } from '../signup-orchestrator/signup.orchestrator';
import { LoginOrchestrator } from '../login-orchestrator/login.orchestrator';

@Controller()
export class AuthController {
  constructor(
    private readonly signupOrchestrator: SignupOrchestrator,
    private readonly loginOrchestrator: LoginOrchestrator,
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
}
