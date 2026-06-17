import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { SignupOrchestrator } from './signup.orchestrator';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [SignupOrchestrator],
  exports: [SignupOrchestrator],
})
export class SignupModule {}
