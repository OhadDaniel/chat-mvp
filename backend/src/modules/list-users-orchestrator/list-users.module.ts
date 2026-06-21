import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ListUsersOrchestrator } from './list-users.orchestrator';

@Module({
  imports: [UsersModule],
  providers: [ListUsersOrchestrator],
  exports: [ListUsersOrchestrator],
})
export class ListUsersModule {}
