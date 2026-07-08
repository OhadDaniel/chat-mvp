import { Controller, Get, UseGuards } from '@nestjs/common';
import type { User } from '../users/users.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListUsersOrchestrator } from '../list-users-orchestrator/list-users.orchestrator';
import type { ListUsersResponse } from '../users/dto/list-users.response.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly listUsersOrchestrator: ListUsersOrchestrator) {}

  /** The directory the new-conversation pickers list (everyone but the caller). */
  @Get()
  list(@CurrentUser() user: User): Promise<ListUsersResponse> {
    return this.listUsersOrchestrator.execute(user.id);
  }
}
