import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { LoginOrchestrator } from './login.orchestrator';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [LoginOrchestrator],
  exports: [LoginOrchestrator],
})
export class LoginModule {}
