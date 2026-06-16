import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import { mapToPublicUser, type PublicUser } from '../users/users.types';

export type RemoveAvatarResponse = { user: PublicUser };

@Injectable()
export class RemoveAvatarOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
  ) {}

  async run(userId: string): Promise<RemoveAvatarResponse> {
    // The JWT guard guarantees the user exists.
    const current = await this.usersService.findById(userId);
    const oldKey = current?.avatarKey ?? null;

    const updated = await this.usersService.setAvatarKey(userId, null);

    if (oldKey) {
      await this.storage.deleteObject(oldKey);
    }

    return { user: mapToPublicUser(updated, null) };
  }
}
