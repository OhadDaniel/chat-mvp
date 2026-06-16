import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';
import { UpdateProfileOrchestrator } from './update-profile.orchestrator';

@Module({
  imports: [UsersModule, StorageModule],
  providers: [UpdateProfileOrchestrator],
  exports: [UpdateProfileOrchestrator],
})
export class UpdateProfileModule {}
