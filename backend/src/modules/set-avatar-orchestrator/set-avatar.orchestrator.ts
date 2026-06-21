import { Injectable } from '@nestjs/common';
import { AppException } from '../../common/errors/app.exception';
import { StorageService } from '../storage/storage.service';
import { isOwnedAvatarKey } from '../storage/storage.helpers';
import { UsersService } from '../users/users.service';
import {
  mapToPublicUser,
  type Avatar,
  type PublicUser,
} from '../users/users.types';

export type SetAvatarResponse = { user: PublicUser };

@Injectable()
export class SetAvatarOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
  ) {}

  async run(userId: string, key: string): Promise<SetAvatarResponse> {
    if (!isOwnedAvatarKey(userId, key)) {
      throw new AppException(
        400,
        'INVALID_AVATAR_KEY',
        'Avatar key does not belong to this user',
      );
    }

    // Trust, but verify: only claim a key that actually points at an object.
    if (!(await this.storage.objectExists(key))) {
      throw new AppException(
        400,
        'AVATAR_NOT_UPLOADED',
        'No uploaded image was found for this key',
      );
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
