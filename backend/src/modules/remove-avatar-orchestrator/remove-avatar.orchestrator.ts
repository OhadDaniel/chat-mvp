import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import { mapToPublicUser } from '../users/users.types';
import type { RemoveAvatarResponse } from '../users/dto/remove-avatar.response.dto';

@Injectable()
export class RemoveAvatarOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
  ) {}

  async execute(userId: string): Promise<RemoveAvatarResponse> {
    // The JWT guard guarantees the user exists.
    const current = await this.usersService.findById(userId);
    const oldKey = current?.avatar?.storageKey ?? null;

    const updated = await this.usersService.setAvatar(userId, null);

    if (oldKey) {
      await this.storage.deleteObject(oldKey);
    }

    return { user: mapToPublicUser(updated) };
  }
}
