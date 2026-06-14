import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AuthController } from './auth.controller';
import { SignupOrchestratorModule } from './orchestrators/signup/signup.orchestrator.module';
import { LoginOrchestratorModule } from './orchestrators/login/login.orchestrator.module';
import { MeOrchestratorModule } from './orchestrators/me/me.orchestrator.module';

/**
 * Wires the auth endpoints: imports only the orchestrators for its
 * routes (+ AuthModule for the JWT guard pipeline). No domain service
 * is referenced directly here.
 */
@Module({
  imports: [
    AuthModule,
    SignupOrchestratorModule,
    LoginOrchestratorModule,
    MeOrchestratorModule,
  ],
  controllers: [AuthController],
})
export class AuthControllerModule {}
