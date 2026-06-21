import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { isOwnedAvatarKey } from '../storage/storage.helpers';
import { AvatarNotUploadedError } from '../storage/errors/avatar-not-uploaded.error';
import { InvalidAvatarKeyError } from '../storage/errors/invalid-avatar-key.error';
import { UsersService } from '../users/users.service';
import { mapToPublicUser, type Avatar } from '../users/users.types';
import type { SetAvatarResponse } from '../users/dto/set-avatar.response.dto';

@Injectable()
export class SetAvatarOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
  ) {}

  async execute(userId: string, key: string): Promise<SetAvatarResponse> {
    if (!isOwnedAvatarKey(userId, key)) {
      throw new InvalidAvatarKeyError();
    }

    // Trust, but verify: only claim a key that actually points at an object.
    if (!(await this.storage.objectExists(key))) {
      throw new AvatarNotUploadedError();
    }

    // The JWT guard guarantees the user exists.
    const current = await this.usersService.findById(userId);
    const oldKey = current?.avatar?.storageKey ?? null;

    const avatar: Avatar = {
      storageKey: key,
      srcUrl: this.storage.srcUrlFor(key),
    };
    const updated = await this.usersService.setAvatar(userId, avatar);

    if (oldKey && oldKey !== key) {
      await this.storage.deleteObject(oldKey);
    }

    return { user: mapToPublicUser(updated) };
  }
}
