import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { mapToPublicUser } from '../users/users.mappers';
import type { RemoveAvatarResponse } from '../users/dto/remove-avatar.response.dto';

@Injectable()
export class RemoveAvatarOrchestrator {
  constructor(private readonly usersService: UsersService) {}

  async execute(userId: string): Promise<RemoveAvatarResponse> {
    // Clearing the profile's avatar is the whole operation. The stored object
    // is left in place (one fixed key per user, overwritten on the next upload),
    // so there is no post-commit S3 delete that could fail an already-saved change.
    const updated = await this.usersService.setAvatar(userId, null);

    return { user: mapToPublicUser(updated) };
  }
}
