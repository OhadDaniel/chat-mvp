import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { buildAvatarKey } from '../storage/storage.helpers';
import { UsersService } from '../users/users.service';
import type { Avatar } from '../users/users.types';
import { mapToPublicUser } from '../users/users.mappers';
import type { SetAvatarResponse } from '../users/dto/set-avatar.response.dto';

@Injectable()
export class SetAvatarOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
  ) {}

  async execute(userId: string): Promise<SetAvatarResponse> {
    // The key is derived from the user, not sent by the client, and the upload
    // overwrote it in place — so there is nothing to validate and no old object
    // to delete. We just point the profile at the (single, stable) key.
    const key = buildAvatarKey(userId);
    const avatar: Avatar = {
      storageKey: key,
      srcUrl: this.storage.srcUrlFor(key),
    };
    const updated = await this.usersService.setAvatar(userId, avatar);

    return { user: mapToPublicUser(updated) };
  }
}
