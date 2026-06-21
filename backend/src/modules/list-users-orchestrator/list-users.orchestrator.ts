import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { mapToUserProfile } from '../users/users.mappers';
import type { ListUsersResponse } from '../users/dto/list-users.response.dto';

@Injectable()
export class ListUsersOrchestrator {
  constructor(private readonly usersService: UsersService) {}

  /**
   * The directory for the new-conversation pickers. The caller is dropped —
   * you can't DM yourself, and you're implicitly in your own group, so listing
   * yourself would only be a dead option. Profiles, never emails: this list is
   * "what other people are allowed to see".
   */
  async execute(currentUserId: string): Promise<ListUsersResponse> {
    const users = await this.usersService.findAll();
    const others = users.filter((user) => user.id !== currentUserId);
    return { users: others.map(mapToUserProfile) };
  }
}
