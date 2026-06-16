import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { SignupOrchestrator } from './signup.orchestrator';

@Module({
  imports: [UsersModule, AuthModule, StorageModule],
  providers: [SignupOrchestrator],
  exports: [SignupOrchestrator],
})
export class SignupModule {}
