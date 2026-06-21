import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UpdateProfileOrchestrator } from './update-profile.orchestrator';

@Module({
  imports: [UsersModule],
  providers: [UpdateProfileOrchestrator],
  exports: [UpdateProfileOrchestrator],
})
export class UpdateProfileModule {}
